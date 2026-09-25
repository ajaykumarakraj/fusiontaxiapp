import React, { useState,useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Keychain from 'react-native-keychain';
const Home = () => {
  const [showPicker, setShowPicker] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());
const [date, setDate] = useState("Today");

  const navigation = useNavigation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [persons, setPersons] = useState(1);

  return (
    <View style={styles.container}>
      {/* Illustration */}
       <Image source={require("../../assets/icons/logo.png")}
        style={styles.image}
      />

      <Text style={styles.heading}>Where are you going?</Text>

      {/* Card */}
      <View style={styles.card}>
        {/* FROM */}
        <View style={styles.row}>
          <Icon name="location-outline" size={20} color="#f40b0f" />
          <TextInput
            placeholder="Leaving from"
            style={styles.input}
            value={from}
            onChangeText={setFrom}
              placeholderTextColor="#131313"
          />
        </View>

        <View style={styles.divider} />

        {/* TO */}
        <View style={styles.row}>
          <Icon name="navigate-outline" size={20} color="#f40b0f" />
          <TextInput
            placeholder="Going to"
            style={styles.input}
            value={to}
            onChangeText={setTo}
            placeholderTextColor="#131313"
          />
        </View>

        <View style={styles.divider} />

        {/* DATE */}
   <TouchableOpacity
  style={styles.row}
  onPress={() => setShowPicker(true)}
>
  <Icon name="calendar-outline" size={20} color="#f40b0f" />
  <Text style={styles.text}>{date}</Text>
</TouchableOpacity>

{showPicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="calendar"
    minimumDate={new Date()}
    onChange={(event, pickedDate) => {
      setShowPicker(false);

      if (pickedDate) {
        setSelectedDate(pickedDate);
        setDate(
          pickedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        );
      }
    }}
  />
)}


        <View style={styles.divider} />

        {/* PERSONS */}
        <View style={styles.rowBetween}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="people-outline" size={20} color="#f40b0f" />
            <Text style={styles.text}>Passengers</Text>
          </View>

          <View style={styles.counterBox}>
            <TouchableOpacity
              onPress={() => persons > 1 && setPersons(persons - 1)}
            >
              <Icon name="remove" size={20} />
            </TouchableOpacity>

            <Text style={styles.count}>{persons}</Text>

            <TouchableOpacity onPress={() => setPersons(persons + 1)}>
              <Icon name="add" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search */}
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={() =>
          navigation.navigate("RideList", { from, to, date, persons })
        }
      >
        <Text style={styles.searchText}>Search rides</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
    padding: 20,
     paddingTop: 40,
  },
  image: {
   width: "80%",
  
    height: 140,
    alignSelf: "center",
    marginTop: 20,

  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
  input: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
    placeholderTextColor: "#0e0e0e"
  },
  text: {
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  count: {
    fontSize: 16,
    fontWeight: "600",
  },
  searchBtn: {
    backgroundColor: "#f40b0f",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  searchText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
