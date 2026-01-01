import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const dummyRides = [
  {
    id: "1",
    name: "Rahul Sharma",
    price: "₹450",
    time: "10:30 AM",
    car: "Swift Dzire",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "2",
    name: "Amit Verma",
    price: "₹500",
    time: "12:00 PM",
    car: "Baleno",
    image: "https://i.pravatar.cc/150?img=5",
  },
];

const RideList = ({ route }) => {
  const { from, to, date, persons } = route.params;
const navigation = useNavigation();


 const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("RideDetails", {
          ride: item,
          from,
          to,
          date,
          persons,
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subText}>
          {from} → {to}
        </Text>
        <Text style={styles.subText}>
          {item.time} • {item.car}
        </Text>
      </View>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
           <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} />
              </TouchableOpacity>
      <Text style={styles.header}>
        {from} → {to}
      </Text>
      <Text style={styles.info}>
        {date} • {persons} Person
      </Text>

      <FlatList
        data={dummyRides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default RideList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    color: "#555",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    color: "#666",
    fontSize: 13,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A84FF",
  },
});
