import React, { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { nodePostRequest } from "../Utils/API";
import { global_storage } from "../Utils/Utils";
import { useMMKVStorage } from "react-native-mmkv-storage";
import socketService from "../socket/socket";
const TAG = "GoLiveController";
class GoLiveController {
  constructor() {
    this.user = null;
    this.streamStatus = false;
    this.socket = null;
    this.ref = null;
  }

  useGoLiveController = (ref) => {
    this.ref = ref;
    const [user, setUser] = useMMKVStorage("USER", global_storage);
    const [streaming, setStreaming] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [cameraMode, setCameraMode] = useState("back");
    const [hd, setHd] = useState(true);
    const [flash, setFlash] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [streamingData, setStreamingData] = useState(null);
    const videoProps = {
      fps: 30,
      resolution: "720p",
      bitrate: 1 * 1024 * 1024, // 2 Mbps
      gopDuration: 1, // 1 second
    };
    const audioProps = {
      bitrate: 128000,
      sampleRate: 44100,
      isStereo: true,
    };
    this.user = user;

    // useEffect(() => {
    //   this.socket = socketService.connect();
    //   socketService.onComment((data) => {
    //     setComments((prevComments) => [...prevComments, data]);
    //   });
    //   socketService.onViewerJoined((data) => {
    //     console.log("Viewer joined:", data);
    //   });
    //   socketService.onViewerLeft((data) => {
    //     console.log("Viewer left:", data);
    //   });

    //   return () => {
    //     this.socket.disconnect({ streamId: user.id });
    //   };
    // }, [user]);

    const onStream = () => {
      if (!streamingData) {
        handleGoLiveApi();
      } else if (!streaming) {
        console.log(
          TAG,
          "startingStreaming () :",
          "streamingData",
          streamingData
        );
        ref?.current?.startStreaming(
          `${streamingData.key}`,
          "rtmp://13.48.147.251/live/"
        );
      } else if (streaming) {
        console.log(
          TAG,
          "startingStreaming () :",
          "streamingData",
          streamingData
        );
        // ref?.current?.startStreaming(
        //   `${streamingData.key}`,
        //   setStreamingData.url
        // );
        ref?.current?.startStreaming(
          streamingData.key,
          "rtmp://13.48.147.251/live"
        );
      }
    };

    const handleGoLiveApi = async () => {
      try {
        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("thumbnail", {
          name: "image",
          type: "image/jpeg",
          uri: thumbnail?.uri,
        });

        const response = await nodePostRequest(
          "streaming/start",
          formData,
          true
        );
        console.log("handleGoLiveApi", response);
        if (response.status) {
          setStreamingData(response.data);
        } else {
          Alert.alert("Error", response.message);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    const handleStopLiveApi = async () => {
      try {
        const formData = new FormData();
        formData.append("id", user.id);

        const response = await nodePostRequest(
          "streaming/stop",
          formData,
          true
        );
        if (response.status) {
          setStreaming(false);
        } else {
          Alert.alert("Error", response.message);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    const eventHandlers = {
      onConnectionSuccess: (e) => {
        console.log("onConnectionSuccess e: ", e);
        setStreaming(true);
      },
      onConnectionFailed: (e) => {
        console.log("onConnectionFailed", e);
      },
      onDisconnect: () => {
        console.log("onDisconnect");
      },
    };
    const onPermissionDenied = () => {
      console.log("onPermissionDenied called");
    };
    return {
      streaming,
      title,
      description,
      setTitle,
      setDescription,
      thumbnail,
      setThumbnail,
      comment,
      setComment,
      comments,
      setComments,
      onStream,
      isMuted,
      setIsMuted,
      cameraMode,
      setCameraMode,
      hd,
      setHd,
      socketService,
      eventHandlers,
      videoProps,
      audioProps,
      onPermissionDenied,
      streamingData,
    };
  };
}

export default new GoLiveController();
