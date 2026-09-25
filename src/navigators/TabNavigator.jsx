import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

// import Home from "../screens/Search";
import Search from "../screens/Search";
import PublishScreen from "../screens/PublishScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RidesScreen from "../screens/RidesScreen"
import InboxScreen from "../screens/InboxScreen"
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
     initialRouteName="Profile"
      screenOptions={({ route }) => ({
        
        headerShown: false,
        tabBarActiveTintColor: "#0A84FF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 100,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Search") iconName = "search-outline";
          else if (route.name === "Your Rides") iconName = "car-outline";
          else if (route.name === "Publish") iconName = "add-circle-outline";
           else if (route.name === "Inbox") iconName = "chatbubble-ellipses-outline";
          else if (route.name === "Profile") iconName = "person-outline";
        
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Publish" component={PublishScreen} />
      <Tab.Screen name="Your Rides" component={RidesScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      
    </Tab.Navigator>
  );
};

export default TabNavigator;
