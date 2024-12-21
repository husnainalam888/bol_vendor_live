import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SvgFromXml } from "react-native-svg";
import { SVG } from "../Svgs/SVG";
import { FlatList } from "react-native";
import { IMAGE_B_URL } from "../Utils/API";

const ViewersModal = ({ visible, setVisible, data }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={styles.overlay}
      >
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Viewers</Text>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.icon}
            >
              <SvgFromXml xml={SVG.cross} height={20} width={20} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: IMAGE_B_URL + item.image }}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
              </View>
            )}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default ViewersModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent black background
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get("screen").height * 0.85,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },
  title: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    textAlign: "center",
    left: 0,
    right: 0,
  },
  icon: {
    position: "absolute",
    right: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#f3f3f3",
  },
  name: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  textContainer: {},
  email: {
    color: "gray",
    fontSize: 12,
  },
});
