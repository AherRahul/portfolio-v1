export const useContentImages = () => {
  const { openModal } = useImageModal()

  const setupContentImages = (containerSelector: string = '.prose') => {
    if (process.server) return

    // Function to setup images
    const setupImages = () => {
      const containers = document.querySelectorAll(containerSelector)
      
      containers.forEach(container => {
        const images = container.querySelectorAll('img')
        
        images.forEach((img: HTMLImageElement) => {
          // Skip if already has click handler
          if (img.dataset.imageModalSetup) return
          
          // Mark as setup
          img.dataset.imageModalSetup = 'true'
          
          // Add click handler
          img.addEventListener('click', () => {
            openModal(img.src, img.alt || 'Image')
          })
          
          // Add visual feedback classes
          img.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity', 'duration-200')
        })
      })
    }

    // Immediate setup for already rendered content
    nextTick(setupImages)

    // Watch for dynamically loaded content (like LazyContentReader)
    const observer = new MutationObserver(() => {
      setupImages()
    })

    // Start observing the document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Cleanup function
    const cleanup = () => observer.disconnect()
    
    // Return cleanup function for manual cleanup if needed
    return cleanup
  }

  return {
    setupContentImages
  }
}
