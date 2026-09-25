import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ridesData = {
  upcoming: [
    {
      id: '1',
      from: 'Delhi',
      to: 'Agra',
      date: '12 Jan',
      time: '08:30 AM',
      seats: 2,
      price: 450,
      status: 'Confirmed',
    },
  ],
  past: [
    {
      id: '2',
      from: 'Noida',
      to: 'Jaipur',
      date: '02 Jan',
      time: '06:00 AM',
      seats: 3,
      price: 600,
      status: 'Completed',
    },
  ],
};

const RidesScreen = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const rides = ridesData[activeTab];

  const renderRide = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.route}>
        <Text style={styles.city}>{item.from}</Text>
        <Ionicons name="arrow-forward-outline" size={16} color="#555" />
        <Text style={styles.city}>{item.to}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={14} />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={14} />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={14} />
          <Text style={styles.infoText}>{item.seats} seats</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>₹{item.price}/seat</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Rides</Text>

      {/* Tabs */}
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

      {/* Ride List */}
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={renderRide}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="car-outline" size={40} color="#aaa" />
            <Text style={styles.emptyText}>No rides found</Text>
          </View>
        }
      />
    </View>
  );
};

export default RidesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  header: {
     paddingTop: 40,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#000',
    borderRadius: 10,
  },
  tabText: {
    color: '#555',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    color: '#777',
  },
});
