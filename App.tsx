import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./src/Navigators/Stack";

export default function App() {
  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}
