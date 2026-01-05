
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SplashScreen from '../screens/SplashScreen'
import Login from "../screens/Login"
import VerifyOtp from "../screens/VerifyOtp"
const Stack=createNativeStackNavigator()
const AuthStack = () => {

  return(
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Splash" component={SplashScreen}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="VerifyOtp" component={VerifyOtp}/>
    </Stack.Navigator>
  )

}

export default AuthStack

