# Realtime Chat Application

Welcome to the **Realtime Chat Application**, a modern chat application built with Vue 3 and Socket.IO that allows users to communicate in real-time across different chat rooms. This project showcases the power of WebSockets for real-time communication and the flexibility of Vue.js for building interactive user interfaces.

## Technologies and Libraries Used

- **Vue 3**: A progressive JavaScript framework for building user interfaces. Vue.js is known for its simplicity and flexibility, making it easy to integrate with other projects and libraries.
- **Socket.IO**: A library that enables real-time, bidirectional, and event-based communication between the client and server. It is used in this project to handle real-time messaging and notifications.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It serves as the backend for this chat application.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects. It is used to serve and bundle the application.
- **Tailwind CSS**: A utility-first CSS framework that allows for rapid UI development. It is used to style the application with a modern and responsive design.

## Main Functionalities

- **User Authentication**: Each user is assigned a unique ID stored in the browser's local storage, ensuring a consistent identity across sessions.
- **Multiple Chat Rooms**: Users can join different chat rooms, allowing for organized discussions on various topics.
- **Real-Time Messaging**: Messages are sent and received in real-time, providing an interactive chat experience without the need for page refreshes.
- **Message History**: Users can load the history of messages in a chat room, allowing them to catch up on previous conversations.
- **Dynamic Room Management**: Users can create new chat rooms dynamically, enhancing the flexibility of the chat application.
- **Responsive Design**: The application is designed to be fully responsive, ensuring a seamless experience on both desktop and mobile devices.

## Getting Started

To get started with the Realtime Chat Application, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/realtime-chat.git
   cd realtime-chat
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Run the development server vue3:

   ```sh
   npm run dev
   ```

4. Run the development server socket.io:

   ```sh
   npm run dev:server
   ```

5. Open your browser and navigate to `http://localhost:3000` to start chatting!

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for checking out the Realtime Chat Application! We hope you enjoy using it as much as we enjoyed building it.
