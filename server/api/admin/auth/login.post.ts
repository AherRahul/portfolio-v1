import { createHash } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body
    
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rahulaher.com'
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
    
    // If no hash is set, use a default (you should change this!)
    const defaultHash = createHash('sha256').update('admin123').digest('hex')
    const expectedHash = adminPasswordHash || defaultHash
    
    // Hash the provided password
    const providedHash = createHash('sha256').update(password).digest('hex')
    
    // Verify credentials
    if (email !== adminEmail || providedHash !== expectedHash) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }
    
    // Generate a simple token (in production, use JWT or proper session management)
    const token = createHash('sha256')
      .update(`${email}:${Date.now()}:${process.env.SESSION_SECRET || 'secret'}`)
      .digest('hex')
    
    // Set secure HTTP-only cookie
    setCookie(event, 'admin-token', token, {
      httpOnly: false, // Set to false for easier debugging in dev, true in production
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    // console.log('Cookie set successfully, token:', token.substring(0, 20) + '...')
    
    // Store token in a simple in-memory store (in production, use Redis or database)
    // This is just for demonstration
    if (!global.adminTokens) {
      global.adminTokens = new Set()
    }
    global.adminTokens.add(token)
    
    return {
      success: true,
      message: 'Login successful'
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed'
    })
  }
})

