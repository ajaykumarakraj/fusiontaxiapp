import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const PublishRide = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!from || !to || !date || !time || !seats || !price || !vehicle) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    // Backend API call here
    const rideData = { from, to, date, time, seats, price, vehicle, notes };
    console.log("Ride Published:", rideData);
    Alert.alert("Success", "Your ride has been published!");
    
    // Clear fields
    setFrom(""); setTo(""); setDate(""); setTime("");
    setSeats(""); setPrice(""); setVehicle(""); setNotes("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Publish Your Ride</Text>

      <InputField icon="location-outline" placeholder="Leaving From" value={from} setValue={setFrom} />
      <InputField icon="navigate-outline" placeholder="Going To" value={to} setValue={setTo} />
      <InputField icon="calendar-outline" placeholder="Date (DD/MM/YYYY)" value={date} setValue={setDate} />
      <InputField icon="time-outline" placeholder="Time (HH:MM AM/PM)" value={time} setValue={setTime} />
      <InputField icon="people-outline" placeholder="Seats Available" value={seats} setValue={setSeats} keyboardType="numeric" />
      <InputField icon="cash-outline" placeholder="Price per Seat" value={price} setValue={setPrice} keyboardType="numeric" />
      <InputField icon="car-outline" placeholder="Vehicle Model" value={vehicle} setValue={setVehicle} />
      <InputField icon="document-text-outline" placeholder="Notes (optional)" value={notes} setValue={setNotes} multiline={true} />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Publish Ride</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PublishRide;

// Input component
const InputField = ({ icon, placeholder, value, setValue, keyboardType, multiline }) => (
  <View style={styles.inputBox}>
    <Icon name={icon} size={20} color="#333" />
    <TextInput
      style={[styles.input, multiline && { height: 80 }]}
      placeholder={placeholder}
      value={value}
      onChangeText={setValue}
      keyboardType={keyboardType || "default"}
      multiline={multiline || false}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0A84FF",
    textAlign: "center",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#0A84FF",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
