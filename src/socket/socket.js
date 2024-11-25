// socket.js
import io from "socket.io-client";
import { NODE_URL } from "../Utils/API";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(NODE_URL);
    return this.socket;
  }

  joinStream(streamId) {
    if (this.socket) {
      this.socket.emit("join-stream", streamId);
    }
  }

  leaveStream(streamId) {
    if (this.socket) {
      this.socket.emit("leave-stream", streamId);
    }
  }

  onComment(callback) {
    if (this.socket) {
      this.socket.on("comment", callback);
    }
  }

  onViewerJoined(callback) {
    if (this.socket) {
      this.socket.on("viewer-joined", callback);
    }
  }

  onViewerLeft(callback) {
    if (this.socket) {
      this.socket.on("viewer-left", callback);
    }
  }

  sendComment(data) {
    if (this.socket) {
      this.socket.emit("new-comment", data);
    }
  }

  disconnect(id) {
    if (this.socket) {
      this.socket.emit("stop-stream", id);
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
