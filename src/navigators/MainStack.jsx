import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from "./TabNavigator"
import Home from '../screens/Search'
import RideList from "../screens/RideList"
import RideDetails from "../screens/RideDetails"
import DropOff from "../screens/DropOff"
import SelectDateScreen from "../screens/SelectDateScreen"
import PassengerScreen from "../screens/SelectPassengers"
import PricePerSeatScreen from "../screens/PricePerSeatScreen"
import EditProfile from "../screens/EditProfile"
import VerifyKYC  from "../screens/VerifyKYC"
import KycDocuments from "../screens/KycDocuments"
const Stack=createNativeStackNavigator()
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="TabNavigator" component={TabNavigator}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="RideList" component={RideList} />
        <Stack.Screen name="RideDetails" component={RideDetails} />
        <Stack.Screen name="Dropoff" component={DropOff}/>
        <Stack.Screen name="SelectDate" component={SelectDateScreen}/>
        <Stack.Screen name="SelectPassenger" component={PassengerScreen}/>
        <Stack.Screen name="PricePerSeat" component={PricePerSeatScreen}/>
        <Stack.Screen name="EditProfile" component={EditProfile}/>
        <Stack.Screen name="VerifyKYC" component={VerifyKYC} />
        <Stack.Screen name="KycDocuments" component={KycDocuments}/>
    </Stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})