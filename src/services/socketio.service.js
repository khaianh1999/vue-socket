import { io } from "socket.io-client";

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection(token) {
    const socketEndpoint =
      process.env.VUE_APP_SOCKET_ENDPOINT || "http://localhost:3001"; // Default to local if not set

    this.socket = io(socketEndpoint, {
      auth: {
        token,
      },
    });
  }
  // Init room
  subscribeRoom(inforUser, cb) {
    if (this.socket) {
      this.socket.emit("join", inforUser, cb);
    }
  }
  // Expose the socket instance
   getSocket() {
    return this.socket;
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  // Listen for messages
  // onMessage(cb) {
  //   if (this.socket) {
  //     this.socket.on("message", cb);
  //   }
  // }
  // Subscribe to any event
  // onAnyEvent(cb) {
  //   if (this.socket) {
  //     this.socket.onAny(cb);
  //   }
  // }
 
}

export default new SocketioService();
