import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Children, useEffect, useState } from "react";
import Container from "../../Components/Container";
import OrderStatusList from "../../Components/OrderStatusList";
import { IMAGE_B_URL, getRequest, postRequest } from "../../Utils/API";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { global_storage } from "../../Utils/Utils";
import { SvgFromXml } from "react-native-svg";
import { SVG } from "../../Svgs/SVG";
import { useNavigation } from "@react-navigation/native";
import Button from "../../Components/Button";
import Shadow from "../../Components/Shadow";
const Dashboard = ({ navigation }: any) => {
  const [isLoading, setIsloading] = useState(false);
  const [user, setUser] = useMMKVStorage("USER", global_storage, {});
  const [dashboard, setDashboard] = useMMKVStorage(
    "dashboard",
    global_storage,
    {}
  );
  const [data, setData] = useState([
    {
      type: "Assigned",
      count: dashboard?.assigned,
    },
    {
      type: "Delivered",
      count: dashboard?.completed,
    },
    {
      type: "Picked",
      count: dashboard?.picked,
    },
    {
      type: "Rejected",
      count: dashboard?.rejected,
    },
  ]);
  useEffect(() => {
    console.log(TAG, "UseEffect():");
    get_dashboard();
  }, []);
  const TAG = "Dashboard.js";
  const get_dashboard = async () => {
    try {
      setIsloading(true);
      const respone = await postRequest(`dashboard/${user.id}`);
      setIsloading(false);
      console.log(TAG, "get_dashboard(): response :", respone.data.orders[0]);
      setDashboard(respone.data);
      const dashboard = respone.data;
      setData([
        {
          type: "Assigned",
          count: dashboard?.assigned,
        },
        {
          type: "Delivered",
          count: dashboard?.completed,
        },
        {
          type: "Picked",
          count: dashboard?.picked,
        },
        {
          type: "Rejected",
          count: dashboard?.rejected,
        },
      ]);
    } catch (error) {
      setIsloading(false);
      console.log(TAG, "Get_Dashboard() :", error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header />
      <Container
        onRefresh={() => {
          get_dashboard();
        }}
        isLoading={isLoading}
        style={{ paddingVertical: 0, backgroundColor: "#f5f5f5" }}
      >
        <OrderStatusList data={data} />
        <View style={styles.labelRow}>
          <Text style={styles.label}>New Orders</Text>
          <Text
            onPress={() => navigation.navigate("Orders")}
            style={styles.seeAll}
          >
            See All
          </Text>
        </View>
        <OrderList data={dashboard?.orders} />
      </Container>
    </View>
  );
};

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>Dashboard</Text>
      <SvgFromXml xml={SVG.support} height={30} width={30} />
    </View>
  );
};

export const OrderList = ({ data, contentContainerStyle }: any) => {
  const navigation = useNavigation();
  const [list, setList] = useState(data);
  useEffect(() => {
    console.log("OrderList() :", data);
    setList(data);
  }, [data]);
  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={list}
      extraData={list}
      renderItem={({ item }) => {
        return <OrderItem item={item} />;
      }}
    />
  );
};
export const OrderItem = ({ item, onPress, showOrderItems = false, style }) => {
  const navigation = useNavigation();
  const [order_item, setOrder_item] = useState(item?.order_item || []);
  useEffect(() => {
    console.warn("oeder item", "UseEffect():");
    setOrder_item(item?.order_item || []);
  }, [item]);
  return (
    // <Shadow>
    <View>
      <Pressable
        onPress={() => {
          if (!onPress) navigation.navigate("OrderDetails", { order: item });
        }}
        style={[
          styles.orderItem_item,
          showOrderItems && { paddingHorizontal: 0 },
          { elevation: 1 },
          style,
        ]}
      >
        <Row title={"Order number :"} value={`#${item.order_no}`} />
        <Row
          title={"Customer :"}
          value={item.customer.first_name + " " + item.customer.last_name}
        />
        <Row
          title={"Items :"}
          round={true}
          value={`${item.order_item.length}`}
        />
        {showOrderItems && (
          <View>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
              Order Items
            </Text>
            <ItemList data={order_item} onPress={onPress} />
          </View>
        )}
        <Row title={"Total Bill :"} value={`$${item.total}`} bold={true} />
        {showOrderItems != true && (
          <Button
            onPress={() => {
              if (!onPress)
                navigation.navigate("OrderDetails", { order: item });
            }}
            title={"View Details"}
          />
        )}
        <Text style={[styles.regular, { marginTop: 16 }]}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </Pressable>
    </View>
    // </Shadow>
  );
};
export const ItemList = ({ data, onPress }: any) => {
  useEffect(() => {
    console.log("ItemList", "UseEffect(): changed", data);
  }, [data]);
  return (
    <FlatList
      style={{ marginVertical: 10 }}
      data={data}
      extraData={data}
      renderItem={({ item }) => {
        return (
          <Shadow>
            <View
              style={[
                styles.orderItem_item,
                { padding: 16, borderWidth: 1, borderColor: "#f3f3f3" },
              ]}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  resizeMode="contain"
                  source={{ uri: IMAGE_B_URL + item.product_image }}
                  style={styles.itemImage}
                />
                <View style={{ flex: 1 }}>
                  <Row
                    style={{ padding: 6, marginBottom: 8 }}
                    title={item.name}
                  />
                  <Row
                    style={{ padding: 6, marginBottom: 8 }}
                    value={"Item ID : " + item.id}
                  />
                  <Row
                    style={{ padding: 6, marginBottom: 8 }}
                    value={"Qty : " + item.quantity}
                  />
                  <Row
                    style={{ padding: 6, marginBottom: 8 }}
                    value={"Status : " + item.status}
                  />
                  <Row
                    title={"Price : $" + item.price}
                    style={{ marginBottom: 0, padding: 8 }}
                  />
                </View>
              </View>
              {item?.status == "accepted" && (
                <Button
                  title={"Ready"}
                  onPress={() => onPress(item.id, "ready")}
                  style={{
                    marginTop: 24,
                    borderRadius: 30,
                    paddingVertical: 12,
                  }}
                />
              )}
              {item?.status == "pending" && (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 24,
                    alignItems: "center",
                  }}
                >
                  <Button
                    title={"Reject"}
                    onPress={() => onPress(item.id, "rejected")}
                    style={{
                      borderRadius: 30,
                      paddingVertical: 10,
                      borderWidth: 1,
                      backgroundColor: "white",
                    }}
                    titleStyle={{
                      color: "black",
                      fontSize: 12,
                    }}
                  />
                  <Button
                    title={"Accept"}
                    onPress={() => onPress(item.id, "accepted")}
                    style={{
                      borderRadius: 30,
                      paddingVertical: 12,
                      flex: 1,
                      marginStart: 16,
                    }}
                  />
                </View>
              )}
            </View>
          </Shadow>
        );
      }}
    />
  );
};

