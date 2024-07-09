<template>
  <div>
    <form @submit.prevent="submitToken">
      <input type="text" placeholder="user_name" v-model="inforUser.userName" />
      <select v-model="inforUser.gender">
        <option value="male">Nam</option>
        <option value="female">Nữ</option>
      </select>
      <button type="submit">Submit</button>
    </form>
    <div>{{ notification }}</div>
    <div class="box">
      <div class="messages">
        <div v-for="message in messages" :key="message.userId">
          <template v-if="message.type == 'welcome' || message.type == 'disconnecting'">
            {{ message.content }}
          </template>
          <template v-else-if="message.type == 'message'">
            {{ message.userName }}: {{ message.content }}
          </template>
        </div>
      </div>
      <div class="messages"></div>
      <form class="input-div" @submit.prevent="submitMessage">
        <input
          type="text"
          placeholder="Type in text"
          v-model="inputMessageText"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
// static data only for demo purposes, in real world scenario, this would be already stored on client
// const SENDER = {
//   id: "123",
//   name: "John Doe",
// };
import SocketioService from "../services/socketio.service";
export default {
  name: "ChatBox",
  components: {},
  data() {
    return {
      token: "",
      inputMessageText: "",
      messages: [],
      inforUser: {
        userId: Math.floor(Math.random() * 100000),// random tạm userId
        userName: "",
        roomId: "",
        gender: "male",
      },
      notification: "",
      socket: null,
    };
  },
  created() {},
  methods: {
    submitToken() {
      this.token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTc3MjEzOCwiZGV2aWNlSWQiOjE3NzIxMzgsImlhdCI6MTcxODc4MzQ4NCwiZXhwIjoxNzUwMzE5NDg0fQ.qKj25n-RfcJfGUNG2lyrCzGQKZVl9p22BosFTRkmqRE`;
      SocketioService.setupSocketConnection(this.token);

      SocketioService.subscribeRoom(this.inforUser, (cb) => {
        console.log("cb", cb);
        if (cb.success) {
          // Tạo room thành công
          this.inforUser.roomId = cb.roomId;
          this.notification = "Tạo room thành công!";
          // this.listenForMessages(); // Call listenForMessages after subscribing to the room

          this.socket = SocketioService.getSocket();
          this.socket.onAny((eventName, eventData) => {
            this.handleEvent(eventName, eventData);
          });
        }
      });
    },
    handleEvent(eventName, eventData) {
      console.log(`Event received: ${eventName}`, eventData);
      switch (eventName) {
        case "message":
          this.messages.push(eventData);
          break;
        case "server-send-message":
          this.messages.push(eventData);
          break;
        case "server-disconnecting":
          this.messages.push(eventData);
          break;
        default:
          break;
      }
    },
    // Gửi tin nhắn vào nhóm
    submitMessage() {
      if (!this.socket) return;
      const message = {
        userId: this.inforUser.userId,
        userName: this.inforUser.userName,
        roomId: this.inforUser.roomId,
        content: this.inputMessageText,
      };
      this.socket.emit("client-send-message", message);
      this.inputMessageText = ""; // Clear the input field after sending
    },
  },
  beforeUnmount() {
    // SocketioService.disconnect();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  width: fit-content;
  height: 400px;
  border: solid 1px #000;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.messages {
  flex-grow: 1;
}

.input-div {
  display: flex;
  width: 100%;
}
</style>
