
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
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


useEffect(() => {
getRides();
},[]);
const getRides = async () => {
  
      const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
       console.log('Token:', token);
  const res = await axios.get(
  'https://api.squarebigha.com/oldApi/api/v1/rides',
  {
    params: {
      category: 'all',
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  }
);


  console.log('Rides response:', res.data);
}




  const handleEdit = (item) => {
    console.log('Edit ride:', item);
  };

  const handlePublish = (item) => {
    console.log('Publish ride:', item);
  };

  const handleCancel = (item) => {
    console.log('Cancel ride:', item);
  };

  const renderRide = ({ item }) => (
    <View style={styles.card}>
      {/* Route */}
      <View style={styles.route}>
        <Text style={styles.city}>{item.from}</Text>

        <Ionicons
          name="arrow-forward-outline"
          size={16}
          color="#555"
          style={styles.routeIcon}
        />

        <Text style={styles.city}>{item.to}</Text>
      </View>

      {/* Ride Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={14} color="#555" />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={14} color="#555" />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={14} color="#555" />
          <Text style={styles.infoText}>{item.seats} seats</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.price}>₹{item.price}/seat</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color="#000" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.publishButton]}
          onPress={() => handlePublish(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
          <Text style={styles.publishButtonText}>Publish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => handleCancel(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle-outline" size={16} color="#d11" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        showsVerticalScrollIndicator={false}
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
    padding: 2,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: '#000',
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

  routeIcon: {
    marginHorizontal: 8,
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

  /* Action Buttons */
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
  },

  editButton: {
    backgroundColor: '#f1f1f1',
  },

  editButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },

  publishButton: {
    backgroundColor: '#000',
  },

  publishButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  cancelButton: {
    backgroundColor: '#fff1f1',
    borderWidth: 1,
    borderColor: '#f2caca',
  },

  cancelButtonText: {
    color: '#d11',
    fontSize: 13,
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