export const Row = ({ title, value, bold, round, style }: any) => {
  return (
    <View style={[styles.row, style]}>
      {title && (
        <Text numberOfLines={1} style={styles.bold}>
          {title}
        </Text>
      )}
      <Text
        numberOfLines={1}
        style={[
          styles.regular,
          (bold || round) && { fontWeight: "bold" },
          round && {
            backgroundColor: "black",
            color: "white",
            borderRadius: 40,
            paddingHorizontal: 10,
            paddingVertical: 4,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};
export const ProductItem = ({ item, onDelete, onSelect, selected }: any) => {
  const navigation = useNavigation();
  return (
    // <Shadow>
    <View
      style={[
        styles.orderItem_item,
        { padding: 16, borderWidth: 1, borderColor: "#f3f3f3", elevation: 1 },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          resizeMode="contain"
          source={{
            uri: item?.product_image?.[0]?.image
              ? IMAGE_B_URL + item?.product_image?.[0]?.image
              : "https://feb.kuleuven.be/drc/LEER/visiting-scholars-1/image-not-available.jpg/image",
          }}
          style={styles.itemImage}
        />
        <View style={{ flex: 1 }}>
          <Row style={{ padding: 6, marginBottom: 8 }} title={item.name} />
          <Row
            style={{ padding: 6, marginBottom: 8 }}
            value={"Condition : " + item.condition}
          />
          <Row
            style={{ padding: 6, marginBottom: 8 }}
            value={"Stock Qty : " + item.stock_quantity}
          />
          <Row
            value={"Delivery Time :" + item.delivery_time}
            style={{ marginBottom: 8, padding: 8 }}
          />
          <Row
            title={"Sales Price :" + item.sales_price}
            style={{ marginBottom: 0, padding: 8 }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row-reverse",
          marginTop: 24,
          alignItems: "center",
        }}
      >
        {!onSelect && (
          <>
            <Button
              title={"Delete"}
              onPress={() => {
                if (onDelete) onDelete(item.id);
              }}
              style={{
                borderRadius: 30,
                paddingVertical: 10,
                borderWidth: 1,
                backgroundColor: "white",
              }}
              titleStyle={{
                color: "black",
                fontSize: 12,
              }}
            />
            <Button
              title={"Edit"}
              onPress={() => navigation.navigate("AddProduct", { item })}
              style={{
                borderRadius: 30,
                paddingVertical: 12,
                flex: 1,
                marginEnd: 16,
              }}
            />
          </>
        )}
        {onSelect && (
          <Button
            title={selected ? "Selected" : "Tap To Select"}
            onPress={() => {
              if (onSelect) onSelect(item.id);
            }}
            style={[
              {
                borderRadius: 30,
                paddingVertical: 10,
                borderWidth: 1,
                backgroundColor: "white",
                flex: 1,
              },
              selected && {
                color: "white",
                backgroundColor: "black",
              },
            ]}
            titleStyle={[
              {
                color: "black",
                fontSize: 12,
              },
              selected && {
                color: "white",
              },
            ]}
          />
        )}
      </View>
    </View>
    // </Shadow>
  );
};
export default Dashboard;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    marginHorizontal: 0,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  label: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  orderItem_item: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  item_id: {
    color: "black",
    fontWeight: "bold",
  },
  itemImage: {
    // height: 110,
    width: 110,
    marginEnd: 16,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    overflow: "hidden",
  },
  item_name: {
    color: "black",
    fontWeight: "500",
    textAlign: "justify",
    marginVertical: 10,
  },
  qty: {
    color: "grey",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f3f3",
    marginBottom: 10,
  },
  orderItem: {
    borderWidth: 1,
    borderColor: "#f3f3f3",
    borderRadius: 8,
    padding: 10,
  },
  customer_name: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  btnText: {
    color: "white",
    textAlign: "center",
  },
  labelRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 32,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#F6F6F6",
    padding: 10,
    alignItems: "center",
  },
  bold: {
    color: "black",
    fontWeight: "bold",
    flex: 1,
  },
  regular: { color: "black" },
});
