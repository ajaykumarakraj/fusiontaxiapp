
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const New = ({ navigation, route }) => {
  const booking = route?.params?.ride || {};

  // Supports both nested and flat ride objects
  const ride = booking.ride || booking;

  const from = ride.from_address || 'Ghaziabad';
  const to = ride.to_address || 'Delhi';
  const date = ride.departure_date || '2026-10-25';
  const time = ride.departure_time || '09:30 AM';
  const vehicle =
    ride.vehicle?.make || ride.vehicle_name || 'Swift Dzire';

  const seats = booking.seats_requested ?? 2;
  const amount = booking.total_amount ?? 1200;
  const status = booking.status || 'Confirmed';
  const bookingId = booking.id || 'BK101';

  const statusColor =
    status.toLowerCase() === 'cancelled' ? '#DC2626' : '#16A34A';

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#2563EB" />
      </View>

      <View style={styles.detailText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{String(value)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Ride Details</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Booking Status */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.bookingLabel}>Booking ID</Text>
            <Text style={styles.bookingId}>#{bookingId}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}18` },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {status}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Journey Details</Text>

          <View style={styles.routeContainer}>
            <View style={styles.routeIcons}>
              <View style={styles.pickupDot} />
              <View style={styles.routeLine} />
              <View style={styles.dropDot} />
            </View>

            <View style={styles.routeAddresses}>
              <View style={styles.addressBlock}>
                <Text style={styles.label}>PICKUP LOCATION</Text>
                <Text style={styles.address}>{from}</Text>
              </View>

              <View style={styles.destinationBlock}>
                <Text style={styles.label}>DROP LOCATION</Text>
                <Text style={styles.address}>{to}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Travel Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Travel Information</Text>

          <DetailRow
            icon="calendar-outline"
            label="Departure Date"
            value={date}
          />

          <DetailRow
            icon="time-outline"
            label="Departure Time"
            value={time}
          />

          <DetailRow
            icon="car-outline"
            label="Vehicle"
            value={vehicle}
          />

          <DetailRow
            icon="people-outline"
            label="Seats Booked"
            value={`${seats} seat(s)`}
          />
        </View>

        {/* Fare */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{amount}</Text>
          </View>

          <View style={styles.paymentStatus}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#64748B"
            />
            <Text style={styles.paymentNote}>
              Payment status is not available in this static screen.
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backToRidesButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToRidesText}>Back to My Rides</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default New;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  routeContainer: {
    flexDirection: 'row',
  },
  routeIcons: {
    width: 22,
    alignItems: 'center',
    paddingTop: 5,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  routeLine: {
    height: 48,
    width: 2,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  dropDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  routeAddresses: {
    flex: 1,
    marginLeft: 12,
  },
  addressBlock: {
    minHeight: 65,
  },
  destinationBlock: {
    paddingTop: 3,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  address: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailText: {
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  fareLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#16A34A',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 14,
  },
  paymentNote: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    marginLeft: 7,
    lineHeight: 18,
  },
  backToRidesButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 2,
  },
  backToRidesText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
