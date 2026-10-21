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
import SettingsScreen from "../screens/SettingsScreen"
import TravelPreferences from "../screens/TravelPreferences"
import MiniBioScreen from "../screens/MiniBioScreen"
import AddVehicleScreen from "../screens/AddVehicleScreen"
import RouteSelectionScreen from '../screens/RouteSelectionScreen'
import  SelectTimeScreen from '../screens/SelectTimeScreen'
import ReviewRideScreen from '../screens/ReviewRideScreen'
import SelectCarScreen from '../screens/SelectCars'
// import PublishRides from '../screens/PublishRides'
import HelpSupportScreen from "../screens/HelpSupportScreen"
import TermsConditions from "../screens/TermsConditionsScreen"
import RidePlaneScreen from "../screens/RidePlanScreen"
import CustomerDetailsScreen from "../screens/CustomerDetailsScreen"
import ChatScreen from "../screens/ChatScreen"
import PublishScreen from "../screens/PublishScreen"
import PublishSuccess from "../screens/PublishSuccessScreen"
const Stack=createNativeStackNavigator()
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="TabNavigator" component={TabNavigator}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="RideList" component={RideList} />
        <Stack.Screen name="RideDetails" component={RideDetails} />
        <Stack.Screen name="Dropoff" component={DropOff}/>
        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen}/>
        <Stack.Screen name="SelectDate" component={SelectDateScreen}/>
        <Stack.Screen name="SelectPassenger" component={PassengerScreen}/>
        <Stack.Screen name="PricePerSeat" component={PricePerSeatScreen}/>
        <Stack.Screen name="EditProfile" component={EditProfile}/>
        <Stack.Screen name="VerifyKYC" component={VerifyKYC} />
        <Stack.Screen name="KycDocuments" component={KycDocuments}/>
        <Stack.Screen name="Settings" component={SettingsScreen}/>
        <Stack.Screen name="TravelPreferences" component={TravelPreferences}/>
        <Stack.Screen name='MiniBio' component={MiniBioScreen}/>
        <Stack.Screen name="AddVehicle" component={AddVehicleScreen}/>
        <Stack.Screen name="SelectTime" component={SelectTimeScreen}/>
        <Stack.Screen name="ReviewRide" component={ReviewRideScreen}/>
        <Stack.Screen name="SelectCar" component={SelectCarScreen}/>
        {/* <Stack.Screen name="PublishRides" component={PublishRides}/> */}
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen}/>
        <Stack.Screen name="TermsConditions" component={TermsConditions}/>
        <Stack.Screen name='RidePlane' component={RidePlaneScreen}/>
        <Stack.Screen name="CustomerDetails" component={CustomerDetailsScreen}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen}/>
        <Stack.Screen name="NewPublishScreen" component={PublishScreen}/>
        <Stack.Screen name="PublishSuccess" component={PublishSuccess}/>
       
     </Stack.Navigator>
  )
}

export default MainStack

