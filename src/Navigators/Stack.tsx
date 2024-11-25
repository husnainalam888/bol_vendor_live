import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Tabs/Dashboard";
import BottomTabs from "./Bottom/BottomTabs";
import LoginScreen from "../Screens/LoginScreen";
import OrderDetails from "../Screens/OrderDetails";
import AddProduct from "../Screens/AddProduct";
import GoLive from "../Screens/Tabs/GoLive";

const Stack = createNativeStackNavigator();

function StackNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="BottomNav" component={BottomTabs} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="GoLive" component={GoLive} />
    </Stack.Navigator>
  );
}

export default StackNav;
