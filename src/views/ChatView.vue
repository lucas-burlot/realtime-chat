<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Header avec dégradé moderne -->
    <header class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
      <h1 class="text-2xl font-bold">Chat en temps réel</h1>
    </header>

    <div class="flex flex-1 gap-4 p-4 max-h-[calc(100vh-8rem)]">
      <!-- Sidebar avec les salons -->
      <aside class="w-72 bg-white rounded-xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">Salons</h2>
          <button
            @click="openAddRoomPopup"
            class="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
          >
            + Nouveau
          </button>
        </div>
        <ul class="space-y-2">
          <li v-for="salon in rooms" :key="salon.id">
            <button
              class="w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-2 hover:bg-gray-100"
              :class="{ 'bg-indigo-50 text-indigo-600': salon.id === actualRoom }"
              @click="changeRoom(salon.id)"
            >
              <span class="w-2 h-2 rounded-full bg-green-400"></span>
              {{ salon.name }}
            </button>
          </li>
        </ul>
      </aside>

      <!-- Zone principale de chat -->
      <main class="flex-1 flex flex-col bg-white rounded-xl shadow-sm">
        <div class="p-4 border-b">
          <h2 class="font-semibold text-gray-700">
            # {{ rooms.find((room) => room.id === actualRoom)?.name }}
          </h2>
          <p class="text-sm text-gray-500">{{ connectedInRoom }} utilisateurs actifs</p>
        </div>

        <!-- Messages -->
        <div class="flex-1 p-4 overflow-y-auto space-y-4">
          <div class="flex gap-3" v-for="message in messages" :key="message.id">
            <div
              class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold"
            >
              U#
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span
                  :class="{
                    'font-medium text-red-500': isOwnMessage(message.user),
                    'font-medium': !isOwnMessage(message.user),
                  }"
                >
                  {{ isOwnMessage(message.user) ? 'Vous' : '#user_' + message.user.slice(0, 8) }}
                </span>
              </div>
              <p class="text-gray-600">{{ message.message }}</p>
            </div>
          </div>
        </div>

        <!-- Zone de saisie -->
        <form class="p-4 border-t bg-gray-50" @submit.prevent="sendMessage">
          <div class="flex gap-2">
            <input
              v-model="message"
              type="text"
              placeholder="Écrivez votre message..."
              class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <span>Envoyer</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                />
              </svg>
            </button>
          </div>
        </form>
      </main>
    </div>
    <addRooms v-if="clickOnAddRoom" @close="clickOnAddRoom = false" @add-room="addRoom" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AddRooms from '@/components/addRooms.vue'
import { io } from 'socket.io-client'

interface Message {
  id: string
  user: string
  message: string
  timestamp: string
  room: number
}

const rooms = ref<{ id: number; name: string }[]>([{ id: 1, name: 'Général' }])
const messages = ref<Message[]>([])
const clickOnAddRoom = ref(false)
const message = ref('')
const actualRoom = ref(1)

// Fonction pour générer ou récupérer l'ID utilisateur
const getUserId = () => {
  const storedUserId = localStorage.getItem('userId')
  if (storedUserId) {
    return storedUserId
  }
  const newUserId = crypto.randomUUID()
  localStorage.setItem('userId', newUserId)
  return newUserId
}

const userId = getUserId()
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    userId: userId, // Envoyer l'ID utilisateur au serveur lors de la connexion
  },
})

const connectedInRoom = ref(0)

onMounted(() => {
  initSocket()
  onJoinRoom(actualRoom.value)
  socket.emit('loadHistoryMessages', { room: actualRoom.value })
})

onBeforeUnmount(() => {
  onLeftRoom()
  socket.disconnect()
})

const initSocket = () => {
  socket.on('roomLeft', ({ users }) => {
    console.log('Users in room after leave:', users)
    connectedInRoom.value = users
  })

  socket.on('roomJoined', ({ users }) => {
    console.log('Users in room after join:', users)
    connectedInRoom.value = users
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on('messageReceived', ({ message }) => {
    console.log('Message received:', message)
    messages.value.push(message)
  })

  socket.on('historyMessagesLoaded', ({ messageHistory }) => {
    console.log('History messages loaded:', messageHistory)
    if (Array.isArray(messageHistory)) {
      messages.value = messageHistory
    } else {
      messages.value = []
    }
  })

  socket.on('roomsListUpdated', (roomsList) => {
    console.log('Rooms list updated:', roomsList)
    rooms.value = roomsList
  })
}

const onJoinRoom = (room: number) => {
  socket.emit('joinRoom', { room })
  socket.emit('loadHistoryMessages', { room })
}

const onLeftRoom = () => {
  socket.emit('leftRoom', { room: actualRoom.value })
}

const loadMessagesByRoom = (room: number) => {
  // Simulate loading messages for the room
  messages.value = messages.value.filter((msg) => msg.room === room)
}

const changeRoom = (room: number) => {
  onLeftRoom()
  actualRoom.value = room
  loadMessagesByRoom(room)
  onJoinRoom(room)
}

const addRoom = (room: string) => {
  socket.emit('addRoom', { room })
}

const openAddRoomPopup = () => {
  clickOnAddRoom.value = true
}

const sendMessage = () => {
  if (!message.value.trim()) return

  const newMessage = {
    id: crypto.randomUUID(),
    user: socket.id,
    message: message.value,
    timestamp: new Date().toISOString(),
    room: actualRoom.value,
  }
  message.value = ''
  socket.emit('sendMessage', { room: actualRoom.value, message: newMessage })
}

// Modifier la vérification des messages pour utiliser userId au lieu de socket.id
const isOwnMessage = (messageUserId: string) => {
  return messageUserId === userId
}
</script>

<style scoped>
/* Les styles sont gérés par Tailwind */
</style>
