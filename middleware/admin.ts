export default defineNuxtRouteMiddleware((to) => {
  // Check if user is authenticated
  const token = useCookie('admin-token')
  
  console.log('Admin middleware - Path:', to.path)
  console.log('Admin middleware - Token exists:', !!token.value)
  
  if (!token.value) {
    console.log('No token found, redirecting to login')
    // Redirect to admin login if not authenticated
    return navigateTo('/admin/login')
  }
  
  console.log('Token found, allowing access')
})

