
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
const API_BASE = 'https://api.squarebigha.com/api';

const Home = () => {
  const navigation = useNavigation();

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState('Today');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);

  const [persons, setPersons] = useState(1);

  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const skipAutocomplete = useRef(false);

  // Get the current text based on the active field
  const query = activeField === 'from' ? from : to;

  // Google Places Autocomplete
  

  // Fetch city/place suggestions
  const fetchSuggestions = async (text) => {
    try {
      setLoading(true);
 const credentials = await Keychain.getGenericPassword();

      if (!credentials) {
        Alert.alert('Session Expired', 'Please login again.');
        return;
      }
      const response = await axios.get(
        `${API_BASE}/google/places/autocomplete`,
        {
          params: { input: text },
          headers: {
             Authorization: `Bearer ${credentials.password}`,
          },
        }
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
        'Autocomplete Error:',
        error.response?.data || error.message
      );

      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    const searchText =
      typeof query === 'string' ? query.trim() : '';

    if (skipAutocomplete.current) {
      skipAutocomplete.current = false;
      return;
    }

    if (!activeField || searchText.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(searchText);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, activeField]);
  // Select a location and fetch coordinates
  const handleSelectLocation = async (item) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      setShowDropdown(false);
      setSuggestions([]);

      skipAutocomplete.current = true;

      if (activeField === 'from') {
        setFrom(item.description);
      } else {
        setTo(item.description);
      }

      const selectedField = activeField;
      setActiveField(null);

      const response = await axios.get(
        `${API_BASE}/google/places/details/${item.place_id}`
      );

      if (response.data?.success) {
        const location = response.data.data;

        const locationData = {
          formatted_address:
            location.formatted_address || item.description,
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
          place_id: item.place_id,
        };

        console.log('Selected Location:', locationData);

        if (selectedField === 'from') {
          setPickupLocation(locationData);
          setFrom(locationData.formatted_address);
        } else {
          setDropoffLocation(locationData);
          setTo(locationData.formatted_address);
        }
      } else {
        Alert.alert('Error', 'Location details nahi mil payi.');
      }
    } catch (error) {
      console.log(
        'Place Details Error:',
        error.response?.data || error.message
      );

      Alert.alert('Error', 'Location select nahi ho payi.');
    } finally {
      setLoading(false);
    }
  };

  // Search rides
  const handleSearch = () => {
    if (!pickupLocation) {
      Alert.alert(
        'Pickup Required',
        'Suggestions mein se pickup location select karein.'
      );
      return;
    }

    if (!dropoffLocation) {
      Alert.alert(
        'Destination Required',
        'Suggestions mein se destination select karein.'
      );
      return;
    }

    if (
      pickupLocation.place_id === dropoffLocation.place_id
    ) {
      Alert.alert(
        'Invalid Route',
        'Pickup aur destination alag hone chahiye.'
      );
      return;
    }

    Keyboard.dismiss();

  navigation.navigate('RideList', {
  from,
  to,
  date: selectedDate
    ? selectedDate.toISOString().split('T')[0]
    : '',
  persons,
  pickupLocation: {
    ...pickupLocation,
    formatted_address: from,
  },
  dropoffLocation,
});
  };

  const renderSuggestions = () => {
    if (!showDropdown) {
      return null;
    }

    return (
      <View style={styles.suggestionBox}>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#f40b0f"
            style={styles.loader}
          />
        )}

        <FlatList
          data={suggestions}
          keyExtractor={(item, index) =>
            item.place_id || String(index)
          }
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectLocation(item)}
            >
              <Icon
                name="location-outline"
                size={20}
                color="#f40b0f"
              />

              <Text style={styles.suggestionText}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>
        Where are you going?
      </Text>

      <View style={styles.card}>
        {/* FROM */}
        <View style={styles.row}>
          <Icon
            name="location-outline"
            size={20}
            color="#f40b0f"
          />

          <TextInput
            placeholder="Leaving from"
            style={styles.input}
            value={from}
            onFocus={() => {
              setActiveField('from');
              setShowDropdown(false);
            }}
            onChangeText={(value) => {
              setFrom(value);
              setPickupLocation(null);
              setActiveField('from');
            }}
            placeholderTextColor="#131313"
          />
        </View>

        {activeField === 'from' && renderSuggestions()}

        <View style={styles.divider} />

        {/* TO */}
        <View style={styles.row}>
          <Icon
            name="navigate-outline"
            size={20}
            color="#f40b0f"
          />

          <TextInput
            placeholder="Going to"
            style={styles.input}
            value={to}
            onFocus={() => {
              setActiveField('to');
              setShowDropdown(false);
            }}
            onChangeText={(value) => {
              setTo(value);
              setDropoffLocation(null);
              setActiveField('to');
            }}
            placeholderTextColor="#131313"
          />
        </View>

        {activeField === 'to' && renderSuggestions()}

        <View style={styles.divider} />

        {/* DATE */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            Keyboard.dismiss();
            setActiveField(null);
            setShowPicker(true);
          }}
        >
          <Icon
            name="calendar-outline"
            size={20}
            color="#f40b0f"
          />

          <Text style={styles.text}>{date}</Text>
        </TouchableOpacity>

        {showPicker && (
         <DateTimePicker
  value={selectedDate || new Date()}
  mode="date"
  display="calendar"
  minimumDate={new Date()}
  onChange={(event, pickedDate) => {
    setShowPicker(false);

    if (event.type === 'set' && pickedDate) {
      setSelectedDate(pickedDate);
      setDate(
        pickedDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
        })
      );
    }
  }}
/>
        )}

        <View style={styles.divider} />

        {/* PASSENGERS */}
        <View style={styles.rowBetween}>
          <View style={styles.passengerLabel}>
            <Icon
              name="people-outline"
              size={20}
              color="#f40b0f"
            />
            <Text style={styles.text}>Passengers</Text>
          </View>

          <View style={styles.counterBox}>
            <TouchableOpacity
              onPress={() =>
                setPersons((previous) =>
                  Math.max(1, previous - 1)
                )
              }
            >
              <Icon name="remove" size={20} color="#111" />
            </TouchableOpacity>

            <Text style={styles.count}>{persons}</Text>

            <TouchableOpacity
              onPress={() =>
                setPersons((previous) => previous + 1)
              }
            >
              <Icon name="add" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* SEARCH */}
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={handleSearch}
        activeOpacity={0.8}
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
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 40,
  },
  image: {
    width: '80%',
    height: 140,
    alignSelf: 'center',
    marginTop: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  passengerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  input: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
    color: '#131313',
    paddingVertical: 0,
  },
  text: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  suggestionBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    maxHeight: 180,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  loader: {
    margin: 8,
  },
  searchBtn: {
    backgroundColor: '#f40b0f',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  searchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
