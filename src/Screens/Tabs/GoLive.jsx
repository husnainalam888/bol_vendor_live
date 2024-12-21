import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputBase,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { ApiVideoLiveStreamView } from "@api.video/react-native-livestream";
import { SvgFromUri, SvgFromXml } from "react-native-svg";
import { SVG } from "../../Svgs/SVG";
import Button from "../../Components/Button";
import { Colors } from "../../Utils/Colors";
import ImageCropPicker from "react-native-image-crop-picker";
import CommentList from "../../Components/CommentList";
import { nodePostRequest } from "../../Utils/API";
import { global_storage } from "../../Utils/Utils";
import { useMMKVStorage } from "react-native-mmkv-storage";
import socketService from "../../socket/socket"; // Import the socket service
import GoLiveController from "../../controllers/GoLiveController";
import { NodePublisher } from "react-native-nodemediaclient";
import ViewersModal from "../../Components/ViewersModal";
const GoLive = () => {
  const ref = React.useRef(null);
  const commentRef = React.useRef(null);
  const controller = GoLiveController.useGoLiveController(ref, commentRef);
  const {
    streamingData,
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
    onPermissionsDenied,
    torchEnable,
    user,
    viwers,
    setViwers,
    showViewers,
    setShowViewers,
    stopStream,
  } = controller;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* <ApiVideoLiveStreamView
        onPermissionsDenied={onPermissionsDenied}
        style={styles.liveStreamView}
        ref={ref}
        isMuted={isMuted}
        camera={cameraMode}
        enablePinchedZoom={true}
        video={videoProps}
        audio={audioProps}
        {...eventHandlers} // Spread event handler props
      /> */}
      {/* <NodePublisher
        ref={ref}
        style={styles.liveStreamView}
        url={`${"rtmp://13.48.147.251:1935/live/" + streamingData?.key}`}
        audioParam={{
          codecid: NodePublisher.NMC_CODEC_ID_AAC,
          profile: NodePublisher.NMC_PROFILE_AUTO,
          samplerate: 48000,
          channels: 1,
          bitrate: 64 * 1000,
        }}
        videoParam={{
          codecid: NodePublisher.NMC_CODEC_ID_H264,
          profile: NodePublisher.NMC_PROFILE_AUTO,
          width: 720,
          height: 1280,
          fps: 30,
          bitrate: 1000 * 1000,
        }}
        frontCamera={cameraMode === "front"}
        HWAccelEnable={true}
        denoiseEnable={true}
        torchEnable={torchEnable}
        keyFrameInterval={2}
        volume={isMuted ? 0.0 : 1.0}
        videoOrientation={NodePublisher.VIDEO_ORIENTATION_PORTRAIT}
      /> */}
      <NodePublisher
        ref={ref}
        style={styles.liveStreamView}
        url={`${"rtmp://192.168.195.206:1935/live/" + streamingData?.key}`}
        audioParam={{
          codecid: NodePublisher.NMC_CODEC_ID_AAC,
          profile: NodePublisher.NMC_PROFILE_AUTO,
          samplerate: 48000, // Keep audio quality acceptable
          channels: 1,
          bitrate: 32 * 1000, // Lower audio bitrate for reduced bandwidth
        }}
        videoParam={{
          codecid: NodePublisher.NMC_CODEC_ID_H264,
          profile: NodePublisher.NMC_PROFILE_AUTO,
          width: 360, // Reduce video width (e.g., 360px)
          height: 640, // Reduce video height (e.g., 640px)
          fps: 15, // Lower frame rate for smoother streaming with low bandwidth
          bitrate: 300 * 1000, // Significantly reduce video bitrate (e.g., 300 Kbps)
        }}
        frontCamera={cameraMode === "front"}
        HWAccelEnable={true}
        denoiseEnable={true}
        torchEnable={torchEnable}
        keyFrameInterval={2}
        volume={isMuted ? 0.0 : 1.0}
        videoOrientation={NodePublisher.VIDEO_ORIENTATION_PORTRAIT}
      />
      <View style={styles.overlay} />

      {streaming && (
        <TouchableOpacity
          onPress={() => setShowViewers(true)}
          style={styles.viwers}
        >
          <Text style={styles.viwersText}>
            {viwers?.length} {"Watching"}
          </Text>
          <SvgFromXml xml={SVG.showEyeWhite} height={24} width={24} />
        </TouchableOpacity>
      )}

      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={styles.buttonContainer}>
          <SvgFromXml
            onPress={() => setHd(!hd)}
            xml={SVG[hd ? "hd" : "fhd"]}
            height={24}
            width={24}
          />
          <SvgFromXml
            onPress={() => setIsMuted(!isMuted)}
            xml={SVG[isMuted ? "micOn" : "micOff"]}
            height={24}
            width={24}
          />
          <TouchableOpacity
            onPress={() =>
              setCameraMode(cameraMode === "back" ? "front" : "back")
            }
          >
            <SvgFromXml xml={SVG.cameraSwitch} height={24} width={24} />
          </TouchableOpacity>
        </View>
      </View>

      {!streaming ? (
        <>
          <ImagePicker selected={thumbnail?.uri} onSelect={setThumbnail} />
          <TextInput
            style={styles.heading}
            placeholderTextColor={"white"}
            value={title}
            autoCapitalize={"words"}
            placeholder="Write a title"
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.description}
            placeholderTextColor={"white"}
            value={description}
            autoCapitalize="sentences"
            multiline
            onChangeText={setDescription}
            placeholder="Write a description of your live stream here"
          />
        </>
      ) : (
        <View>
          <CommentList data={comments} ref={commentRef} />
          <View style={styles.commentField}>
            <TextInput
              style={styles.comment}
              placeholder="Write a comment"
              value={comment}
              placeholderTextColor={"white"}
              autoCapitalize="sentences"
              onChangeText={setComment}
            />
            {comment.trim().length > 0 && (
              <Text
                onPress={() => {
                  console.log("sendComment() : data ", {
                    streamId: streamingData.key,
                    userId: global_storage.getMap("USER").mongo_id,
                    commentText: comment,
                  });
                  socketService.sendComment({
                    streamId: streamingData.key,
                    userId: global_storage.getMap("USER").mongo_id,
                    commentText: comment,
                  });
                  setComment("");
                }}
                style={styles.send}
              >
                Send
              </Text>
            )}
          </View>
        </View>
      )}
      {!streaming && (
        <Button
          title={streamingData ? "Go Live" : "Create Live Stream"}
          onPress={onStream}
          style={styles.button}
          titleStyle={styles.buttonTitle}
        />
      )}
      {streaming && (
        <Button
          title={"Stop"}
          onPress={stopStream}
          style={styles.stopButton}
          titleStyle={styles.stopButtonTitle}
        />
      )}
      <ViewersModal
        visible={showViewers}
        setVisible={setShowViewers}
        data={viwers}
      />
    </View>
  );
};

