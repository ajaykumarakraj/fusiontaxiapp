import React, { useEffect, useRef, useState } from "react";
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

const PickupCityScreen = ({ navigation, route }) => {
  const value = route?.params?.value || "";

  const [query, setQuery] = useState(
    typeof value === "string" ? value : ""
  );

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);


  // Selected location ke baad autocomplete API ko dobara call hone se rokega
  const skipAutocomplete = useRef(false);

  // Parent/previous screen se value aaye
  useEffect(() => {
    if (typeof value === "string") {
      setQuery(value);
    } else if (value?.formatted_address) {
      setQuery(value.formatted_address);
    } else {
      setQuery("");
    }
  }, [value]);

  // Google Places Autocomplete
  useEffect(() => {
    const searchText =
      typeof query === "string" ? query.trim() : "";

    if (skipAutocomplete.current) {
      skipAutocomplete.current = false;
      return;
    }

    if (!searchText || searchText.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(searchText);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions
  const fetchSuggestions = async (text) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://api.squarebigha.com/api/google/places/autocomplete?input=${encodeURIComponent(
          text
        )}`
      );

      if (response.data?.success) {
        const data = response.data.data || [];

        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.log(
        "Autocomplete Error:",
        error.response?.data || error.message
      );

      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // Select Google location
  const handleSelectLocation = async (item) => {
    try {
      setLoading(true);

      // Next query change par autocomplete API call nahi hogi
      skipAutocomplete.current = true;

      setQuery(item.description);

      // Dropdown close
      setShowDropdown(false);
      setSuggestions([]);

      const response = await axios.get(
        `https://api.squarebigha.com/api/google/places/details/${item.place_id}`
      );

      if (response.data?.success) {
        const location = response.data.data;
console.log("location",location.formatted_address,location.latitude,location.longitude);

        console.log("Selected Location:", location);

        // Dropoff screen par location bhejo
        const pickupLocation = {
  formatted_address: location.formatted_address,
  latitude: location.latitude,
  longitude: location.longitude,
};
        navigation.navigate("Dropoff", {
          rideData: {
    pickupLocation,
  },
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon
            name="arrow-back"
            size={24}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.label}>
          Select Pickup City
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.inputWrapper}>
        <Icon
          name="location-outline"
          size={20}
          color="#777"
          style={styles.locationIcon}
        />

        <TextInput
          value={query}
          onChangeText={(text) => {
            skipAutocomplete.current = false;
            setQuery(text);
            setShowDropdown(true);
          }}
          placeholder="Select city, locality, sector"
          placeholderTextColor="#999"
          style={styles.input}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color="#555"
          />
        )}
      </View>

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
              style={styles.suggestionItem}
              onPress={() => handleSelectLocation(item)}
            >
              <Icon
                name="location-outline"
                size={20}
                color="#666"
              />

              <View style={styles.textContainer}>
                <Text style={styles.mainText}>
                  {item.structured_formatting?.main_text ||
                    item.description}
                </Text>

                {item.structured_formatting?.secondary_text && (
                  <Text style={styles.secondaryText}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* No result */}
      {!loading &&
        showDropdown &&
        query.length >= 2 &&
        suggestions.length === 0 && (
          <View style={styles.noResult}>
            <Text style={styles.noResultText}>
              No location found
            </Text>
          </View>
        )}
    </View>
  );
};

export default PickupCityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    marginRight: 12,
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },

  locationIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    color: "#333",
  },

  dropdown: {
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 300,
    elevation: 3,
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  textContainer: {
    flex: 1,
    marginLeft: 12,
  },

  mainText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },

  secondaryText: {
    marginTop: 3,
    fontSize: 13,
    color: "#777",
  },

  noResult: {
    marginTop: 5,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  noResultText: {
    color: "#777",
    fontSize: 14,
  },
});