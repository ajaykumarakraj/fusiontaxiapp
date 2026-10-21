
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
const API_URL =
  'https://api.squarebigha.com/oldApi/api/v1/rides/search';

const RideList = ({ route }) => {
  const navigation = useNavigation();

  const {
    from,
    to,
    date,
    persons = 1,
    pickupLocation,
    dropoffLocation,
  } = route.params || {};

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fromLat = Number(pickupLocation?.latitude);
  const fromLng = Number(pickupLocation?.longitude);
  const toLat = Number(dropoffLocation?.latitude);
  const toLng = Number(dropoffLocation?.longitude);

  const fetchRides = useCallback(async (isRefresh = false) => {
    if (
      !Number.isFinite(fromLat) ||
      !Number.isFinite(fromLng) ||
      !Number.isFinite(toLat) ||
      !Number.isFinite(toLng) ||
      !pickupLocation ||
      !dropoffLocation
    ) {
      setRides([]);
      setError('Please select pickup and destination from the location suggestions.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');
 const credentials = await Keychain.getGenericPassword();
// console.log('Retrieved credentials:', credentials.password)
      if (!credentials) {
        Alert.alert('Session Expired', 'Please login again.');
        return;
      }
      console.log('Fetching rides with params:', {
        fromLat,
        fromLng,
        toLat,
        toLng,
        date,
        persons
      });
      const response = await axios.get(API_URL, {
        params: {
          from_lat: fromLat,
          from_lng: fromLng,
          to_lat: toLat,
          to_lng: toLng,
          date: date,
          seats: Number(persons) || 1,
        },
        headers: {
             Authorization: `Bearer ${credentials.password}`,
          Accept: 'application/json',
        },
      });

      console.log('Ride search response:', response.data);

      const result = response.data?.data;

      // Handle common API response formats.
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.rides)
        ? result.rides
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(response.data?.rides)
        ? response.data.rides
        : [];

      setRides(list);
    } catch (err) {
      console.log(
        'Ride Search Error:',
        err.response?.status,
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          'Unable to load rides. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [
    fromLat,
    fromLng,
    toLat,
    toLng,
    date,
    persons,
    pickupLocation,
    dropoffLocation,
  ]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const getDriverName = (item) => {
    return (
      item.driver?.name ||
      item.user?.name ||
      item.driver_name ||
      item.user_name ||
      item.name ||
      'Ride Driver'
    );
  };

  // const getCarName = (item) => {
  //   const vehicle = item.vehicle || item.car || {};

  //   if (typeof vehicle === 'string') {
  //     return vehicle;
  //   }

  //   return [
  //     vehicle.make || vehicle.brand,
  //     vehicle.model,
  //     vehicle.variant,
  //   ]
  //     .filter(Boolean)
  //     .join(' ') ||
  //     item.car_name ||
  //     item.vehicle_name ||
  //     'Car details unavailable';
  // };

  const getPrice = (item) => {
    const value =
      item.price_per_seat ??
      item.pricePerSeat ??
      item.price ??
      item.fare ??
      item.amount;

    const numericValue = Number(value);

    return Number.isFinite(numericValue)
      ? `₹${numericValue.toLocaleString('en-IN')}`
      : 'Price unavailable';
  };

  const getDepartureTime = (item) => {
    const value =
      item.departure_time ||
      item.time ||
      item.departure_at;

    if (!value) {
      return 'Time not specified';
    }

    if (/^\d{2}:\d{2}/.test(String(value))) {
      const [hourString, minute] = String(value).split(':');
      const hour = Number(hourString);
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;

      return `${formattedHour}:${minute.slice(0, 2)} ${suffix}`;
    }

    return String(value);
  };

  const getSeats = (item) => {
    return (
      item.available_seats ??
      item.available_passenger_seats ??
      item.seats ??
      '—'
    );
  };

  const renderRide = ({ item, index }) => {
    const driverName = getDriverName(item);
    // const carName = getCarName(item);
    const price = getPrice(item);
    const time = getDepartureTime(item);
    const seats = getSeats(item);

    const avatarUri =
      item.driver?.profile_image ||
      item.driver?.avatar ||
      item.user?.profile_image ||
      item.user?.avatar ||
      item.driver_image ||
      item.image;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.rideCard}
        onPress={() =>
          navigation.navigate('RideDetails', {
            ride: item,
            from,
            to,
            date,
            persons,
            pickupLocation,
            dropoffLocation,
          })
        }
      >
        {/* Driver and price */}
        <View style={styles.cardTop}>
          <View style={styles.driverSection}>
            <View style={styles.avatar}>
              {avatarUri ? (
                <View style={styles.avatarFallback}>
                  <Icon name="person" size={27} color="#e34242" />
                </View>
              ) : (
                <Icon name="person" size={27} color="#e34242" />
              )}
            </View>

            <View style={styles.driverInfo}>
              <Text style={styles.driverName} numberOfLines={1}>
                {driverName}
              </Text>

              <View style={styles.verifiedRow}>
                <Icon
                  name="checkmark-circle"
                  size={14}
                  color="#16a36a"
                />
                <Text style={styles.verifiedText}>Ride available</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.perSeat}>per seat</Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeBox}>
          <View style={styles.routeTimeline}>
            <View style={styles.startDot} />
            <View style={styles.routeLine} />
            <View style={styles.endDot} />
          </View>

          <View style={styles.routeDetails}>
            <View style={styles.routePoint}>
              <Text style={styles.routeLabel}>PICKUP</Text>
              <Text style={styles.routeAddress} numberOfLines={2}>
                {item.from_address || item.from || from || 'Pickup location'}
              </Text>
            </View>

            <View style={styles.routePoint}>
              <Text style={styles.routeLabel}>DESTINATION</Text>
              <Text style={styles.routeAddress} numberOfLines={2}>
                {item.to_address || item.to || to || 'Destination'}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={18} color="#777" />
            <Text style={styles.detailText}>{item.departure_time}</Text>
          </View>
  <View style={styles.detailItem}>
      <Icon name="calendar-outline" size={18} color="#777" />
          <Text style={styles.detailText}>
  {item.departure_date
    ? new Date(item.departure_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''}
</Text>
          </View>
          {/* <View style={styles.detailItem}>
            <Icon name="car-outline" size={18} color="#777" />
            <Text style={styles.detailText} numberOfLines={1}>
              {carName}
            </Text>
          </View> */}
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardBottom}>
          <View style={styles.seatInfo}>
            <Icon name="people-outline" size={17} color="#555" />
            <Text style={styles.seatText}>
              {seats} seats available
            </Text>
          </View>

          <View style={styles.viewRide}>
            <Text style={styles.viewRideText}>View ride</Text>
            <Icon name="chevron-forward" size={17} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#ed3939" />
          <Text style={styles.stateTitle}>Finding your ride...</Text>
          <Text style={styles.stateSubtitle}>
            Searching available rides for your route
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <View style={styles.stateIcon}>
            <Icon name="cloud-offline-outline" size={34} color="#ed3939" />
          </View>
          <Text style={styles.stateTitle}>Couldn't load rides</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchRides()}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Icon name="car-sport-outline" size={36} color="#ed3939" />
        </View>
        <Text style={styles.stateTitle}>No rides found</Text>
        <Text style={styles.stateSubtitle}>
          Try another date or check back later for available rides.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchRides()}
        >
          <Text style={styles.retryText}>Search again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={23} color="#171717" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Available rides</Text>
          <Text style={styles.headerSubtitle}>
            Find your comfortable journey
          </Text>
        </View>
      </View>

      {/* Route summary */}
      <View style={styles.searchSummary}>
        <View style={styles.summaryRoute}>
          <View style={styles.summaryDot} />
          <Text style={styles.summaryCity} numberOfLines={1}>
            {from || 'Pickup'}
          </Text>

          <Icon
            name="arrow-forward"
            size={17}
            color="#999"
            style={styles.summaryArrow}
          />

          <View style={styles.summaryDestinationDot} />
          <Text style={styles.summaryCity} numberOfLines={1}>
            {to || 'Destination'}
          </Text>
        </View>

        <View style={styles.summaryMeta}>
          <View style={styles.metaItem}>
            <Icon name="calendar-outline" size={15} color="#ed3939" />
            <Text style={styles.metaText}>{date || 'Date not selected'}</Text>
          </View>

          <View style={styles.metaItem}>
            <Icon name="people-outline" size={16} color="#ed3939" />
            <Text style={styles.metaText}>
              {persons} {Number(persons) === 1 ? 'passenger' : 'passengers'}
            </Text>
          </View>
        </View>
      </View>

      {/* Results heading */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Your rides </Text>
        {!loading && !error && (
          <Text style={styles.resultsCount}>
            {rides.length} {rides.length === 1 ? 'ride' : 'rides'}
          </Text>
        )}
      </View>

      <FlatList
        data={rides}
        keyExtractor={(item, index) =>
          String(item.uuid || item.id || index)
        }
        renderItem={renderRide}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          rides.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchRides(true)}
            tintColor="#ed3939"
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

