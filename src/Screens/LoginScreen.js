import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SvgFromXml } from "react-native-svg";
import { loginSvg } from "../Svgs/LoginSvg";
import Input from "../Components/Input";
import { SVG } from "../Svgs/SVG";
import Button from "../Components/Button";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { global_storage } from "../Utils/Utils";
import LoadingModal from "../Components/LoadingModal";
import { nodePostRequest, postRequest } from "../Utils/API";

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useMMKVStorage("USER", global_storage);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (user?.id) {
      navigation.replace("BottomNav");
    }
  }, []);
  const handleLogin = async () => {
    if (email.length == 0 || password.length == 0)
      return Alert.alert("Please fill all the fields");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      console.log(formData);
      setLoading(true);
      const respone = await postRequest(`login_vendor`, formData);
      setLoading(false);
      console.log("Login ", "Response : ", respone);
      if (
        respone.status == "true" ||
        respone.status == true ||
        (respone.status == 201 && respone?.data?.id)
      ) {
        console.log("Login ", "Response : ", respone);
        setUser(respone.data);
        setEmail("");
        setPassword("");
        navigation.replace("BottomNav");
        nodePostRequest("auth/vendor/login", respone.data);
      } else Alert.alert(respone.message, "Please check your credentials");
    } catch (error) {
      setLoading(false);
      console.log("Login ", "Error : ", error);
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={styles.container}>
      {user?.id ? (
        <View style={{ flex: 1, backgroundColor: "white" }}></View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 20,
          }}
        >
          <Text style={styles.Welcome}>Welcome!</Text>
          <Text style={styles.description}>
            Please provide your account details to login
          </Text>
          <SvgFromXml
            style={{ alignSelf: "center", marginVertical: 40 }}
            xml={loginSvg}
            height={200}
            width={200}
          />
          <Input
            label={"Email"}
            startIcon={SVG.email}
            style={{ marginBottom: 16 }}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder={"Enter your email"}
          />
          <Input
            label={"Password"}
            startIcon={SVG.lock}
            style={{ marginBottom: 16 }}
            value={password}
            type={"password"}
            onChangeText={(text) => setPassword(text)}
            placeholder={"Enter your password"}
          />
          <Button onPress={handleLogin} title={"Login"} />
          <LoadingModal isLoading={loading} />
        </ScrollView>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
  },
  Welcome: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    color: "gray",
  },
});
