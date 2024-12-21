// socket.js
import io from "socket.io-client";
import { NODE_URL } from "../Utils/API";
import { global_storage } from "../Utils/Utils";

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
      this.socket.emit(
        "join-stream",
        streamId,
        global_storage.getMap("USER").mongo_id
      );
    }
  }

  leaveStream(streamId) {
    if (this.socket) {
      this.socket.emit("leave-stream", streamId);
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
      console.log("sendComment() : data ", data);
    }
  }

  onComment(callback) {
    if (this.socket) {
      console.log("onComment() listening...");
      this.socket.on("new-comment-received", callback);
    }
  }

  disconnect(id) {
    if (this.socket) {
      this.socket.emit("stop-stream", id);
      this.socket.disconnect();
    }
  }
  onStreamEnded(callback) {
    if (this.socket) {
      this.socket.on("stream-ended", callback);
    }
  }
}

export default new SocketService();
