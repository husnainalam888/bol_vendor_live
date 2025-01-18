import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Input from "./Input";
import { ProductList } from "./ProuctItem";
import { global_storage } from "../Utils/Utils";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { getRequest } from "../Utils/API";
const TAG = "ProductBottomSheet";
const ProductBottomSheet = forwardRef(
  (
    {
      label,
      style,
      placeholder,
      value,
      selectedProducts,
      onChange,
      setSelectedProducts,
    },
    ref
  ) => {
    const [selected, setSelected] = useState(null);
    const TAG = "OrderScreen";
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useMMKVStorage("USER", global_storage);
    const [data, setData] = useState([]);
    useEffect(() => {
      get_orders();
    }, []);
    const get_orders = async () => {
      try {
        setIsLoading(true);
        const respone = await getRequest(`get_products/${user.id}`);
        setIsLoading(false);
        console.log(TAG, "Get_orders() : response ", respone);
        setData(respone.data);
      } catch (error) {
        setIsLoading(false);
        console.log(TAG, "get_orders():", error);
      }
    };

    const onSelect = (item) => {
      console.log("item", item.id);
      if (!selectedProducts?.includes(item.id)) {
        let newSelectedProducts = [...selectedProducts];
        newSelectedProducts.push(item.id);
        setSelectedProducts(newSelectedProducts);
      } else {
        setSelectedProducts(selectedProducts?.filter((i) => i != item.id));
      }
    };
    return (
      <RBSheet
        ref={ref}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions?.get("window").height * 0.8}
        customStyles={bottomSheetStyles}
      >
        <ProductList
          data={data}
          onSelect={onSelect}
          selectedProducts={selectedProducts}
        />
      </RBSheet>
    );
  }
);

const bottomSheetStyles = {
  wrapper: {
    backgroundColor: "#0000005f",
  },
  draggableIcon: {
    backgroundColor: "#000",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
  },
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  item: {
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f3f3f3",
    color: "black",
    marginHorizontal: 20,
    borderRadius: 5,
  },
});

export default ProductBottomSheet;
