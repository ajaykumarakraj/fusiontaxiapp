import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PassengerScreen = ({ navigation, route }) => {
  const rideData = route?.params?.rideData || {};

  const [selectedCount, setSelectedCount] = useState(
    rideData?.passengers || null
  );

  const passengerOptions = [1, 2, 3, 4, 5, 6];

  const handleContinue = () => {
    if (!selectedCount) {
      return;
    }

    const finalRideData = {
      ...rideData,
      passengers: selectedCount,
    };

    console.log('select person Data:', finalRideData);

    navigation.navigate('PricePerSeat', {
      rideData: finalRideData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Passengers</Text>

        <View style={{ width: 42 }} />
      </View>

      <View style={styles.content}>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon
            name="people-outline"
            size={40}
            color="#1976D2"
          />
        </View>

        <Text style={styles.title}>
          Passenger Capacity
        </Text>

        <Text style={styles.subtitle}>
          How many passengers can you take on this ride?
        </Text>

        {/* Passenger Options */}
        <View style={styles.optionsContainer}>
          {passengerOptions.map((count) => {
            const selected = selectedCount === count;

            return (
              <TouchableOpacity
                key={count}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
                onPress={() => setSelectedCount(count)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {count}
                </Text>

                <Text
                  style={[
                    styles.seatText,
                    selected && styles.seatTextSelected,
                  ]}
                >
                  {count === 1 ? 'Seat' : 'Seats'}
                </Text>

                {selected && (
                  <View style={styles.check}>
                    <Icon
                      name="checkmark"
                      size={14}
                      color="#fff"
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected */}
        {selectedCount && (
          <View style={styles.selectedInfo}>
            <Icon
              name="checkmark-circle"
              size={22}
              color="#1976D2"
            />

            <Text style={styles.selectedInfoText}>
              {selectedCount}{' '}
              {selectedCount === 1 ? 'passenger' : 'passengers'} selected
            </Text>
          </View>
        )}

      </View>

      {/* Continue */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedCount && styles.buttonDisabled,
          ]}
          disabled={!selectedCount}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Icon
            name="arrow-forward"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default PassengerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 45,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF3FF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 35,
    lineHeight: 21,
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },

  option: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9DEE5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
  },

  optionSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },

  optionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },

  optionTextSelected: {
    color: '#fff',
  },

  seatText: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  seatTextSelected: {
    color: '#EAF3FF',
  },

  check: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0D47A1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  selectedInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },

  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  continueButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  buttonDisabled: {
    backgroundColor: '#AFC8E8',
  },

  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});