import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import { FlatList } from "react-native";
import { SvgFromXml } from "react-native-svg";
import { SVG } from "../Svgs/SVG";
import { IMAGE_B_URL } from "../Utils/API";

const CommentList = forwardRef(({ data, ...props }, ref) => {
  return (
    <FlatList
      style={styles.FlatList}
      ref={ref}
      inverted={true}
      contentContainerStyle={styles.contentContainerStyle}
      data={data}
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
              uri: `${
                item.userId.image ? IMAGE_B_URL + item?.userId?.image : ""
              }`,
            }}
          />
          <View style={styles.commentContainer}>
            <Text style={styles.username}>{item?.userId?.name}</Text>
            <Text style={styles.comment}>{item?.comment}</Text>
          </View>
        </View>
      )}
    />
  );
});

export default CommentList;

const styles = StyleSheet.create({
  FlatList: {
    marginVertical: 16,
    height: Dimensions.get("screen").height / 2.5,
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
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },
});
