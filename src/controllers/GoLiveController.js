import React, { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { nodePostRequest } from "../Utils/API";
import { global_storage } from "../Utils/Utils";
import { useMMKVStorage } from "react-native-mmkv-storage";
import socketService from "../socket/socket";
import requestCameraAndMicPermissions from "./CameraPermissions";
import { useNavigation } from "@react-navigation/native";
const TAG = "GoLiveController";
class GoLiveController {
  constructor() {
    this.user = null;
    this.streamStatus = false;
    this.socket = null;
    this.ref = null;
    this.commentRef = null;
  }

  useGoLiveController = (ref, commentRef) => {
    this.ref = ref;
    this.commentRef = commentRef;
    const navigation = useNavigation();
    const [showViewers, setShowViewers] = useState(false);
    const [user, setUser] = useMMKVStorage("USER", global_storage);
    const [streaming, setStreaming] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [cameraMode, setCameraMode] = useState("back");
    const [hd, setHd] = useState(true);
    const [torchEnable, setFlash] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [streamingData, setStreamingData] = useState(null);
    const [viwers, setViwers] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

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

    useEffect(() => {
      this.socket = socketService.connect();
      requestCameraAndMicPermissions();
      socketService.onComment((data) => {
        console.log("New comment  Received : ", data);
        const newComments = [data, ...comments];
        setComments((prevComments) => [data, ...prevComments]);
        commentRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
      });
      socketService.onViewerJoined((data) => {
        console.log("Viewer joined:", data);
        setViwers((prevViwers) => {
          const alreadyExist = prevViwers.find((item) => item._id == data._id);
          if (!alreadyExist) {
            return [...prevViwers, data];
          }
          return prevViwers;
        });
      });
      socketService.onViewerLeft((data) => {
        console.log("Viewer left:", data);
        setViwers((prevViwers) =>
          prevViwers.filter((item) => item._id != data._id)
        );
      });
      socketService.onStreamEnded(() => {
        Alert.alert("Stream Stop", "Stream has been stopped");
        setStreaming(false);
      });
      return () => {
        this.socket?.disconnect({ streamId: user.id });
      };
    }, [user]);

    const handleJoinRoom = (streamId = streamingData?.key) => {
      socketService.joinStream(streamId);
    };

    const onStream = () => {
      if (!streamingData) {
        handleGoLiveApi();
      } else if (!streaming) {
        ref?.current?.start(`${streamingData.key}`, streamingData?.url);
        console.log("test", `${streamingData.key}`, streamingData?.url);
        handleJoinRoom();
        setStreaming(true);
      } else if (streaming) {
        ref?.current?.stop(streamingData.key, streamingData?.url);
        setStreaming(true);
        handleJoinRoom();
      }
    };

    const stopStream = () => {
      ref.current?.stop();
      // setStreaming(false);
      // navigation.goBack();
      // ref?.current.start();
    };
    const handleGoLiveApi = async () => {
      try {
        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("title", title);
        formData.append("description", description);
        selectedProducts?.forEach((e, i) => {
          formData.append(`products[${i}]`, e);
        });
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
      torchEnable,
      setFlash,
      user,
      viwers,
      setViwers,
      showViewers,
      setShowViewers,
      stopStream,
      selectedProducts,
      setSelectedProducts,
    };
  };
}

export default new GoLiveController();
