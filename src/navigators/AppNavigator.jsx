import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainStack from "./MainStack"
// import AuthStack from "./AuthStack"
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Main" component={MainStack}/>
      {/* <Stack.Screen name="Auth" component={AuthStack}/> */}
     
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; // ✅ very important
