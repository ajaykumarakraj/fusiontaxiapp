import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";

const Home = () => {
    const navigation = useNavigation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("Today");
  const [persons, setPersons] = useState(1);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Where are you going?</Text>

      {/* FROM */}
      <View style={styles.inputBox}>
        <Icon name="location-outline" size={20} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Leaving from"
          value={from}
          onChangeText={setFrom}
        />
      </View>

      {/* TO */}
      <View style={styles.inputBox}>
        <Icon name="navigate-outline" size={20} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Going to"
          value={to}
          onChangeText={setTo}
        />
      </View>

      {/* DATE */}
      <TouchableOpacity style={styles.inputBox}>
        <Icon name="calendar-outline" size={20} color="#333" />
        <Text style={styles.text}>{date}</Text>
      </TouchableOpacity>

      {/* PERSONS */}
      <View style={styles.inputBox}>
        <Icon name="people-outline" size={20} color="#333" />
        <TouchableOpacity
          onPress={() => persons > 1 && setPersons(persons - 1)}
        >
          <Text style={styles.counter}>-</Text>
        </TouchableOpacity>

        <Text style={styles.personText}>{persons}</Text>

        <TouchableOpacity onPress={() => setPersons(persons + 1)}>
          <Text style={styles.counter}>+</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BUTTON */}
     <TouchableOpacity
  style={styles.searchBtn}
  onPress={() =>
    navigation.navigate("RideList", {
      from,
      to,
      date,
      persons,
    })
  }
>
  <Text style={styles.searchText}>Search Ride</Text>
</TouchableOpacity>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A84FF",
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  counter: {
    fontSize: 22,
    paddingHorizontal: 12,
    color: "#0A84FF",
    fontWeight: "bold",
  },
  personText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  searchBtn: {
    backgroundColor: "#000",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  searchText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
