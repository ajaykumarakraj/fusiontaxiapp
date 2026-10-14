
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Alert, Linking } from 'react-native';
import axios from 'axios';
const CustomerDetailsScreen = ({ navigation, route }) => {
  const customer = route?.params?.customer || {};
  const ride = route?.params?.ride || {};

  const name =
    customer.name ||
    customer.fullname ||
    'Customer';

  const pickup =
    ride.from_address ||
    ride.from ||
    ride.source?.address ||
    ride.pickup_location ||
    'Not available';

  const destination =
    ride.to_address ||
    ride.to ||
    ride.destination?.address ||
    ride.drop_location ||
    'Not available';

  const date =
    ride.departure_date ||
    ride.date ||
    ride.ride_date ||
    'Not available';

  const time =
    ride.departure_time ||
    ride.time ||
    ride.ride_time ||
    'Not available';

  const price = Number(
    ride.price_per_seat ??
    ride.pricePerSeat ??
    ride.price ??
    customer.price_per_seat ??
    0
  );

  const seats = Number(
    customer.seats ??
    customer.booked_seats ??
    customer.seats_booked ??
    1
  );

  const total = Number(
    customer.total_amount ??
    customer.total_price ??
    price * seats
  );

  const formatDate = value => {
    if (!value || value === 'Not available') return value;

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

const phone =
  customer.phone ||
  customer.mobile ||
  customer.phone_number ||
  '';

const handleCall = async () => {
  if (!phone) {
    Alert.alert('Error', 'Customer phone number not available');
    return;
  }

  const phoneUrl = `tel:${phone}`;

  try {
    const supported = await Linking.canOpenURL(phoneUrl);

    if (supported) {
      await Linking.openURL(phoneUrl);
    } else {
      Alert.alert('Error', 'Calling is not supported on this device');
    }
  } catch (error) {
    Alert.alert('Error', 'Unable to open dialer');
  }
};

const handleMessage = async () => {
  if (!phone) {
    Alert.alert('Error', 'Customer phone number not available');
    return;
  }

  try {
    await Linking.openURL(`sms:${phone}`);
  } catch (error) {
    Alert.alert('Error', 'Unable to open messaging app');
  }
};

const handleAcceptRide = () => {
  Alert.alert(
    'Accept Ride',
    'Are you sure you want to accept this ride?',
    [
      { text: 'No', style: 'cancel' },
      {
        text: 'Accept',
        onPress: async () => {
          try {
            // Replace with your actual API endpoint
            // await axios.post(`${API_BASE_URL}/booking/accept`,
            //   { booking_id: customer.booking_id }
            // );

            Alert.alert('Success', 'Connect your accept API here');
          } catch (error) {
            Alert.alert('Error', 'Unable to accept ride');
          }
        },
      },
    ],
  );
};

const handleCancelRide = () => {
  Alert.alert(
    'Cancel Ride',
    'Are you sure you want to cancel this ride?',
    [
      { text: 'No', style: 'cancel' },
      {
        text: 'Cancel Ride',
        style: 'destructive',
        onPress: async () => {
          try {
            // Call your actual cancellation API here.

            Alert.alert('Info', 'Connect your cancel API here');
          } catch (error) {
            Alert.alert('Error', 'Unable to cancel ride');
          }
        },
      },
    ],
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#F4F7FB"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Customer Details</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Customer Profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.customerName}>{name}</Text>

          <Text style={styles.customerSubtitle}>
            Ride Booking Customer
          </Text>

          <View style={styles.bookingBadge}>
            <Text style={styles.bookingBadgeText}>
              Booking #{customer.bookingId || customer.booking_id || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Journey Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Journey Details
          </Text>

          <View style={styles.locationRow}>
            <View style={styles.locationIndicator}>
              <View style={styles.pickupDot} />
              <View style={styles.verticalLine} />
              <View style={styles.dropDot} />
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.label}>PICKUP LOCATION</Text>
              <Text style={styles.locationText}>{pickup}</Text>

              <View style={styles.locationGap} />

              <Text style={styles.label}>DESTINATION</Text>
              <Text style={styles.locationText}>{destination}</Text>
            </View>
          </View>

          {/* <View style={styles.divider} /> */}

         
        </View>

        {/* Booking Information */}
        {/* <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Customer Information
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>
              {customer.phone ||
                customer.mobile ||
                customer.phone_number ||
                'Not available'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <Text style={styles.detailValue}>
              {customer.email || 'Not available'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booked Seats</Text>
            <Text style={styles.detailValue}>{seats}</Text>
          </View>
        </View> */}


<View style={styles.actionsCard}>
  <Text style={styles.sectionTitle}>Ride Actions</Text>

  <View style={styles.contactRow}>
    <TouchableOpacity
      style={[styles.actionButton, styles.callButton]}
      onPress={handleCall}
    >
      <Text style={styles.actionText}>📞 Call Customer</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.actionButton, styles.messageButton]}
      onPress={handleMessage}
    >
      <Text style={styles.actionText}>✉ Message</Text>
    </TouchableOpacity>
  </View>

  <TouchableOpacity
    style={styles.acceptButton}
    onPress={handleAcceptRide}
  >
    <Text style={styles.actionText}>✓ Accept Ride</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.cancelButton}
    onPress={handleCancelRide}
  >
    <Text style={styles.cancelText}>Cancel Ride</Text>
  </TouchableOpacity>
