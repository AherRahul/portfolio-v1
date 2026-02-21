export const useContentImages = () => {
  const { openModal } = useImageModal()

  const setupContentImages = (containerSelector: string = '.prose') => {
    if (process.server) return

    const setupImages = () => {
      const containers = document.querySelectorAll(containerSelector)

      containers.forEach(container => {
        const images = container.querySelectorAll('img')

        images.forEach((img: HTMLImageElement, index: number) => {
          // Skip if already wrapped
          if (img.dataset.imageModalSetup) return
          img.dataset.imageModalSetup = 'true'

          const isIntro = index === 0

          // ── Build wrapper ──────────────────────────────────────────────
          const wrapper = document.createElement('div')
          wrapper.className = 'content-img-wrapper'
          wrapper.style.cssText = [
            'position: relative',
            'display: block',
            'width: 100%',
            'max-width: ' + (isIntro ? '100%' : '42rem'),
            'height: ' + (isIntro ? '28rem' : '20rem'),
            'overflow: hidden',
            'border-radius: 0.75rem',
            'border: 1px solid rgba(255,255,255,0.08)',
            'background: rgba(0,0,0,0.25)',
            'margin-top: 1.25rem',
            'margin-bottom: 1.5rem',
            'cursor: pointer',
            'box-shadow: 0 4px 24px rgba(0,0,0,0.35)',
          ].join(';')

          // ── Style the image to fill the wrapper cleanly ────────────────
          // object-fit: contain → always show the full image, no cropping
          img.style.cssText = [
            'width: 100%',
            'height: 100%',
            'object-fit: contain',
            'object-position: center',
            'display: block',
            'transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
            'border-radius: 0',
            'margin: 0',
            'max-width: unset',
          ].join(';')

          // ── Zoom overlay (shown on hover) ──────────────────────────────
          const overlay = document.createElement('div')
          overlay.className = 'content-img-overlay'
          overlay.style.cssText = [
            'position: absolute',
            'inset: 0',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'opacity: 0',
            'transition: opacity 0.25s ease, background 0.25s ease',
            'border-radius: 0.75rem',
            'pointer-events: none',
          ].join(';')

          // Expand icon + label
          overlay.innerHTML = `
            <div style="
              display:flex;flex-direction:column;align-items:center;gap:0.4rem;
              background:rgba(0,0,0,0.62);
              backdrop-filter:blur(6px);
              -webkit-backdrop-filter:blur(6px);
              border-radius:0.6rem;
              padding:0.6rem 1.1rem;
              border:1px solid rgba(255,255,255,0.14);
              color:rgba(255,255,255,0.92);
              font-size:0.7rem;
              font-family:inherit;
              letter-spacing:0.04em;
              font-weight:500;
              pointer-events:none;
              user-select:none;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
              <span>Click to expand</span>
            </div>`

          // ── Hover effects ──────────────────────────────────────────────
          wrapper.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.04)'
            img.style.opacity = '0.88'
            overlay.style.opacity = '1'
            overlay.style.background = 'rgba(0,0,0,0.18)'
          })
          wrapper.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)'
            img.style.opacity = '1'
            overlay.style.opacity = '0'
            overlay.style.background = 'transparent'
          })

          // ── Click → open modal ─────────────────────────────────────────
          wrapper.addEventListener('click', () => {
            openModal(img.src, img.alt || 'Image')
          })

          // ── Responsive height for intro image ──────────────────────────
          if (isIntro) {
            const applyResponsiveIntroSizing = () => {
              const w = window.innerWidth
              wrapper.style.height =
                w < 640 ? '16rem' :
                  w < 768 ? '20rem' :
                    w < 1024 ? '24rem' :
                      w < 1280 ? '28rem' : '34rem'
            }
            applyResponsiveIntroSizing()
            let resizeTimeout: NodeJS.Timeout
            const resizeHandler = () => {
              clearTimeout(resizeTimeout)
              resizeTimeout = setTimeout(applyResponsiveIntroSizing, 150)
            }
            window.addEventListener('resize', resizeHandler)
              ; (wrapper as any).__introCleanup = () => {
                window.removeEventListener('resize', resizeHandler)
                if (resizeTimeout) clearTimeout(resizeTimeout)
              }
          }

          // ── Insert wrapper into DOM ────────────────────────────────────
          // Nuxt Content renders `![alt](src)` as <p><img></p>.
          // Inserting a block-level div inside <p> is invalid HTML and breaks layout.
          // When the parent <p> contains only this image, we replace the <p> itself.
          const parent = img.parentNode as HTMLElement
          const isAloneInP =
            parent?.tagName === 'P' &&
            parent.childNodes.length === 1

          if (isAloneInP) {
            // Replace the whole <p> with our wrapper
            parent.parentNode?.insertBefore(wrapper, parent)
            wrapper.appendChild(img)
            wrapper.appendChild(overlay)
            parent.parentNode?.removeChild(parent)
          } else {
            // Not a lone-img paragraph – just wrap the img where it sits
            img.parentNode?.insertBefore(wrapper, img)
            wrapper.appendChild(img)
            wrapper.appendChild(overlay)
          }
        })
      })
    }

    nextTick(setupImages)

    const observer = new MutationObserver(setupImages)
    observer.observe(document.body, { childList: true, subtree: true })

    const cleanup = () => {
      observer.disconnect()
      const containers = document.querySelectorAll(containerSelector)
      containers.forEach(container => {
        container.querySelectorAll('.content-img-wrapper').forEach((w: any) => {
          if (w.__introCleanup) w.__introCleanup()
        })
      })
    }

    return cleanup
  }

  return { setupContentImages }
}
