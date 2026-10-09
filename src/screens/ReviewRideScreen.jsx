import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_URL = 'https://api.squarebigha.com/oldApi/api/v1/rides';

const ReviewRide = ({ navigation, route }) => {
  const rideData = route?.params?.rideData || {};
console.log('ReviewRideScreen - rideData:', rideData);
  const [loading, setLoading] = React.useState(false);

  const car = rideData.car || {};
  const pickup = rideData.from || 'Pickup location';
  const drop = rideData.to || 'Drop location';

  const stops = Array.isArray(rideData.stops)
    ? rideData.stops
    : [];

  const passengers = Number(rideData.passengers || 0);
  const pricePerSeat = Number(rideData.pricePerSeat || 0);

  // Route city / stop object se coordinates nikalna
  const getAddress = item => {
    if (typeof item === 'string') return item;

    return (
      item?.formatted_address ||
      item?.address ||
      item?.name ||
      item?.city ||
      item?.place_name ||
      ''
    );
  };

  const findLocation = address => {
    const cities = [
      ...(Array.isArray(rideData.route_cities)
        ? rideData.route_cities
        : []),
      ...(Array.isArray(rideData.stopDetails)
        ? rideData.stopDetails
        : []),
    ];

    return cities.find(item => {
      const itemAddress = getAddress(item);

      return (
        itemAddress.toLowerCase() ===
        String(address).toLowerCase()
      );
    });
  };

  const getCoordinates = address => {
    const location = findLocation(address);

    return {
      latitude:
        location?.latitude ??
        location?.lat ??
        location?.geometry?.location?.lat ??
        null,

      longitude:
        location?.longitude ??
        location?.lng ??
        location?.geometry?.location?.lng ??
        null,
    };
  };

  const handleEdit = screen => {
    navigation.navigate(screen, { rideData });
  };

  const handlePostRide = async () => {
    if (loading) return;

    if (!car.id || !car.user_id) {
      Alert.alert('Error', 'Please select a valid car.');
      return;
    }

    if (!rideData.from || !rideData.to) {
      Alert.alert('Error', 'Pickup and drop locations are required.');
      return;
    }

    if (!rideData.date || !rideData.time) {
      Alert.alert('Error', 'Please select the departure date and time.');
      return;
    }

    if (passengers < 1 || pricePerSeat < 1) {
      Alert.alert('Error', 'Please check passengers and seat price.');
      return;
    }

    try {
      setLoading(true);

      const credentials = await Keychain.getGenericPassword();

      if (!credentials) {
        Alert.alert('Session Expired', 'Please login again.');
        return;
      }

      const pickupCoordinates = getCoordinates(pickup);
      const dropCoordinates = getCoordinates(drop);

      const formattedStops = stops.map(stop => {
        const address = getAddress(stop);
        const coordinates = getCoordinates(address);

        // stopDetails mein coordinates hon to unhe priority dein
        const stopDetail =
          typeof stop === 'object' ? stop : findLocation(address);

        return {
          address,
          latitude:
            stopDetail?.latitude ??
            stopDetail?.lat ??
            coordinates.latitude,

          longitude:
            stopDetail?.longitude ??
            stopDetail?.lng ??
            coordinates.longitude,
        };
      });

      const payload = {
        vehicle_id: car.id,
        driver_id: car.user_id,

        from_address: pickup,
        from_latitude: rideData.from_latitude,
        from_longitude: rideData.from_longitude,

        to_address: drop,
        to_latitude: rideData.to_latitude ,
        to_longitude: rideData.to_longitude ,

        departure_date: rideData.date,
        departure_time: rideData.time,

        total_seats: passengers,
        available_seats: passengers,
        price_per_seat: pricePerSeat,

        notes: 'Comfortable ride. One small luggage allowed.',
        booking_type: 'instant',

        smoking_allowed: false,
        pets_allowed: false,
        music_allowed: true,

        stops: formattedStops,
      };

      console.log('Post Ride Payload:', payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${credentials.password}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.log('Ride posted successfully:', response.data);

      Alert.alert(
        'Success',
        'Your ride has been posted successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('RideSuccess'),
          },
        ],
      );
    } catch (error) {
      console.error(
        'Error posting ride:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Unable to post ride. Please try again.',
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
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Review Ride</Text>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Review your ride</Text>

        <Text style={styles.subtitle}>
          Check all details before posting your ride
        </Text>

        {/* Route */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Route</Text>

            <TouchableOpacity onPress={() => handleEdit('RouteSelection')}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.iconColumn}>
              <View style={styles.pickupDot} />
              <View style={styles.verticalLine} />
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>PICKUP</Text>
              <Text style={styles.locationText}>{pickup}</Text>
            </View>
          </View>

          {/* Intermediate stops */}
          {stops.map((stop, index) => (
            <View key={`${getAddress(stop)}-${index}`} style={styles.stopRow}>
              <View style={styles.iconColumn}>
                <View style={styles.stopDot} />
                <View style={styles.verticalLine} />
              </View>

              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>
                  STOP {index + 1}
                </Text>

                <Text style={styles.locationText}>
                  {getAddress(stop)}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.locationRow}>
            <View style={styles.iconColumn}>
              <View style={styles.dropDot} />
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>DROP</Text>
              <Text style={styles.locationText}>{drop}</Text>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Schedule</Text>

            <TouchableOpacity onPress={() => handleEdit('SelectDate')}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="calendar-outline" size={23} color="#1976D2" />
            </View>

            <View>
              <Text style={styles.infoLabel}>DATE</Text>
              <Text style={styles.infoValue}>
                {rideData.date || 'Date not selected'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="time-outline" size={23} color="#1976D2" />
            </View>

            <View>
              <Text style={styles.infoLabel}>DEPARTURE TIME</Text>
              <Text style={styles.infoValue}>
                {rideData.time || 'Time not selected'}
              </Text>
            </View>
          </View>
        </View>

        {/* Distance and duration */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip Information</Text>

          <View style={styles.tripInfoRow}>
            <Icon name="navigate-outline" size={23} color="#1976D2" />

            <View style={styles.tripInfoText}>
              <Text style={styles.infoLabel}>TOTAL DISTANCE</Text>
              <Text style={styles.infoValue}>
                {rideData.distance_km != null
                  ? `${Number(rideData.distance_km).toFixed(2)} km`
                  : 'Not available'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.tripInfoRow}>
            <Icon name="hourglass-outline" size={23} color="#1976D2" />

            <View style={styles.tripInfoText}>
              <Text style={styles.infoLabel}>ESTIMATED DURATION</Text>
              <Text style={styles.infoValue}>
                {rideData.duration_seconds != null
                  ? `${Math.floor(rideData.duration_seconds / 3600)} hr ${
                      Math.floor(
                        (rideData.duration_seconds % 3600) / 60,
                      )
                    } min`
                  : rideData.duration || 'Not available'}
              </Text>
            </View>
          </View>
        </View>

        {/* Car information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Vehicle Details</Text>

            <Icon name="car-sport-outline" size={25} color="#1976D2" />
          </View>

          <Text style={styles.carName}>
            {`${car.make || ''} ${car.model || ''} ${
              car.variant || ''
            }`.trim() || 'Car not selected'}
          </Text>

          <View style={styles.carInfoRow}>
            <Text style={styles.carInfoLabel}>Registration</Text>
            <Text style={styles.carInfoValue}>
              {car.registration_number || 'N/A'}
            </Text>
          </View>

          <View style={styles.carInfoRow}>
            <Text style={styles.carInfoLabel}>Color</Text>
            <Text style={styles.carInfoValue}>
              {car.color || 'N/A'}
            </Text>
          </View>

          <View style={styles.carInfoRow}>
            <Text style={styles.carInfoLabel}>Year</Text>
            <Text style={styles.carInfoValue}>
              {car.year || 'N/A'}
            </Text>
          </View>

          <View style={styles.carInfoRow}>
            <Text style={styles.carInfoLabel}>Fuel</Text>
            <Text style={styles.carInfoValue}>
              {car.fuel_type || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Passengers and price */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Ride Details</Text>

            <TouchableOpacity onPress={() => handleEdit('Passenger')}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <View style={styles.detailIcon}>
                <Icon name="people-outline" size={25} color="#1976D2" />
              </View>

              <Text style={styles.detailLabel}>PASSENGERS</Text>
              <Text style={styles.detailValue}>{passengers}</Text>

              <Text style={styles.detailSmall}>
                {passengers === 1 ? 'Seat' : 'Seats'}
              </Text>
            </View>

            <View style={styles.detailBox}>
              <View style={styles.detailIcon}>
                <Icon name="cash-outline" size={25} color="#1976D2" />
              </View>

              <Text style={styles.detailLabel}>PRICE / SEAT</Text>
              <Text style={styles.detailValue}>₹{pricePerSeat}</Text>

              <Text style={styles.detailSmall}>Per passenger</Text>
            </View>
          </View>
        </View>

        {/* Earnings */}
        {passengers > 0 && pricePerSeat > 0 && (
          <View style={styles.earningCard}>
            <View>
              <Text style={styles.earningLabel}>
                Potential earnings
              </Text>

              <Text style={styles.earningSubtext}>
                {passengers} seats × ₹{pricePerSeat}
              </Text>
            </View>

            <Text style={styles.earningAmount}>
              ₹{passengers * pricePerSeat}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Post ride button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.postButton,
            loading && { opacity: 0.7 },
          ]}
          onPress={handlePostRide}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon
                name="checkmark-circle-outline"
                size={22}
                color="#fff"
              />

              <Text style={styles.postButtonText}>Post Ride</Text>
            </>
          )}
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
  stopRow: {
  flexDirection: 'row',
  minHeight: 55,
},

stopDot: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#F59E0B',
  marginTop: 5,
},

tripInfoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 16,
},

tripInfoText: {
  marginLeft: 14,
},

carName: {
  fontSize: 20,
  fontWeight: '700',
  color: '#222',
  marginBottom: 12,
  textTransform: 'capitalize',
},

carInfoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 10,
  borderTopWidth: 1,
  borderTopColor: '#eee',
},

carInfoLabel: {
  fontSize: 14,
  color: '#777',
},

carInfoValue: {
  fontSize: 14,
  fontWeight: '600',
  color: '#222',
  textTransform: 'capitalize',
},
});