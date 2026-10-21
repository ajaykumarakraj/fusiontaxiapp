import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const PublishSuccessScreen = ({ navigation, route }) => {
  const ride = route?.params?.ride;

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successCircle}>
          <Ionicons
            name="checkmark"
            size={65}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.title}>
          Ride Published Successfully!
        </Text>

        <Text style={styles.subtitle}>
          Your ride is now live. Passengers can discover
          and book your ride.
        </Text>

        {/* Ride Details */}
        {ride && (
          <View style={styles.rideCard}>
            <Text style={styles.cardTitle}>
              Your Ride Details
            </Text>

            <View style={styles.detailRow}>
              <Ionicons
                name="location-outline"
                size={22}
                color="#2563EB"
              />

              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>From</Text>
                <Text style={styles.detailValue}>
                  {ride.from_address || ride.from || 'Pickup location'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons
                name="navigate-outline"
                size={22}
                color="#16A34A"
              />

              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>To</Text>
                <Text style={styles.detailValue}>
                  {ride.to_address || ride.to || 'Destination'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color="#2563EB"
              />

              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>
                  Departure Date
                </Text>
                <Text style={styles.detailValue}>
                  {ride.departure_date || ride.date || 'Not specified'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Success Message */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#2563EB"
          />

          <Text style={styles.infoText}>
            You can manage your published ride from My Rides.
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        {/* <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('PublishRides')
          }
        >
          <Text style={styles.primaryButtonText}>
            View My Rides
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
       
           onPress={() =>
    navigation.navigate('TabNavigator', {
      screen: 'Home',
    })
  }
        >
          <Text style={styles.secondaryButtonText}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PublishSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 30,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successCircle: {
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    elevation: 5,
    shadowColor: '#16A34A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#172033',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: '#7B8494',
    textAlign: 'center',
    paddingHorizontal: 5,
    marginBottom: 30,
  },

  rideCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 20,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  detailTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  detailLabel: {
    fontSize: 12,
    color: '#7B8494',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172033',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 12,
    width: '100%',
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1D4ED8',
    marginLeft: 10,
    lineHeight: 19,
  },

  footer: {
    paddingBottom: 25,
    gap: 12,
  },

  primaryButton: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  secondaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
});