const ImagePicker = ({ selected = "", onSelect }) => {
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleOnPress = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: Dimensions.get("window").width - 40,
        height: 200,
        cropping: true,
      });
      if (result.path) onSelect({ uri: result.path });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <ImageBackground
        style={[styles.imageContainer, !selected && styles.notSelected]}
        source={{ uri: selected }}
      >
        {!selected && (
          <>
            <SvgFromXml xml={SVG.thumbnail} height={40} width={40} />
            <Text style={styles.notSelectedText}>Upload a thumbnail</Text>
            <Text style={styles.notSelectedTextDescription}>
              Thumbnail will help your audience identify your live stream
            </Text>
          </>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default GoLive;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  liveStreamView: {
    flex: 1,
    backgroundColor: "black",
    alignSelf: "stretch",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    justifyContent: "center",
    alignSelf: "flex-end",
    gap: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  streamingButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  button: {
    backgroundColor: "#008FFF",
    padding: 10,
  },
  buttonTitle: {
    color: "white",
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    padding: 0,
  },
  description: {
    color: "white",
    fontSize: 14,
    padding: 0,
    marginBottom: 20,
  },
  imageContainer: {
    height: 200,
    width: Dimensions.get("window").width - 40,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notSelected: {
    backgroundColor: "rgba(255,255,255,0.1)",
    gap: 5,
    paddingHorizontal: 50,
  },
  notSelectedText: {
    color: "white",
    fontSize: 16,
  },
  notSelectedTextDescription: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  commentField: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 10,
    paddingEnd: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  comment: {
    flex: 1,
    color: "white",
    fontSize: 14,
    padding: 10,
  },
  send: {
    color: "white",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  viwers: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
  },
  viwersText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  stopButton: {
    backgroundColor: "red",
    padding: 10,
  },
  stopButtonTitle: {
    color: "white",
  },
});
