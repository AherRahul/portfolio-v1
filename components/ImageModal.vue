<script setup lang="ts">
const { isModalOpen, modalImageSrc, modalImageAlt, closeModal } = useImageModal()

const zoomLevel = ref(1)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const translateX = ref(0)
const translateY = ref(0)

const modalRef = ref<HTMLElement>()
const imageRef = ref<HTMLImageElement>()

// Watch for modal open/close to manage body scroll and reset zoom
watch(isModalOpen, (newValue) => {
  if (newValue) {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    // Reset zoom and position
    zoomLevel.value = 1
    translateX.value = 0
    translateY.value = 0
  } else {
    // Restore body scroll
    document.body.style.overflow = ''
  }
})

const close = () => {
  closeModal()
}

const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value += 0.5
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.5
    // Reset position if zoomed out to prevent image being off-screen
    if (zoomLevel.value === 1) {
      translateX.value = 0
      translateY.value = 0
    }
  }
}

const resetZoom = () => {
  zoomLevel.value = 1
  translateX.value = 0
  translateY.value = 0
}

const handleMouseDown = (event: MouseEvent) => {
  if (zoomLevel.value > 1) {
    isDragging.value = true
    dragStartX.value = event.clientX - translateX.value
    dragStartY.value = event.clientY - translateY.value
    event.preventDefault()
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value && zoomLevel.value > 1) {
    translateX.value = event.clientX - dragStartX.value
    translateY.value = event.clientY - dragStartY.value
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isModalOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      close()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  // Ensure body scroll is restored
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isModalOpen"
        ref="modalRef"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        @click.self="close"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          @click="close"
          aria-label="Close modal"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Zoom controls -->
        <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <button
            class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            @click="zoomIn"
            :disabled="zoomLevel >= 3"
            aria-label="Zoom in"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <button
            class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            @click="zoomOut"
            :disabled="zoomLevel <= 0.5"
            aria-label="Zoom out"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          
          <button
            class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            @click="resetZoom"
            aria-label="Reset zoom"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <!-- Zoom level indicator -->
        <div class="absolute bottom-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {{ Math.round(zoomLevel * 100) }}%
        </div>

        <!-- Image container -->
        <div 
          class="flex items-center justify-center w-full h-full overflow-hidden"
          :class="{ 'cursor-grab': zoomLevel > 1 && !isDragging, 'cursor-grabbing': isDragging }"
        >
          <img
            ref="imageRef"
            :src="modalImageSrc"
            :alt="modalImageAlt"
            class="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
            :style="{
              transform: `scale(${zoomLevel}) translate(${translateX / zoomLevel}px, ${translateY / zoomLevel}px)`,
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }"
            @mousedown="handleMouseDown"
            @dragstart.prevent
          />
        </div>

        <!-- Instructions -->
        <div class="absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-xs max-w-xs">
          <div class="mb-1">ESC: Close</div>
          <div class="mb-1">+/-: Zoom</div>
          <div>0: Reset zoom</div>
          <div v-if="zoomLevel > 1">Drag to pan</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
