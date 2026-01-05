import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


const cities = ["New Delhi", "Mumbai","New Delhi1", "Mumbai2",  "Bengaluru", "Chennai", "Kolkata", "Hyderabad"];

const DropCityScreen = ({ navigation }) => {
  
  const [query, setQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = cities.filter((city) =>
      city.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleSelect = (city) => {
    setQuery(city);
    setFilteredCities([]);
    navigation.navigate("SelectDate", { city });
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} />
            </TouchableOpacity>
      <Text style={styles.label}>Select Drop City</Text>

      <TextInput
        style={styles.input}
        placeholder="Search city"
        value={query}
        onChangeText={handleSearch}
      />

      {filteredCities.length > 0 && (
        <FlatList
          style={styles.dropdown}
          data={filteredCities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default DropCityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
  },
  dropdown: { 
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 200,
    elevation: 2,
  },
  itemText: {
    padding: 12,
    fontSize: 16,
  },
});
