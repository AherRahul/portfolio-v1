import { v2 as cloudinary } from 'cloudinary'

// Helper to verify admin authentication
function verifyAdmin(event: any) {
  const token = getCookie(event, 'admin-token')

  if (!token || !global.adminTokens || !global.adminTokens.has(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
}

export default defineEventHandler(async (event) => {
  try {
    verifyAdmin(event)

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const form = await readMultipartFormData(event)
    
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file provided'
      })
    }

    const file = form[0]
    const folder = form.find(f => f.name === 'folder')?.data.toString() || 'portfolio'
    const resourceType = form.find(f => f.name === 'resourceType')?.data.toString() || 'auto'

    if (!file.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      })
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType as 'image' | 'video' | 'raw' | 'auto',
          transformation: resourceType === 'image' ? [
            { quality: 'auto', fetch_format: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(file.data)
    })

    return {
      success: true,
      url: (uploadResult as any).secure_url,
      publicId: (uploadResult as any).public_id,
      format: (uploadResult as any).format,
      resourceType: (uploadResult as any).resource_type
    }

  } catch (error: any) {
    console.error('Upload error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to upload file'
    })
  }
})

