
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
const AddVehicleScreen = ({navigation}) => {
  const [vehicleType, setVehicleType] = useState('car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('petrol');
  const [totalSeats, setTotalSeats] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [loading, setLoading] = useState(false);

  const vehicleTypes = [
    {
      label: 'Car',
      value: 'car',
      icon: 'car-outline',
    },
    {
      label: 'SUV',
      value: 'suv',
      icon: 'car-sport-outline',
    },
    {
      label: 'Bike',
      value: 'bike',
      icon: 'bicycle-outline',
    },
  ];

  const fuelTypes = [
    {
      label: 'Petrol',
      value: 'petrol',
    },
    {
      label: 'Diesel',
      value: 'diesel',
    },
    {
      label: 'CNG',
      value: 'cng',
    },
    {
      label: 'Electric',
      value: 'electric',
    },
  ];

  const saveVehicle = async () => {
    if (!vehicleType) {
      Alert.alert('Required', 'Please select vehicle type.');
      return;
    }

    if (!make.trim()) {
      Alert.alert('Required', 'Please enter vehicle make.');
      return;
    }

    if (!model.trim()) {
      Alert.alert('Required', 'Please enter vehicle model.');
      return;
    }

    if (!variant.trim()) {
      Alert.alert('Required', 'Please enter vehicle variant.');
      return;
    }

    if (!registrationNumber.trim()) {
      Alert.alert('Required', 'Please enter registration number.');
      return;
    }

    if (!color.trim()) {
      Alert.alert('Required', 'Please enter vehicle color.');
      return;
    }

    if (!year.trim()) {
      Alert.alert('Required', 'Please enter vehicle year.');
      return;
    }

    if (!totalSeats.trim()) {
      Alert.alert('Required', 'Please enter total seats.');
      return;
    }

    if (!availableSeats.trim()) {
      Alert.alert(
        'Required',
        'Please enter available passenger seats.',
      );
      return;
    }

    if (Number(availableSeats) > Number(totalSeats)) {
      Alert.alert(
        'Invalid Seats',
        'Available passenger seats cannot be greater than total seats.',
      );
      return;
    }

    const vehicleData = {
      vehicle_type: vehicleType,
      make: make.trim(),
      model: model.trim(),
      variant: variant.trim(),
      registration_number: registrationNumber
        .trim()
        .toUpperCase(),
      color: color.trim(),
      year: Number(year),
      fuel_type: fuelType,
      total_seats: Number(totalSeats),
      available_passenger_seats: Number(availableSeats),
    };

    try {
      setLoading(true);

      console.log('POST DATA:', vehicleData);
const credentials = await Keychain.getGenericPassword();
  if (!credentials) {
      Alert.alert('Session Expired', 'Please login again.');
      return;
    }

    const token = credentials.password;
      // Apna actual API URL yahan lagaye
      const response = await axios.post(
        'https://api.squarebigha.com/oldApi/api/v1/vehicles',
        vehicleData,
        {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Vehicle Response:', response.data);

      Alert.alert(
        'Success',
        'Vehicle added successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log(
        'Add Vehicle Error:',
        error?.response?.data || error.message,
      );

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Unable to add vehicle. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={23} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Vehicle</Text>

        <View style={styles.headerSpace} />
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>

          {/* Vehicle Icon */}
          <View style={styles.vehicleIcon}>
            <Icon
              name="car-sport-outline"
              size={38}
              color="#E50914"
            />
          </View>

          <Text style={styles.heading}>
            Add your vehicle
          </Text>

          <Text style={styles.description}>
            Enter your vehicle details below.
          </Text>

          {/* Vehicle Type */}
          <Text style={styles.label}>Vehicle Type</Text>

          <View style={styles.optionContainer}>
            {vehicleTypes.map(item => (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => setVehicleType(item.value)}
                style={[
                  styles.optionButton,
                  vehicleType === item.value &&
                    styles.selectedOption,
                ]}>

                <Icon
                  name={item.icon}
                  size={20}
                  color={
                    vehicleType === item.value
                      ? '#FFFFFF'
                      : '#555'
                  }
                />

                <Text
                  style={[
                    styles.optionText,
                    vehicleType === item.value &&
                      styles.selectedOptionText,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Make */}
          <Text style={styles.label}>Make</Text>

          <Input
            icon="business-outline"
            placeholder="Example: Maruti Suzuki"
            value={make}
            onChangeText={setMake}
          />

          {/* Model */}
          <Text style={styles.label}>Model</Text>

          <Input
            icon="car-outline"
            placeholder="Example: Swift"
            value={model}
            onChangeText={setModel}
          />

          {/* Variant */}
          <Text style={styles.label}>Variant</Text>

          <Input
            icon="options-outline"
            placeholder="Example: VXI"
            value={variant}
            onChangeText={setVariant}
          />

          {/* Registration */}
          <Text style={styles.label}>
            Registration Number
          </Text>

          <Input
            icon="document-text-outline"
            placeholder="Example: UP14AB1234"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            autoCapitalize="characters"
          />

          {/* Color */}
          <Text style={styles.label}>Color</Text>

          <Input
            icon="color-palette-outline"
            placeholder="Example: White"
            value={color}
            onChangeText={setColor}
          />

          {/* Year */}
          <Text style={styles.label}>Manufacturing Year</Text>

          <Input
            icon="calendar-outline"
            placeholder="Example: 2024"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
          />

          {/* Fuel */}
          <Text style={styles.label}>Fuel Type</Text>

          <View style={styles.fuelContainer}>
            {fuelTypes.map(item => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setFuelType(item.value)}
                style={[
                  styles.fuelButton,
                  fuelType === item.value &&
                    styles.selectedFuel,
                ]}>
                <Text
                  style={[
                    styles.fuelText,
                    fuelType === item.value &&
                      styles.selectedFuelText,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Total Seats */}
          <Text style={styles.label}>Total Seats</Text>

          <Input
            icon="people-outline"
            placeholder="Example: 5"
            value={totalSeats}
            onChangeText={setTotalSeats}
            keyboardType="number-pad"
            maxLength={2}
          />

          {/* Available Passenger Seats */}
          <Text style={styles.label}>
            Available Passenger Seats
          </Text>

          <Input
            icon="person-add-outline"
            placeholder="Example: 3"
            value={availableSeats}
            onChangeText={setAvailableSeats}
            keyboardType="number-pad"
            maxLength={2}
          />

          {/* Save */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              loading && styles.disabledButton,
            ]}
            activeOpacity={0.8}
            disabled={loading}
            onPress={saveVehicle}>

            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon
                  name="checkmark-circle-outline"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.saveText}>
                  Add Vehicle
                </Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Input = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  autoCapitalize,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Icon
        name={icon}
        size={20}
        color="#888"
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
};

export default AddVehicleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
  },

  headerSpace: {
    width: 42,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  vehicleIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EAF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 15,
  },

  heading: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  description: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },

  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  optionButton: {
    height: 44,
    paddingHorizontal: 15,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },

  selectedOption: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },

  optionText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 7,
  },

  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  inputContainer: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    marginLeft: 10,
  },

  fuelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  fuelButton: {
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },

  selectedFuel: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },

  fuelText: {
    fontSize: 13,
    color: '#555',
  },

  selectedFuelText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  saveButton: {
    height: 52,
    backgroundColor: '#E50914',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});


