import React, { useState } from "react";
import { View, Text, Button, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const SelectDateScreen = ({ route, navigation }) => {
  const { city } = route.params; // selected city from previous screen

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Called when a date is selected
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios"); // keep picker open on iOS
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleConfirm = () => {
    // After picking a date, you can navigate further
    navigation.navigate("SelectPassenger", { city, date: date.toDateString() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pickup City: {city}</Text>
      <Text style={styles.label}>Selected Date: {date.toDateString()}</Text>

      <Button title="Select Date" onPress={showDatePicker} />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar" // calendar style
          onChange={onChange}
          minimumDate={new Date()} // optional: disable past dates
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Confirm Date" onPress={handleConfirm} />
      </View>
    </View>
  );
};

export default SelectDateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
