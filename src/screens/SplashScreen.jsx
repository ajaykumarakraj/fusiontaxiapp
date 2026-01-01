import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";


const SplashScreen = ({navigation}) => {
  useEffect(()=>{
    setTimeout(()=>{
      navigation.replace("Login")
    },3000)
  },[navigation])
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icons/logo.png")}/>
      <Text style={styles.text}>Welcome to Fusion Taxi</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,              
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop:40
  },
});
