import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const chats = [
  {
    id: '1',
    name: 'Rahul Sharma',
    lastMessage: 'Is pickup point near metro?',
    time: '10:45 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Priya Verma',
    lastMessage: 'Thanks, see you tomorrow',
    time: 'Yesterday',
    unread: 0,
  },
];

const InboxScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => {
        // navigation.navigate('ChatScreen', { user: item });
        console.log('Open chat:', item.name);
      }}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={26} color="#555" />
      </View>

      {/* Chat Info */}
      <View style={styles.chatInfo}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unread > 0 && styles.unreadText,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inbox</Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color="#aaa" />
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        }
      />
    </View>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  unreadText: {
    fontWeight: '600',
    color: '#000',
  },
  unreadBadge: {
    backgroundColor: '#000',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 10,
    color: '#777',
  },
});