</View>



        {/* Payment */}
        {/* <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>
            Payment Summary
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price per seat</Text>
            <Text style={styles.detailValue}>
              ₹{price.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Number of seats</Text>
            <Text style={styles.detailValue}>{seats}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              ₹{total.toLocaleString('en-IN')}
            </Text>
          </View>
        </View> */}

        <Text style={styles.footerText}>
          Ride details and customer information
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  backText: {
    fontSize: 32,
    color: '#16834A',
    lineHeight: 36,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#182230',
    marginLeft: 14,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 16,
    elevation: 2,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E1F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#B8E7C8',
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#16834A',
  },

  customerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#182230',
    marginTop: 12,
  },

  customerSubtitle: {
    color: '#7B8491',
    fontSize: 13,
    marginTop: 5,
  },

  bookingBadge: {
    backgroundColor: '#E8F6ED',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 12,
  },

  bookingBadgeText: {
    color: '#16834A',
    fontWeight: '700',
    fontSize: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#182230',
    marginBottom: 20,
  },

  locationRow: {
    flexDirection: 'row',
  },

  locationIndicator: {
    width: 18,
    alignItems: 'center',
    paddingTop: 4,
    marginRight: 12,
  },

  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16834A',
  },

  verticalLine: {
    height: 46,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C5CDD6',
  },

  dropDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#E45757',
  },

  locationContent: {
    flex: 1,
  },

  label: {
    fontSize: 10,
    color: '#8993A1',
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 6,
  },

  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#253044',
    lineHeight: 21,
  },

  locationGap: {
    height: 22,
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF0F4',
    marginVertical: 16,
  },

  scheduleRow: {
    flexDirection: 'row',
    gap: 12,
  },

  scheduleBox: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 12,
  },

  scheduleValue: {
    color: '#253044',
    fontSize: 13,
    fontWeight: '700',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 17,
    gap: 12,
  },

  detailLabel: {
    color: '#7B8491',
    fontSize: 13,
    flex: 1,
  },

  detailValue: {
    color: '#253044',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },

  paymentCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDEFE3',
    elevation: 2,
  },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 15,
    color: '#253044',
    fontWeight: '800',
  },

  totalAmount: {
    fontSize: 25,
    fontWeight: '900',
    color: '#16834A',
  },

  footerText: {
    fontSize: 11,
    color: '#929BA8',
    textAlign: 'center',
    marginTop: 6,
  },
  actionsCard: {
  backgroundColor: '#FFFFFF',
  padding: 18,
  borderRadius: 18,
  marginBottom: 16,
  elevation: 2,
},

contactRow: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 12,
},

actionButton: {
  flex: 1,
  paddingVertical: 13,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},

callButton: {
  backgroundColor: '#16834A',
},

messageButton: {
  backgroundColor: '#2878D0',
},

actionText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: '700',
},

acceptButton: {
  backgroundColor: '#16834A',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 10,
},

cancelButton: {
  borderWidth: 1,
  borderColor: '#DC4545',
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
},

cancelText: {
  color: '#DC4545',
  fontWeight: '700',
  fontSize: 14,
},
});
