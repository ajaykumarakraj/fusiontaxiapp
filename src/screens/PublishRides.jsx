
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://api.squarebigha.com/oldApi/api/v1/rides';

const PublishRides = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [ridesData, setRidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Screen focus hone par rides refresh hongi

 const navigation = useNavigation();
  const getRides = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const credentials = await Keychain.getGenericPassword();

      if (!credentials || !credentials.password) {
        setError('Authentication token nahi mila. Please login again.');
        setRidesData([]);
        return;
      }

      const response = await axios.get(API_URL, {
        params: {
          category: 'all',
        },
        headers: {
          Authorization: `Bearer ${credentials.password}`,
          Accept: 'application/json',
        },
      });

      const rides = response.data?.data;

      setRidesData(Array.isArray(rides) ? rides : []);

      console.log('Rides response:', rides);
    } catch (err) {
      console.log(
        'Get rides error:',
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          'Rides load nahi ho sakin. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getRides();
    }, [])
  );
  

  const handleCancel = (item) => {
  Alert.alert(
    'Cancel Ride',
    `Kya aap ride #${item.id} cancel karna chahte hain?`,
    [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            const credentials = await Keychain.getGenericPassword();

            if (!credentials || !credentials.password) {
              Alert.alert(
                'Authentication Error',
                'Please login again.'
              );
              return;
            }

            const response = await axios.post(
              `https://api.squarebigha.com/oldApi/api/v1/rides/${item.uuid}/cancel`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${credentials.password}`,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log('Cancel response:', response.data);

            Alert.alert(
              'Success',
              response.data?.message || 'Ride cancelled successfully.'
            );

            await getRides();
          } catch (error) {
            console.log(
              'Cancel API error:',
              error.response?.status,
              error.response?.data || error.message
            );

            Alert.alert(
              'Error',
              error.response?.data?.message ||
                'Ride cancel nahi ho payi. Please try again.'
            );
          }
        },
      },
    ]
  );
};

  const formatDate = dateValue => {
    if (!dateValue) {
      return 'Date unavailable';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  const formatTime = timeValue => {
    if (!timeValue) {
      return 'Time not set';
    }

    return String(timeValue);
  };

  const getRideDate = item =>
    item.departure_date || item.date || null;

  const isUpcomingRide = item => {
    const dateValue = getRideDate(item);

    if (!dateValue) {
      return true;
    }

    const rideDate = new Date(dateValue);

    if (Number.isNaN(rideDate.getTime())) {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    rideDate.setHours(0, 0, 0, 0);

    return rideDate >= today;
  };

  const filteredRides = ridesData.filter(item => {
    if (activeTab === 'upcoming') {
      return isUpcomingRide(item);
    }

    return !isUpcomingRide(item);
  });

  const renderRide = ({ item }) => {
    const from =
      item.from_address || item.from || 'Unknown location';

    const to =
      item.to_address || item.to || 'Unknown location';

    const departureDate = getRideDate(item);

    const date = formatDate(departureDate);

    const time = formatTime(
      item.departure_time || item.time
    );

    const seats =
      item.available_seats ??
      item.available_passenger_seats ??
      item.seats ??
      0;

    const price =
      item.price_per_seat ??
      item.pricePerSeat ??
      item.price ??
      0;

    const status = item.status || 'unknown';
console.log("item")
    return (
      <TouchableOpacity
  style={styles.card}
  activeOpacity={0.8}
  onPress={() => {
    navigation.navigate('myridelistdetails', {
      ride: item,
    });
  }}
>
      <View >
        {/* Route */}
      

        <View style={styles.route}
        
        >
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.city} numberOfLines={2}>
              {from}
            </Text>
          </View>

          <Ionicons
            name="arrow-forward-outline"
            size={18}
            color="#777"
            style={styles.routeIcon}
          />

          <View style={styles.locationContainer}>
            <View style={[styles.locationDot, styles.destinationDot]} />
            <Text style={styles.city} numberOfLines={2}>
              {to}
            </Text>
          </View>
        </View>

        {/* Ride information */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#666"
            />
            <Text style={styles.infoText}>{date}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color="#666"
            />
            <Text style={styles.infoText}>{time}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="people-outline"
              size={16}
              color="#666"
            />
            <Text style={styles.infoText}>
              {seats} available seats
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="car-outline"
              size={16}
              color="#666"
            />
            <Text style={styles.infoText}>
              {item.vehicle?.make || 'Vehicle'}{' '}
              {item.vehicle?.model || ''}
            </Text>
          </View>
        </View>

        {/* Price and status */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>
              ₹{Number(price).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.priceLabel}>per seat</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              status.toLowerCase() === 'draft' &&
                styles.draftBadge,
              status.toLowerCase() === 'published' &&
                styles.publishedBadge,
              status.toLowerCase() === 'cancelled' &&
                styles.cancelledBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          {/* <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={17}
              color="#222"
            />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity> */}

          {/* {status.toLowerCase() === 'draft' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.publishButton]}
              onPress={() => handlePublish(item)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={17}
                color="#fff"
              />
              <Text style={styles.publishButtonText}>
                Publish
              </Text>
            </TouchableOpacity>
          )} */}

          {status.toLowerCase() !== 'cancelled' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancel(item)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close-circle-outline"
                size={17}
                color="#d11"
              />
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
</TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
   <View style={styles.managebox}>
  <View style={styles.manageInfo}>
    <Text style={styles.header}>Your Rides</Text>
    <Text style={styles.subtitle}>
      Manage your posted rides
    </Text>
  </View>

  <TouchableOpacity
    style={styles.publishButton}
    onPress={() => navigation.navigate('NewPublishScreen')}
    activeOpacity={0.8}
  >
    <Text style={styles.publishButtonText}>+ New Publish</Text>
  </TouchableOpacity>
</View>
      {/* Upcoming and Past tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={styles.loadingText}>
            Loading your rides...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color="#d11"
          />

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => getRides()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRides}
          keyExtractor={item => String(item.id)}
          renderItem={renderRide}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getRides(true)}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="car-outline"
                size={48}
                color="#aaa"
              />

              <Text style={styles.emptyTitle}>
                No {activeTab} rides found
              </Text>

              <Text style={styles.emptyText}>
                Your {activeTab} rides will appear here.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default PublishRides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  header: {
    paddingTop: 20,
    fontSize: 25,
    fontWeight: '700',
    color: '#111',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    marginBottom: 18,
    padding: 3,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },

  activeTab: {
    backgroundColor: '#111',
  },

  tabText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },

  activeTabText: {
    color: '#fff',
  },

  listContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  locationDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#111',
    marginTop: 5,
    marginRight: 7,
  },

  destinationDot: {
    backgroundColor: '#16834a',
  },

  city: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    lineHeight: 20,
  },

  routeIcon: {
    marginHorizontal: 8,
    marginTop: 2,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },

  infoText: {
    fontSize: 12,
    color: '#555',
    flexShrink: 1,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 14,
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  priceLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  draftBadge: {
    backgroundColor: '#fff0d5',
  },

  publishedBadge: {
    backgroundColor: '#dff5e6',
  },

  cancelledBadge: {
    backgroundColor: '#ffe4e4',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  actionButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 4,
  },

  editButton: {
    backgroundColor: '#f1f1f1',
  },

  editButtonText: {
    color: '#222',
    fontSize: 12,
    fontWeight: '600',
  },

  publishButton: {
    backgroundColor: '#111',
  },

  publishButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  cancelButton: {
    backgroundColor: '#fff1f1',
    borderWidth: 1,
    borderColor: '#f2caca',
  },

  cancelButtonText: {
    color: '#d11',
    fontSize: 12,
    fontWeight: '600',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },

  errorText: {
    marginTop: 12,
    color: '#b00020',
    textAlign: 'center',
    fontSize: 14,
  },

  retryButton: {
    marginTop: 16,
    backgroundColor: '#111',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 65,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    marginTop: 14,
    color: '#333',
    fontSize: 17,
    fontWeight: '700',
  },

  emptyText: {
    marginTop: 7,
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
  },
  publishButton: {
  backgroundColor: '#2563EB',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignSelf: 'flex-start',
  marginTop: 10,
},

publishButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '600',
},
managebox: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 18,
  paddingVertical: 20,
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  marginHorizontal: 15,
  marginTop: 15,
  marginBottom: 12,
  elevation: 2,
},

manageInfo: {
  flex: 1,
  marginRight: 10,
},

header: {
  fontSize: 22,
  fontWeight: '700',
  color: '#172033',
  marginBottom: 5,
},

subtitle: {
  fontSize: 13,
  color: '#7B8494',
},

publishButton: {
  backgroundColor: '#2563EB',
  paddingVertical: 11,
  paddingHorizontal: 14,
  borderRadius: 9,
  alignItems: 'center',
  justifyContent: 'center',
},

publishButtonText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: '700',
},
});
