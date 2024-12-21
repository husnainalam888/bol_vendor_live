import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform, Alert } from "react-native";

const requestCameraAndMicPermissions = async () => {
  try {
    const cameraPermission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const micPermission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO;

    // Check and request Camera permission
    const cameraResult = await request(cameraPermission);
    if (cameraResult !== RESULTS.GRANTED) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to proceed."
      );
      return false;
    }

    // Check and request Microphone permission
    const micResult = await request(micPermission);
    if (micResult !== RESULTS.GRANTED) {
      Alert.alert(
        "Permission Required",
        "Microphone permission is required to proceed."
      );
      return false;
    }

    return true; // Permissions granted
  } catch (error) {
    console.error("Error requesting permissions:", error);
    return false;
  }
};

export default requestCameraAndMicPermissions;
