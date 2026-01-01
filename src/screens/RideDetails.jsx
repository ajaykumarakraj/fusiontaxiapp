import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const RideDetails = ({ route }) => {
  const navigation = useNavigation();
  const { ride, from, to } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} />
      </TouchableOpacity>

      <Image source={{ uri: ride.image }} style={styles.avatar} />

      <Text style={styles.name}>{ride.name}</Text>
      <Text style={styles.subText}>{ride.car}</Text>

      <View style={styles.row}>
        <Text>{from} → {to}</Text>
        <Text>{ride.time}</Text>
      </View>

      <Text style={styles.price}>{ride.price}</Text>

      <TouchableOpacity style={styles.bookBtn}>
        <Text style={styles.bookText}>Book Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RideDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A84FF",
    textAlign: "center",
  },
  bookBtn: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  bookText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
