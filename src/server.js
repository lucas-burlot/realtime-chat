import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['*'],
  },
})

// Garder une trace des utilisateurs et de leurs salles
const userRooms = new Map()
const roomMessages = new Map()
const roomsList = [{ id: 1, name: 'Général' }]

io.on('connection', (socket) => {
  // Récupérer l'ID utilisateur depuis l'authentification
  const userId = socket.handshake.auth.userId

  // Stocker l'association socket.id -> userId
  socket.userId = userId

  socket.emit('roomsListUpdated', roomsList)
  console.log('a user connected with userId:', userId)

  socket.on('joinRoom', ({ room }) => {
    // Stocker la salle actuelle de l'utilisateur
    userRooms.set(socket.id, room)
    console.log('userRooms', userRooms)

    socket.join(room)
    io.to(room).emit('roomJoined', { users: io.sockets.adapter.rooms.get(room)?.size || 0 })
    console.log(`User ${socket.id} joined room: ${room}`)
  })

  socket.on('leftRoom', ({ room }) => {
    userRooms.delete(socket.id)
    socket.leave(room)
    io.to(room).emit('roomLeft', { users: io.sockets.adapter.rooms.get(room)?.size || 0 })
    console.log(`User ${socket.id} left room: ${room}`)
  })

  socket.on('loadHistoryMessages', ({ room }) => {
    const messages = roomMessages.get(room) || []
    io.to(room).emit('historyMessagesLoaded', { messageHistory: messages })
    console.log('History messages loaded:', messages)
  })

  socket.on('sendMessage', ({ room, message }) => {
    if (!roomMessages.has(room)) {
      roomMessages.set(room, [])
    }
    // Utiliser userId au lieu de socket.id
    const messageWithUserId = {
      ...message,
      user: socket.userId, // Utiliser l'ID persistant
    }
    roomMessages.get(room).push(messageWithUserId)
    io.to(room).emit('messageReceived', { message: messageWithUserId })
  })

  socket.on('addRoom', ({ room }) => {
    roomsList.push({ id: roomsList.length + 1, name: room })
    io.emit('roomsListUpdated', roomsList)
    console.log('Room added:', room)
  })

  socket.on('disconnect', () => {
    // Récupérer la dernière salle de l'utilisateur
    const lastRoom = userRooms.get(socket.id)
    if (lastRoom) {
      // Le socket.leave() est automatiquement appelé par Socket.IO lors de la déconnexion
      // Donc io.sockets.adapter.rooms.get(lastRoom)?.size donnera déjà le bon nombre
      io.to(lastRoom).emit('roomLeft', {
        users: io.sockets.adapter.rooms.get(lastRoom)?.size || 0,
      })
      console.log(`User ${socket.id} disconnected from room: ${lastRoom}`)
      userRooms.delete(socket.id)
    }
    console.log('a user disconnected')
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`)
})
