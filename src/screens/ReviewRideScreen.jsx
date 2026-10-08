import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
const ReviewRide = ({ navigation, route }) => {




  
  const rideData = route?.params?.rideData || {};

  const pickup = rideData?.pickupLocation;
  const drop = rideData?.dropLocation;

  const handleEdit = (screen) => {
    navigation.navigate(screen, {
      rideData,
    });
  };

  const handlePostRide = async () => {
    console.log('Review DATA:',rideData.date);
 
    // Yahan API call karna hai
try{
   const credentials = await Keychain.getGenericPassword();

    if (!credentials) {
      Alert.alert('Session Expired', 'Please login again.');
      return;
    }
console.log('Credentials:', credentials);
    const token = credentials.password;
  const payload={
    vehicle_id:rideData.car.id,
    driver_id:rideData.car.user_id,
    from_address:rideData.pickupLocation.formatted_address,
    from_latitude:rideData.pickupLocation.latitude,
    from_longitude:rideData.pickupLocation.longitude,
    to_address:rideData.dropLocation.formatted_address,
    to_latitude:rideData.dropLocation.latitude,
    to_longitude:rideData.dropLocation.longitude,
    departure_date:rideData.date,
    departure_time:rideData.time,
    total_seats:rideData.passengers,
    available_seats:rideData.passengers,
    price_per_seat:rideData.pricePerSeat,
    notes:"Comfortable ride. One small luggage allowed.",
    booking_type:"instant",
    smoking_allowed:false,
    pets_allowed:false,
    music_allowed:true,
    stops:[{"address":"Sector 62, Noida","latitude":28.6271,"longitude":77.3714},{"address":"Sector 18, Noida","latitude":28.5706,"longitude":77.3219}]
  }
  console.log('post Payload:', payload);
const response = await axios.post(' https://api.squarebigha.com/oldApi/api/v1/rides',payload, {
  headers:{
    Authorization:`Bearer ${token}`,
  }
})
console.log('Ride posted successfully:', response.data);
}
catch(error){
  console.error('Error posting ride:', error);
}


    // Example:
    // navigation.navigate('RideSuccess');
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

        <Text style={styles.headerTitle}>
          Review Ride
        </Text>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Title */}
        <Text style={styles.title}>
          Review your ride
        </Text>

        <Text style={styles.subtitle}>
          Check all details before posting your ride
        </Text>

        {/* Route Card */}
        <View style={styles.card}>

          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Route
            </Text>

            <TouchableOpacity
              onPress={() =>
                handleEdit('PickupCity')
              }
            >
              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pickup */}
          <View style={styles.locationRow}>

            <View style={styles.iconColumn}>
              <View style={styles.pickupDot} />

              <View style={styles.verticalLine} />
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>
                PICKUP
              </Text>

              <Text style={styles.locationText}>
                {pickup?.formatted_address ||
                  'Pickup location'}
              </Text>
            </View>

          </View>

          {/* Drop */}
          <View style={styles.locationRow}>

            <View style={styles.iconColumn}>
              <View style={styles.dropDot} />
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>
                DROP
              </Text>

              <Text style={styles.locationText}>
                {drop?.formatted_address ||
                  'Drop location'}
              </Text>
            </View>

          </View>

        </View>

        {/* Date & Time */}
        <View style={styles.card}>

          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Schedule
            </Text>

            <TouchableOpacity
              onPress={() =>
                handleEdit('SelectDate')
              }
            >
              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>

            <View style={styles.infoIcon}>
              <Icon
                name="calendar-outline"
                size={23}
                color="#1976D2"
              />
            </View>

            <View>
              <Text style={styles.infoLabel}>
                DATE
              </Text>

              <Text style={styles.infoValue}>
                {rideData?.date ||
                  'Date not selected'}
              </Text>
            </View>

          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>

            <View style={styles.infoIcon}>
              <Icon
                name="time-outline"
                size={23}
                color="#1976D2"
              />
            </View>

            <View>
              <Text style={styles.infoLabel}>
                DEPARTURE TIME
              </Text>

              <Text style={styles.infoValue}>
                {rideData?.time ||
                  'Time not selected'}
              </Text>
            </View>

          </View>

        </View>

        {/* Passenger & Price */}
        <View style={styles.card}>

          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Ride Details
            </Text>

            <TouchableOpacity
              onPress={() =>
                handleEdit('Passenger')
              }
            >
              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>

            {/* Passengers */}
            <View style={styles.detailBox}>

              <View style={styles.detailIcon}>
                <Icon
                  name="people-outline"
                  size={25}
                  color="#1976D2"
                />
              </View>

              <Text style={styles.detailLabel}>
                PASSENGERS
              </Text>

              <Text style={styles.detailValue}>
                {rideData?.passengers || 0}
              </Text>

              <Text style={styles.detailSmall}>
                {rideData?.passengers === 1
                  ? 'Seat'
                  : 'Seats'}
              </Text>

            </View>

            {/* Price */}
            <View style={styles.detailBox}>

              <View style={styles.detailIcon}>
                <Icon
                  name="cash-outline"
                  size={25}
                  color="#1976D2"
                />
              </View>

              <Text style={styles.detailLabel}>
                PRICE / SEAT
              </Text>

              <Text style={styles.detailValue}>
                ₹{rideData?.pricePerSeat || 0}
              </Text>

              <Text style={styles.detailSmall}>
                Per passenger
              </Text>

            </View>

          </View>

        </View>

        {/* Earnings */}
        {rideData?.passengers &&
          rideData?.pricePerSeat && (
            <View style={styles.earningCard}>

              <View>
                <Text style={styles.earningLabel}>
                  Potential earnings
                </Text>

                <Text style={styles.earningSubtext}>
                  {rideData.passengers} passengers × ₹
                  {rideData.pricePerSeat}
                </Text>
              </View>

              <Text style={styles.earningAmount}>
                ₹
                {rideData.passengers *
                  rideData.pricePerSeat}
              </Text>

            </View>
          )}

        {/* Bottom Space */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Post Ride */}
      <View style={styles.bottomContainer}>

        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePostRide}
        >
          <Icon
            name="checkmark-circle-outline"
            size={22}
            color="#fff"
          />

          <Text style={styles.postButtonText}>
            Post Ride
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

export default ReviewRide;

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

  scrollContent: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E6E9ED',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  editText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '700',
  },

  locationRow: {
    flexDirection: 'row',
    minHeight: 65,
  },

  iconColumn: {
    width: 30,
    alignItems: 'center',
  },

  pickupDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#1976D2',
    marginTop: 4,
  },

  dropDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#E53935',
    marginTop: 4,
  },

  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D0D5DB',
    marginTop: 4,
    marginBottom: 4,
  },

  locationContent: {
    flex: 1,
    paddingLeft: 10,
  },

  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    marginBottom: 4,
  },

  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EAF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailBox: {
    width: '48%',
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    padding: 14,
  },

  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
  },

  detailValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
    marginTop: 3,
  },

  detailSmall: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },

  earningCard: {
    backgroundColor: '#EAF8F0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  earningLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
  },

  earningSubtext: {
    fontSize: 12,
    color: '#5B7D60',
    marginTop: 4,
  },

  earningAmount: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1B5E20',
  },

  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  postButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});