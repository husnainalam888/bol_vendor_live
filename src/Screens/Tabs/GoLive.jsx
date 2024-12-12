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

const GoLive = () => {
  const ref = React.useRef(null);
  const controller = GoLiveController.useGoLiveController(ref);
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
  } = controller;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ApiVideoLiveStreamView
        onPermissionsDenied={onPermissionsDenied}
        style={styles.liveStreamView}
        ref={ref}
        isMuted={isMuted}
        camera={cameraMode}
        enablePinchedZoom={true}
        video={videoProps}
        audio={audioProps}
        {...eventHandlers} // Spread event handler props
      />

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
          <CommentList />
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
                onPress={() =>
                  socketService.sendComment({
                    streamId: user.id,
                    userId: null,
                    username: user.name,
                    vendorId: user.id,
                    image: user.image,
                    comment,
                  })
                }
                style={styles.send}
              >
                Send
              </Text>
            )}
          </View>
        </View>
      )}
      <Button
        title={streamingData ? "Go Live" : "Create Live Stream"}
        onPress={onStream}
        style={styles.button}
        titleStyle={styles.buttonTitle}
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
    flex: 1,
    justifyContent: "center",
    alignSelf: "flex-end",
    gap: 20,
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
  },
  comment: {
    flex: 1,
    color: "white",
    fontSize: 14,
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
});
