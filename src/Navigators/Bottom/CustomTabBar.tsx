import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { SvgFromXml } from "react-native-svg";
import { Colors } from "../../Utils/Colors";
import { SVG } from "../../Svgs/SVG";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [appearance, setAppearance] = React.useState("dark");

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name == "Go Live") {
            navigation.navigate("GoLive");
            return;
          }
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Define the image source based on whether the tab is focused or not
        let imageName = "";
        switch (route.name) {
          case "Dashboard":
            imageName = isFocused ? SVG.dashboardFill : SVG.dashboard;
            break;
          case "Orders":
            imageName = isFocused ? SVG.ordersFill : SVG.orders;
            break;
          case "Products":
            imageName = isFocused ? SVG.produtFill : SVG.product;
            break;
          case "Profile":
            imageName = isFocused ? SVG.profileFill : SVG.profile;
            break;
          case "Go Live":
            imageName = isFocused ? SVG.liveFill : SVG.liveOutline;
            break;

          default:
            break;
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={
              route.name != "Sell"
                ? onPress
                : () => navigation.navigate("SellStep1")
            }
            style={[styles.tab]}
          >
            <SvgFromXml xml={imageName} height={20} width={20} />
            <Text
              style={{
                fontSize: 12,
                color: isFocused ? "#000" : "gray",
                marginTop: 8,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#f3f3f3",
  },
  tab: {
    flex: 1 / 4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
  },
  shadow: {
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
});

export default CustomTabBar;
