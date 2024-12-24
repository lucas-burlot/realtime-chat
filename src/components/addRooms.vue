<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 class="text-xl font-semibold mb-4">Ajouter un Salon</h2>
      <input
        type="text"
        v-model="roomName"
        placeholder="Nom du salon"
        class="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
      <div class="flex justify-end">
        <button
          class="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 mr-2 hover:bg-gray-400 transition-colors"
          @click="closePopup"
        >
          Annuler
        </button>
        <button
          @click="addRoom(roomName)"
          class="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
        >
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const roomName = ref('')
const emit = defineEmits(['close', 'add-room'])

function closePopup() {
  emit('close')
}

const addRoom = (roomName: string) => {
  // Emit an event to the parent to add the room
  emit('add-room', roomName)
  closePopup()
}
</script>

<style scoped>
/* Les styles sont gérés par Tailwind */
</style>
