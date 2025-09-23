export const useImageModal = () => {
  // Use useState for global state management in Nuxt 3
  const isModalOpen = useState<boolean>('imageModal.isOpen', () => false)
  const modalImageSrc = useState<string>('imageModal.src', () => '')
  const modalImageAlt = useState<string>('imageModal.alt', () => '')

  const openModal = (src: string, alt: string = '') => {
    modalImageSrc.value = src
    modalImageAlt.value = alt
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    modalImageSrc.value = ''
    modalImageAlt.value = ''
  }

  return {
    isModalOpen,
    modalImageSrc,
    modalImageAlt,
    openModal,
    closeModal
  }
}
