import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "./CustomTabBar";
import Home from "../../Screens/Tabs/Dashboard";
import OrdersScreen from "../../Screens/Tabs/OrdersScreen";
import ProductScreen from "../../Screens/Tabs/ProuctScreen";
import Profile from "../../Screens/Tabs/Profile";
import GoLive from "../../Screens/Tabs/GoLive";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />} // Use your custom tab bar component
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { position: "absolute" }, // Hide the header for all screens
      }}
    >
      <Tab.Screen name={"Dashboard"} component={Home} />
      <Tab.Screen name={"Orders"} component={OrdersScreen} />
      <Tab.Screen name={"Go Live"} component={GoLive} />
      <Tab.Screen name={"Products"} component={ProductScreen} />
      <Tab.Screen name={"Profile"} component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
