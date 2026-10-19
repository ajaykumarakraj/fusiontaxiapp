
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_BASE = 'https://api.squarebigha.com/oldApi/api/v1';

const RideDetails = ({ route }) => {
  const navigation = useNavigation();
  const { ride, from, to } = route.params;
const [showStops, setShowStops] = useState(false);
const [showPreferences, setShowPreferences] = useState(false);
  const [rideDetail, setRideDetail] = useState(null);
  const [loading, setLoading] = useState(true);


const formatDuration = (seconds) => {
  if (seconds == null || isNaN(seconds)) {
    return 'N/A';
  }

  const totalSeconds = Number(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};


const booking=async()=>{

try {
  console.log("run tha code")
  const credentials = await Keychain.getGenericPassword();
  
      if (!credentials) {
        Alert.alert('Session Expired', 'Please login again.');
        return;
      }
  
      const token = credentials.password;
   const   payload={

    seats_requested: 2,
    pickup_stop_id: 3,
    dropoff_stop_id: 4,
    passenger_note: "I have one small bag."

      }
  const res=await axios.post(`https://api.squarebigha.com/oldApi/api/v1/rides/${ride.uuid}/book`,payload,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  console.log("response",res.data)
} catch (error) {
  console.log(error)
}
}

  
  const getDetail = async () => {
    try {
      setLoading(true);

      const credentials = await Keychain.getGenericPassword();

      if (!credentials) {
        Alert.alert('Session Expired', 'Please login again.');
        return;
      }

      const res = await axios.get(
        `${API_BASE}/rides/${ride.uuid}`,
        {
          headers: {
            Authorization: `Bearer ${credentials.password}`,
            Accept: 'application/json',
          },
        },
      );

      if (res.data?.success && res.data?.data) {
        setRideDetail(res.data.data);
      } else if (res.data?.data) {
        setRideDetail(res.data.data);
      } else {
        Alert.alert('Error', 'Ride details not found.');
      }
    } catch (error) {
      console.log(
        'Ride Details API Error:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Unable to fetch ride details.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
  }, [ride?.uuid]);
  const formatDate = value => {
    if (!value) return 'Not specified';

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Not specified';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color="#f40b0f" />
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{String(value ?? 'Not specified')}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f40b0f" />
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </View>
    );
  }

  if (!rideDetail) {
    return (
      <View style={styles.center}>
        <Text>Ride details not available.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
console.log("rideDetail",rideDetail)
  const driver = rideDetail.driver || {};
  const vehicle = rideDetail.vehicle || {};
  const stops = [...(rideDetail.stops || [])].sort(
    (a, b) => a.stop_order - b.stop_order,
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={25} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Details</Text>
        <View style={{ width: 25 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Driver */}
        <View style={styles.card}>
          <View style={styles.driverRow}>
            {driver.profile_photo ? (
              <Image
                source={{ uri: driver.profile_photo }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={35} color="#777" />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {driver.name || 'Driver'}
              </Text>
              <Text style={styles.subText}>
                {[vehicle.make, vehicle.model, vehicle.variant]
                  .filter(Boolean)
                  .join(' ') || 'Vehicle details'}
              </Text>
              <Text style={styles.status}>
                {rideDetail.status || 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

        {/* Journey */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Journey Details</Text>
            <InfoRow
            icon="radio-button-on"
            label="Pickup"
            value={rideDetail.from_address || from}
          />

          <InfoRow
            icon="location-outline"
            label="Destination"
            value={rideDetail.to_address || to}
          />
           </View>

             <View style={styles.card}>
<View style={styles.journeydate}>
  <View style={styles.journeyItem}>
    <InfoRow
      icon="calendar-outline"
      label="Departure Date"
      value={formatDate(rideDetail.departure_date)}
    />
  </View>

  <View style={styles.journeyItem}>
    <InfoRow
      icon="time-outline"
      label="Departure Time"
      value={rideDetail.departure_time || 'Not specified'}
    />
  </View>
</View>
        
</View>
       

      
       

        {/* Stops */}
        {stops.length > 0 && (
  <View style={styles.card}>
    <TouchableOpacity
      style={styles.stopsHeader}
      onPress={() => setShowStops(!showStops)}
      activeOpacity={0.7}
    >
      <Text style={styles.sectionTitle}>
        Route Stops ({stops.length})
      </Text>

      <Icon
        name={showStops ? 'chevron-up-outline' : 'chevron-down-outline'}
        size={22}
        color="#333"
      />
    </TouchableOpacity>

    {showStops &&
      stops.map((stop, index) => (
        <View style={styles.stopRow} key={stop.id ?? index}>
          <Icon
            name="location-outline"
            size={20}
            color="#f40b0f"
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.value}>
              Stop {index + 1}
            </Text>

            <Text style={styles.stopAddress}>
              {stop.address || 'Address not available'}
            </Text>
          </View>
        </View>
      ))}
  </View>
)}

        {/* Vehicle */}
        <View style={styles.card}>
  <Text style={styles.sectionTitle}>Vehicle Details</Text>

  <View style={styles.vehicleGrid}>
    <View style={styles.vehicleItem}>
      <InfoRow
        icon="car-outline"
        label="Vehicle"
        value={[vehicle.make, vehicle.model, vehicle.variant]
          .filter(Boolean)
          .join(' ') || 'Not specified'}
      />
    </View>

    <View style={styles.vehicleItem}>
      <InfoRow
        icon="color-palette-outline"
        label="Color"
        value={vehicle.color || 'Not specified'}
      />
    </View>

    {/* <View style={styles.vehicleItem}>
      <InfoRow
        icon="calendar-outline"
        label="Year"
        value={vehicle.year || 'Not specified'}
      />
    </View> */}

    <View style={styles.vehicleItem}>
      <InfoRow
        icon="people-outline"
        label="Seats"
        value={vehicle.total_seats || 'N/A'}
      />
    </View>

    <View style={styles.vehicleItem}>
      <InfoRow
        icon="document-text-outline"
        label="Registration"
        value={vehicle.registration_number || 'Not specified'}
      />
    </View>
  </View>
</View>
        {/* Fare */}
      <View style={styles.card}>
  <Text style={styles.sectionTitle}>Fare Details</Text>

  <Text style={styles.price}>
    ₹{Number(rideDetail.price_per_seat || 0).toLocaleString('en-IN')}
    <Text style={styles.perSeat}> / seat</Text>
  </Text>

  <View style={styles.fareGrid}>
    <View style={styles.fareItem}>
          {rideDetail.total_distance_km != null && (
            <InfoRow
              icon="navigate-outline"
              label="Distance"
              value={`${rideDetail.total_distance_km} km`}
            />
          )}
          <InfoRow
          icon="time-outline"
           label="Estimated Duration"
         value={formatDuration(rideDetail.estimated_duration_second)}
        />
      <InfoRow
        icon="people-outline"
        label="Available Seats"
        value={rideDetail.available_seats ?? 'N/A'}
      />
      <InfoRow
        icon="card-outline"
        label="Booking Type"
        value={rideDetail.booking_type || 'N/A'}
      />
    </View>


  
  </View>
</View>

        {/* Preferences */}
       
<View style={styles.card}>
  <TouchableOpacity
    style={styles.preferencesHeader}
    onPress={() => setShowPreferences(!showPreferences)}
    activeOpacity={0.7}
  >
    <Text style={styles.sectionTitle}>
      Ride Preferences
    </Text>

    <Icon
      name={showPreferences ? 'chevron-up-outline' : 'chevron-down-outline'}
      size={22}
      color="#333"
    />
  </TouchableOpacity>

  {showPreferences && (
    <>
      {[
        ['Smoking allowed', rideDetail.smoking_allowed],
        ['Pets allowed', rideDetail.pets_allowed],
        ['Music allowed', rideDetail.music_allowed],
        ['Women only', rideDetail.women_only],
        ['Door-to-door', rideDetail.door_to_door],
      ].map(([label, value]) => (
        <View style={styles.preferenceRow} key={label}>
          <Text style={styles.preferenceLabel}>{label}</Text>

          <Text style={styles.value}>
            {value === true || value === 1 ? 'Yes' : 'No'}
          </Text>
        </View>
      ))}

      {rideDetail.notes ? (
        <Text style={styles.notes}>
          Note: {rideDetail.notes}
        </Text>
      ) : null}
    </>
  )}
</View>


        {/* Driver info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driver Information</Text>

          <InfoRow
            icon="person-outline"
            label="Name"
            value={driver.name}
          />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={driver.email}
          />
        </View>

        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.8}
         onPress={() => {
  Alert.alert(
    'Book Ride',
    'Do you want to book this ride?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => booking(),
      },
    ],
  );
}}>
          <Text style={styles.bookText}>Book Ride</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RideDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  backText: {
    color: '#f40b0f',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  status: {
    color: '#16a34a',
    marginTop: 6,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    flexShrink: 1,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 10,
  },
  stopAddress: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },
  price: {
    fontSize: 27,
    fontWeight: '800',
    color: '#f40b0f',
    marginBottom: 10,
  },
  perSeat: {
    fontSize: 14,
    color: '#777',
    fontWeight: '400',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceLabel: {
    color: '#444',
    fontSize: 14,
  },
  notes: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 21,
    color: '#555',
  },
  bookBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f40b0f',
    padding: 16,
    borderRadius: 12,
    marginBottom: 25,
  },
  bookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
 journeydate: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
},

journeyItem: {
  flex: 1,
  minWidth: 0,
},
stopsHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

sectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222',
},
vehicleGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -5,
},

vehicleItem: {
  width: '50%',
  paddingHorizontal: 5,
},
fareGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -4,
},

fareItem: {
  width: '50%',
  paddingHorizontal: 4,
},



sectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 6,
},

price: {
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 6,
},

preferencesHeader:{
  display:"flex",
  flexDirection:"row",
  justifyContent:"space-between"
}
});
