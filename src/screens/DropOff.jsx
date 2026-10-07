
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const DropCityScreen = ({ navigation, route }) => {
  // ==========================================
  // HOOKS - ALWAYS AT TOP
  // ==========================================

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const skipAutocomplete = useRef(false);

  // ==========================================
  // PICKUP DATA
  // ==========================================

  const rideData = route?.params?.rideData || {};

  console.log("Pickup Data:", rideData.pickupLocation);

  // ==========================================
  // SEARCH GOOGLE PLACES
  // ==========================================

  const handleSearch = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Selected location ke baad autocomplete call nahi karna
    if (skipAutocomplete.current) {
      skipAutocomplete.current = false;
      return;
    }

    try {
      const response = await axios.get(
        `https://api.squarebigha.com/api/google/places/autocomplete?input=${encodeURIComponent(
          text
        )}`
      );

      if (response.data?.success) {
        setSuggestions(response.data.data || []);
        setShowDropdown(true);
      }
    } catch (error) {
      console.log(
        "Autocomplete Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // SELECT GOOGLE LOCATION
  // ==========================================

  const handleSelectLocation = async (item) => {
    try {
      setLoading(true);

      // Next query change par autocomplete API call nahi hogi
      skipAutocomplete.current = true;

      setQuery(item.description);

      // Dropdown close
      setShowDropdown(false);
      setSuggestions([]);

      // Google Place Details
      const response = await axios.get(
        `https://api.squarebigha.com/api/google/places/details/${item.place_id}`
      );

      if (response.data?.success) {
        const location = response.data.data;

        console.log(
          "location",
          location.formatted_address,
          location.latitude,
          location.longitude
        );

        console.log("Selected Location:", location);

        // ==========================================
        // DROP LOCATION OBJECT
        // ==========================================

        const dropLocation = {
          formatted_address: location.formatted_address,
          latitude: location.latitude,
          longitude: location.longitude,
        };

        // ==========================================
        // OLD PICKUP DATA + NEW DROP DATA
        // ==========================================

        const CityData = {
          ...rideData,
          dropLocation: dropLocation,
        };

        console.log("Drop page Data:", CityData);

        // ==========================================
        // NEXT SCREEN
        // ==========================================
// RouteSelection Screen par rideData bhejna
        // navigation.navigate("RouteSelection", {
        //   rideData: CityData,
        // });

        navigation.navigate("SelectDate", {
         rideData: CityData,
     });
      }
    } catch (error) {
      console.log(
        "Place Details Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.label}>
        Select Drop City
      </Text>

      {/* Search */}
      <TextInput
        style={styles.input}
        placeholder="Search drop city"
        value={query}
        onChangeText={handleSearch}
      />

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="small"
          style={styles.loader}
        />
      )}

      {/* Google Suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <FlatList
          style={styles.dropdown}
          data={suggestions}
          keyExtractor={(item, index) =>
            item.place_id || index.toString()
          }
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelectLocation(item)}
            >
              <Icon
                name="location-outline"
                size={20}
                color="#555"
              />

              <Text style={styles.itemText}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

    </View>
  );
};

export default DropCityScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  backButton: {
    marginBottom: 20,
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

  loader: {
    marginTop: 10,
  },

  dropdown: {
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 250,
    elevation: 3,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  itemText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
});

