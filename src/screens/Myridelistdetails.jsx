
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

const Myridelistdetails = ({ navigation, route }) => {
  const booking = route?.params?.ride || {};

  const ride = booking.ride || {};
console.log("details data",ride)
  const pickup =
    booking.pickup_stop?.address ||
    ride.from_address ||
    'Pickup not available';

  const drop =
    booking.dropoff_stop?.address ||
    ride.to_address ||
    'Drop location not available';

  console.log('Booking:', booking);
  
  console.log('Ride datartgg:', ride);




  // Booking information
  const bookingReference =
    booking.booking_reference || `BK-${booking.id || 'N/A'}`;

  const seats = booking.seats_requested ?? 0;
  const amount = booking.total_amount ?? '0.00';
  const pricePerSeat = booking.price_per_seat ?? '0.00';
  const subtotal = booking.subtotal ?? amount;
  const serviceFee = booking.service_fee ?? '0.00';
  const discount = booking.discount_amount ?? '0.00';
  const status = booking.status || 'Pending';

  // Ride information
  const date = ride.departure_date || ride.date || 'Not available';
  const time = ride.departure_time || ride.time || 'Not available';

  const vehicle =
    ride.vehicle?.make ||
    ride.vehicle?.model ||
    ride.vehicle?.name ||
    'Vehicle details unavailable';

  const driverNote = booking.driver_note;
  const passengerNote = booking.passenger_note;

  const statusLower = String(status).toLowerCase();

  const statusColor =
    statusLower === 'cancelled' || statusLower === 'rejected'
      ? '#DC2626'
      : statusLower === 'completed'
      ? '#64748B'
      : statusLower === 'confirmed'
      ? '#16A34A'
      : '#D97706';

  console.log('Booking data:', booking);
  console.log('Ride data:', ride);

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={21} color="#2563EB" />
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>
          {String(value ?? 'Not available')}
        </Text>
      </View>
    </View>
  );

  const SectionTitle = ({ title }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={23} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Ride Details</Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Booking Reference and Status */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingInfo}>
            <Text style={styles.mutedText}>Booking Reference</Text>
            <Text style={styles.bookingReference}>
              {bookingReference}
            </Text>

            <Text style={styles.mutedText}>
              Booking ID: {booking.id ?? 'N/A'}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}18` },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColor },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                { color: statusColor },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.card}>
          <SectionTitle title="Journey Details" />

          <View style={styles.routeContainer}>
            <View style={styles.routeIcons}>
              <View style={styles.pickupDot} />
              <View style={styles.routeLine} />
              <View style={styles.dropDot} />
            </View>

            <View style={styles.routeContent}>
              <View style={styles.locationBlock}>
                <Text style={styles.locationLabel}>
                  PICKUP LOCATION
                </Text>
                <Text style={styles.locationText}>{pickup}</Text>
              </View>

              <View style={styles.dropLocationBlock}>
                <Text style={styles.locationLabel}>
                  DROP LOCATION
                </Text>
                <Text style={styles.locationText}>{drop}</Text>
              </View>
            </View>
          </View>

          {ride.from_address && ride.from_address !== pickup && (
            <Text style={styles.routeHint}>
              Ride starts from: {ride.from_address}
            </Text>
          )}

          {ride.to_address && ride.to_address !== drop && (
            <Text style={styles.routeHint}>
              Ride destination: {ride.to_address}
            </Text>
          )}
        </View>

        {/* Travel Details */}
        <View style={styles.card}>
          <SectionTitle title="Travel Information" />

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

          {ride.uuid ? (
            <DetailRow
              icon="document-text-outline"
              label="Ride Reference"
              value={ride.uuid}
            />
          ) : null}
        </View>

        {/* Fare Details */}
        <View style={styles.card}>
          <SectionTitle title="Fare Breakdown" />

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Price per seat</Text>
            <Text style={styles.fareValue}>
              ₹{pricePerSeat}
            </Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>
              Seats ({seats})
            </Text>
            <Text style={styles.fareValue}>₹{subtotal}</Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Service fee</Text>
            <Text style={styles.fareValue}>₹{serviceFee}</Text>
          </View>

          {Number(discount) > 0 && (
            <View style={styles.fareRow}>
              <Text style={styles.discountLabel}>Discount</Text>
              <Text style={styles.discountValue}>
                -₹{discount}
              </Text>
            </View>
          )}

          <View style={styles.fareDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{amount}</Text>
          </View>

          <Text style={styles.currencyText}>
            Currency: {booking.currency || 'INR'}
          </Text>
        </View>

        {/* Booking Dates */}
        <View style={styles.card}>
          <SectionTitle title="Booking Information" />

          <DetailRow
            icon="calendar"
            label="Booking Created"
            value={
              booking.created_at
                ? new Date(booking.created_at).toLocaleString()
                : 'Not available'
            }
          />

          <DetailRow
            icon="checkmark-circle-outline"
            label="Confirmed At"
            value={
              booking.confirmed_at
                ? new Date(booking.confirmed_at).toLocaleString()
                : 'Not confirmed'
            }
          />

          {booking.completed_at ? (
            <DetailRow
              icon="flag-outline"
              label="Completed At"
              value={new Date(
                booking.completed_at
              ).toLocaleString()}
            />
          ) : null}

          {booking.cancelled_at ? (
            <DetailRow
              icon="close-circle-outline"
              label="Cancelled At"
              value={new Date(
                booking.cancelled_at
              ).toLocaleString()}
            />
          ) : null}
        </View>

        {/* Notes */}
        {(passengerNote || driverNote) && (
          <View style={styles.card}>
            <SectionTitle title="Additional Notes" />

            {passengerNote ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>Passenger Note</Text>
                <Text style={styles.noteText}>{passengerNote}</Text>
              </View>
            ) : null}

            {driverNote ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>Driver Note</Text>
                <Text style={styles.noteText}>{driverNote}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backToRidesButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.backToRidesText}>
            Back to My Rides
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Myridelistdetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  backButton: {
    width: 42,
    height: 42,
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

  headerRight: {
    width: 42,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  bookingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },

  bookingInfo: {
    flex: 1,
    paddingRight: 8,
  },

  mutedText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 5,
  },

  bookingReference: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 1,
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
    width: 20,
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
    width: 2,
    height: 46,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },

  dropDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },

  routeContent: {
    flex: 1,
    marginLeft: 12,
  },

  locationBlock: {
    minHeight: 65,
  },

  dropLocationBlock: {
    paddingTop: 3,
  },

  locationLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
  },

  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },

  routeHint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 12,
    lineHeight: 18,
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

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 5,
  },

  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },

  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  fareLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  fareValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  discountLabel: {
    fontSize: 14,
    color: '#16A34A',
  },

  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },

  fareDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  totalLabel: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },

  totalAmount: {
    fontSize: 23,
    fontWeight: '800',
    color: '#16A34A',
  },

  currencyText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 10,
  },

  noteBox: {
    backgroundColor: '#F8FAFC',
    padding: 13,
    borderRadius: 10,
    marginBottom: 12,
  },

  noteTitle: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
    marginBottom: 6,
  },

  noteText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },

  backToRidesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 2,
  },

  backToRidesText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});
