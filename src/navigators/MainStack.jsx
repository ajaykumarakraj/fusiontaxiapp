import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from "./TabNavigator"
import Home from '../screens/Home'
import RideList from "../screens/RideList"
import RideDetails from "../screens/RideDetails"
const Stack=createNativeStackNavigator()
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="TabNavigator" component={TabNavigator}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="RideList" component={RideList} />
        <Stack.Screen name="RideDetails" component={RideDetails} />
    </Stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})