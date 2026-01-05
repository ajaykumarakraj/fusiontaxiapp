import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: "Ajay Kumar",
    email: "ajay@example.com",
    phone: "+91 9876543210",
    avatar: "https://i.pravatar.cc/150?img=12",
  });

const menuOptions = [
  { id: 1, title: "Edit Profile", icon: "person-outline", screen: "EditProfile" },
  { id: 2, title: "Verify KYC", icon: "id-card-outline", screen: "KycDocuments" },
  { id: 3, title: "Payment Methods", icon: "card-outline", screen: "EditProfile" },
  { id: 4, title: "Ride History", icon: "time-outline", screen: "RideHistory" },
  { id: 5, title: "Settings", icon: "settings-outline", screen: "Settings" },
  { id: 6, title: "Help & Support", icon: "help-circle-outline", screen: "Settings" },
  { id: 7, title: "Logout", icon: "log-out-outline" },
];
 

const handleMenuPress = (option) => {
  if (option.title === "Logout") {
    console.log("User Logged Out");
    return;
  }

  navigation.navigate(option.screen);
};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
        {menuOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(option)}
          >
            <View style={styles.menuIcon}>
              <Icon name={option.icon} size={22} color="#f40b0f" />
            </View>
            <Text style={styles.menuText}>{option.title}</Text>
            <Icon name="chevron-forward-outline" size={20} color="#888" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#f40b0f",
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 5,
  },
  phone: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 2,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  menuIcon: {
    width: 30,
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});
