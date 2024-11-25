import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { SvgFromXml } from "react-native-svg";
import { SVG } from "../Svgs/SVG";

const CommentList = () => {
  return (
    <FlatList
      style={styles.FlatList}
      contentContainerStyle={styles.contentContainerStyle}
      data={[]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <SvgFromXml xml={SVG.commentOutline} height={24} width={24} />
          <Text style={styles.comment}>Comments will be shown here </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image
            style={styles.image}
            source={{
              uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            }}
          />
          <View style={styles.commentContainer}>
            <Text style={styles.username}>Username</Text>
            <Text style={styles.comment}>Comment</Text>
          </View>
        </View>
      )}
    />
  );
};

export default CommentList;

const styles = StyleSheet.create({
  FlatList: {
    flexGrow: 0,
    marginVertical: 16,
  },
  contentContainerStyle: {
    paddingVertical: 16,
    gap: 10,
    flexGrow: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  commentContainer: {
    justifyContent: "space-between",
  },
  username: {
    fontWeight: "bold",
    color: "white",
  },
  comment: {
    color: "white",
    fontSize: 12,
  },
  empty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
