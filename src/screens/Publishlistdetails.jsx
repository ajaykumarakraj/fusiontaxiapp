
import axios from 'axios';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import * as Keychain from 'react-native-keychain';


const customers = [
  {
    id: 1,
    name: 'Satish',
    phone: '9876543210',
    email: 'satish@example.com',
    seats: 2,
    bookingId: 'BK101',
  },
  {
    id: 2,
    name: 'Rahul',
    phone: '9876501234',
    email: 'rahul@example.com',
    seats: 1,
    bookingId: 'BK102',
  },
];
const Publishlistdetails = ({ navigation, route }) => {
  const ride = route?.params?.ride || {};

  console.log("ride data",ride)

useEffect(()=>{
  getpassenger()
},[])
const getpassenger=async()=>{
  try {
      const credentials = await Keychain.getGenericPassword();
    
          if (!credentials || !credentials.password) {
            setError('Authentication token nahi mila. Please login again.');
            setRidesData([]);
            return;
          }
    const res=await axios.get(`https://api.squarebigha.com/oldApi/api/v1/rides/${ride.uuid}/bookings`,{
      headers:{
        Authorization: `Bearer ${credentials.password}`,
      }
    })

    console.log("response",res.data.data.data)
  } catch (error) {
    console.log(error)
  }
}


// const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  // Route details
  const pickup =
    ride.from_address ||
    ride.from ||
    ride.source?.address ||
    ride.pickup_location ||
    'Unknown location';

  const destination =
    ride.to_address ||
    ride.to ||
    ride.destination?.address ||
    ride.drop_location ||
    'Unknown location';

  // Date and time
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

  // Booking and pricing
  const pricePerSeat = Number(
    ride.price_per_seat ??
      ride.pricePerSeat ??
      ride.price ??
      0
  );

  const bookedSeats = Number(
    ride.booked_seats ??
      ride.seats_booked ??
      ride.booking?.seats ??
      ride.passengers_count ??
      1
  );

  const totalPrice = Number(
    ride.total_amount ??
      ride.booking?.total_amount ??
      pricePerSeat * bookedSeats
  );

  const formatCity = city => {
    if (typeof city === 'string') {
      return city;
    }

    return (
      city?.name ||
      city?.city ||
      city?.city_name ||
      city?.address ||
      'Unknown stop'
    );
  };

const formatRideDate = (dateValue) => {
  if (!dateValue) return 'Not available';

  // Avoid invalid date values
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formattedDate = formatRideDate(date);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Ride Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Route */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route Details</Text>

          <View style={styles.routeRow}>
            <View style={styles.routeLine}>
              <View style={styles.pickupDot} />
              <View style={styles.dottedLine} />
              <View style={styles.destinationDot} />
            </View>

            <View style={styles.routeContent}>
              <Text style={styles.label}>PICKUP</Text>
              <Text style={styles.value}>{pickup}</Text>

              <View style={styles.routeGap} />

              <Text style={styles.label}>DESTINATION</Text>
              <Text style={styles.value}>{destination}</Text>
            </View>
          </View>

        
        </View>

        {/* Date and time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>DATE</Text>
           <Text style={styles.value}>{formattedDate}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>DEPARTURE TIME</Text>
              <Text style={styles.value}>{time}</Text>
            </View>
          </View>
        </View>

        {/* Customer details */}
   
<View style={styles.card}>
  <Text style={styles.cardTitle}>Customer List</Text>

  {customers.map(customer => (
    <TouchableOpacity
      key={customer.id}
      style={styles.customerItem}
      onPress={() =>
  navigation.navigate('CustomerDetails', {
    customer: customer,
  })
}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {customer.name.charAt(0)}
        </Text>
      </View>
      <Text style={styles.customerName}>
        {customer.name}
      </Text>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  ))}

 
</View>
        {/* Price */}
        <View style={styles.priceCard}>
          <Text style={styles.cardTitle}>Payment Details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price per seat</Text>
            <Text style={styles.priceValue}>
              ₹{pricePerSeat.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Booked seats</Text>
            <Text style={styles.priceValue}>{bookedSeats}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              ₹{totalPrice.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>RIDE STATUS</Text>
            <Text style={styles.status}>
              {ride.status || 'Unknown'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Publishlistdetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  back: {
    fontSize: 17,
    color: '#16834A',
    marginBottom: 12,
  },
  heading: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },
  routeRow: {
    flexDirection: 'row',
  },
  routeLine: {
    alignItems: 'center',
    width: 22,
    marginRight: 12,
    paddingTop: 4,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16834A',
  },
  dottedLine: {
    height: 50,
    borderLeftWidth: 2,
    borderColor: '#B8C4CE',
    borderStyle: 'dashed',
  },
  destinationDot: {
    width: 12,
    height: 12,
    backgroundColor: '#E45757',
    borderRadius: 2,
  },
  routeContent: {
    flex: 1,
  },
  routeGap: {
    height: 28,
  },
  label: {
    fontSize: 11,
    color: '#7B8491',
    fontWeight: '600',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    color: '#202938',
    fontWeight: '600',
  },
  stopsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEF0F3',
    marginTop: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '700',
    marginBottom: 12,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#E7F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stopNumberText: {
    color: '#16834A',
    fontWeight: '700',
    fontSize: 12,
  },
  stopText: {
    flex: 1,
    color: '#202938',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoBlock: {
    flex: 1,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  priceLabel: {
    fontSize: 14,
    color: '#667085',
  },
  priceValue: {
    fontSize: 15,
    color: '#202938',
    fontWeight: '600',
  },
  separator: {
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 22,
    color: '#16834A',
    fontWeight: '800',
  },
  statusRow: {
    borderTopWidth: 1,
    borderColor: '#EEF0F3',
    paddingTop: 14,
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16834A',
  },
 customerItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#EEEEEE',
},

avatar: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#E7F5EC',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},

avatarText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#16834A',
},

customerName: {
  flex: 1,
  fontSize: 16,
  fontWeight: '600',
  color: '#111827',
},

arrow: {
  fontSize: 26,
  color: '#16834A',
},

details: {
  marginTop: 18,
  paddingTop: 16,
  borderTopWidth: 1,
  borderTopColor: '#EEEEEE',
},

closeButton: {
  marginTop: 18,
  backgroundColor: '#16834A',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},

closeText: {
  color: '#FFFFFF',
  fontWeight: '700',
},
});
