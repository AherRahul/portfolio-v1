export const useContentImages = () => {
  const { openModal } = useImageModal()

  const setupContentImages = (containerSelector: string = '.prose') => {
    if (process.server) return

    // Function to setup images
    const setupImages = () => {
      const containers = document.querySelectorAll(containerSelector)
      
      containers.forEach(container => {
        const images = container.querySelectorAll('img')
        
        images.forEach((img: HTMLImageElement, index: number) => {
          // Skip if already has click handler
          if (img.dataset.imageModalSetup) return
          
          // Mark as setup
          img.dataset.imageModalSetup = 'true'
          
          // Add click handler
          img.addEventListener('click', () => {
            openModal(img.src, img.alt || 'Image')
          })
          
          // Apply intro styling to the first image
          if (index === 0) {
            // Apply intro image styling - larger and more prominent
            img.classList.add('intro-image')
            
            // Add smooth transition for responsive changes
            img.style.transition = 'max-width 0.3s ease, height 0.3s ease, opacity 0.2s ease'
            
            // Responsive sizing function
            const applyResponsiveIntroSizing = () => {
              const width = window.innerWidth
              
              if (width < 640) {
                // Mobile (sm breakpoint and below) - Full width, moderate height
                img.style.maxWidth = '100%'
                img.style.height = '16rem' // 256px
              } else if (width < 768) {
                // Small tablets (between sm and md) - Full width, taller
                img.style.maxWidth = '100%'
                img.style.height = '20rem' // 320px
              } else if (width < 1024) {
                // Tablets (between md and lg) - Constrained width, good height
                img.style.maxWidth = '48rem' // 768px
                img.style.height = '24rem' // 384px
              } else if (width < 1280) {
                // Small desktops (between lg and xl) - Larger width and height
                img.style.maxWidth = '56rem' // 896px
                img.style.height = '28rem' // 448px
              } else {
                // Large desktops (xl and above) - Maximum size for prominence
                img.style.maxWidth = '64rem' // 1024px
                img.style.height = '36rem' // 576px
              }
            }
            
            // Apply initial sizing
            applyResponsiveIntroSizing()
            
            // Debounced resize handler for better performance
            let resizeTimeout: NodeJS.Timeout
            const resizeHandler = () => {
              clearTimeout(resizeTimeout)
              resizeTimeout = setTimeout(applyResponsiveIntroSizing, 150)
            }
            
            window.addEventListener('resize', resizeHandler)
            
            // Store cleanup function on the image for potential cleanup
            ;(img as any).__introCleanup = () => {
              window.removeEventListener('resize', resizeHandler)
              if (resizeTimeout) clearTimeout(resizeTimeout)
            }
          }
          
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

    // Enhanced cleanup function
    const cleanup = () => {
      // Disconnect the observer
      observer.disconnect()
      
      // Clean up intro image event listeners
      const containers = document.querySelectorAll(containerSelector)
      containers.forEach(container => {
        const introImages = container.querySelectorAll('img.intro-image')
        introImages.forEach((img: any) => {
          if (img.__introCleanup) {
            img.__introCleanup()
          }
        })
      })
    }
    
    // Return cleanup function for manual cleanup if needed
    return cleanup
  }

  return {
    setupContentImages
  }
}