export default RideList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 45,
    paddingBottom: 17,
    paddingHorizontal: 18,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#171717',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  searchSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ededed',
  },
  summaryRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a36a',
    marginRight: 7,
  },
  summaryDestinationDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#ed3939',
    marginRight: 7,
  },
  summaryCity: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  summaryArrow: {
    marginHorizontal: 8,
  },
  summaryMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 18,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#555',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 23,
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
  },
  resultsCount: {
    color: '#777',
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eceef1',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: '#fff0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    overflow: 'hidden',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#777',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e73535',
  },
  perSeat: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
  routeBox: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 17,
  },
  routeTimeline: {
    alignItems: 'center',
    width: 18,
    marginRight: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  startDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#16a36a',
  },
  routeLine: {
    flex: 1,
    minHeight: 25,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c9cdd2',
  },
  endDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#ed3939',
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 17,
  },
  routePoint: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#999',
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 13,
    fontWeight: '600',
    color: '#292929',
    lineHeight: 19,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  detailText: {
    fontSize: 12,
    color: '#555',
    flexShrink: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 13,
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  seatText: {
    fontSize: 12,
    color: '#555',
  },
  viewRide: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ed3939',
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 4,
  },
  viewRideText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 50,
    flexGrow: 1,
  },
  stateIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginTop: 12,
  },
  stateSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#ed3939',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
