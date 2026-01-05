import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const PassengerScreen = ({ navigation }) => {
  const [selectedCount, setSelectedCount] = useState(null);

  const passengerOptions = [1, 2, 3, 4, 5, 6];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Capacity</Text>
      <Text style={styles.subtitle}>
        How many passengers can you take on this ride?
      </Text>

      <View style={styles.optionsContainer}>
        {passengerOptions.map((count) => (
          <TouchableOpacity
            key={count}
            style={[
              styles.option,
              selectedCount === count && styles.optionSelected,
            ]}
            onPress={() => setSelectedCount(count)}
          >
            <Text
              style={[
                styles.optionText,
                selectedCount === count && styles.optionTextSelected,
              ]}
            >
              {count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedCount && styles.buttonDisabled,
        ]}
        disabled={!selectedCount}
        onPress={() => {
         navigation.navigate('PricePerSeat', { passengers: selectedCount });
         console.log('Passengers:', selectedCount);
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PassengerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  option: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
  continueButton: {
    marginTop: 40,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
