import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Container from "../../Components/Container";
import Shadow from "../../Components/Shadow";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { global_storage } from "../../Utils/Utils";
import {
  IMAGE_B_URL,
  getRequest,
  nodePostRequest,
  postRequest,
} from "../../Utils/API";
import Input from "../../Components/Input";
import { SVG } from "../../Svgs/SVG";
import ImageCropPicker from "react-native-image-crop-picker";
import Button from "../../Components/Button";
import LoadingModal from "../../Components/LoadingModal";

const Profile = ({ navigation }) => {
  const [user, setUser] = useMMKVStorage("USER", global_storage);
  const [image, setImge] = useState({ uri: IMAGE_B_URL + user?.image });
  const [name, setName] = useState(user?.name);
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    get_profile();
  }, []);
  const get_profile = async () => {
    try {
      setIsLoading(true);
      const respone = await getRequest(`get_profile/${user.id}`);
      setIsLoading(false);
      console.log("Profile ", "Response : ", respone);
      if (respone.status) {
        setUser(respone.data);
        setName(respone.data.name);
        setImge({ uri: IMAGE_B_URL + respone.data.image });
        nodePostRequest("auth/vendor/login", { ...respone.data, id: user.id });
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Profile ", "Error : ", error);
      Alert.alert("Error", error.message);
    }
  };
  const handleImagePress = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        height: 100,
        width: 100,
        cropping: true,
      });
      if (image.path) {
        setEdit(true);
        setImge({ uri: image.path });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const hanleEditPorfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", {
        name: "image",
        type: "image/jpeg",
        uri: image.uri,
      });
      setIsLoading(true);
      console.warn(formData);
      const respone = await postRequest(`update_profile/${user.id}`, formData);
      setIsLoading(false);
      if (respone.status) {
        setEdit(false);
        get_profile();
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      setIsLoading(false);
    }
  };
  return (
    <Container
      hideBack={true}
      headerTitle="Profile"
      style={{ backgroundColor: "#f5f5f5", flex: 1, paddingVertical: 0 }}
    >
      <View style={styles.imageContainer}></View>
      <Shadow>
        <TouchableOpacity
          onPress={() => {
            handleImagePress();
          }}
        >
          <Image style={styles.image} height={100} width={100} source={image} />
        </TouchableOpacity>
      </Shadow>
      <Input
        label={"Name"}
        placeholder="Name"
        startIcon={SVG.user}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setEdit(true);
        }}
        style={{ marginBottom: 16 }}
      />
      <Input
        label={"Email"}
        placeholder="Email"
        startIcon={SVG.email}
        editable={false}
        value={user?.email}
        style={{ marginBottom: 16 }}
      />
      <Input
        label={"Address"}
        placeholder="Addrees"
        startIcon={SVG.location}
        value={user?.address}
        style={{ marginBottom: 16 }}
        editable={false}
      />
      <View style={{ flex: 1, justifyContent: "flex-end", marginVertical: 16 }}>
        {edit && (
          <>
            <Button
              style={{ marginBottom: 16 }}
              title={"Save"}
              onPress={() => {
                hanleEditPorfile();
              }}
            />
            <Button
              style={{ backgroundColor: "#ffff" }}
              titleStyle={{ color: "#000" }}
              title={"Cancel"}
              onPress={() => {
                setEdit(false);
                setName(user?.name);
                setImge({ uri: IMAGE_B_URL + user.image });
              }}
            />
          </>
        )}
        {!edit && (
          <Button
            style={{ backgroundColor: "#ffff" }}
            titleStyle={{ color: "#000" }}
            title={"Logout"}
            onPress={() => {
              global_storage.clearStore();
              navigation.replace("Login");
            }}
          />
        )}
      </View>
      <LoadingModal isLoading={isLoading} />
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  imageContainer: {
    height: 100,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "#2a2a2a",
    marginHorizontal: -16,
  },
  image: {
    height: 140,
    width: 140,
    backgroundColor: "white",
    borderRadius: 100,
    alignSelf: "center",
    borderWidth: 5,
    marginTop: -70,
    borderColor: "white",
  },
});
