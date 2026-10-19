
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatScreen = ({navigation, route}) => {
  const customer = route?.params?.customer || {};
  const ride = route?.params?.ride || {};

  const customerName =
    customer.name || customer.fullname || 'Customer';

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! Welcome to Fusion Taxi.',
      time: '10:30 AM',
      sender: 'other',
    },
    {
      id: '2',
      text: 'Hi, I want to confirm my ride details.',
      time: '10:31 AM',
      sender: 'me',
    },
    {
      id: '3',
      text: 'Sure! How can I help you?',
      time: '10:32 AM',
      sender: 'other',
    },
  ]);

  const flatListRef = useRef(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMessage = {
      id: `${Date.now()}`,
      text: trimmedMessage,
      time,
      sender: 'me',
    };

    setMessages(previousMessages => [
      ...previousMessages,
      newMessage,
    ]);

    setMessage('');
  };

  const renderMessage = ({item}) => {
    const isMe = item.sender === 'me';

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.myMessageRow : styles.otherMessageRow,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              isMe && styles.myMessageText,
            ]}>
            {item.text}
          </Text>

          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.timeText,
                isMe && styles.myTimeText,
              ]}>
              {item.time}
            </Text>

            {isMe && (
              <Ionicons
                name="checkmark-done"
                size={16}
                color="#D7F5E7"
                style={styles.readIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="#17202A" />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Ionicons name="person" size={25} color="#FFFFFF" />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>
              {customerName}
            </Text>
            <Text style={styles.onlineText}>
              Fusion Taxi Chat
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {}}>
            <Ionicons
              name="ellipsis-vertical"
              size={23}
              color="#17202A"
            />
          </TouchableOpacity>
        </View>

        {/* Ride information */}
        {(ride.from_address || ride.to_address) && (
          <View style={styles.rideCard}>
            <Ionicons name="car-outline" size={22} color="#176B50" />
            <View style={styles.rideInfo}>
              <Text style={styles.rideTitle}>Ride Details</Text>
              <Text style={styles.rideText} numberOfLines={1}>
                {ride.from_address || 'Pickup location'}
              </Text>
              <Text style={styles.rideText} numberOfLines={1}>
                To: {ride.to_address || 'Drop location'}
              </Text>
            </View>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
          ListHeaderComponent={
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>TODAY</Text>
            </View>
          }
        />

        {/* Message input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9299A2"
              multiline
              maxLength={2000}
            />

            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => {}}>
              <Ionicons
                name="attach-outline"
                size={23}
                color="#667085"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.disabledSendButton,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}>
            <Ionicons
              name="send"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EDF2',
  },
  backButton: {
    padding: 5,
    marginRight: 8,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#176B50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17202A',
  },
  onlineText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 3,
  },
  headerIcon: {
    padding: 7,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5EF',
    borderRadius: 12,
  },
  rideInfo: {
    flex: 1,
    marginLeft: 10,
  },
  rideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#176B50',
    marginBottom: 4,
  },
  rideText: {
    fontSize: 12,
    color: '#344054',
    marginTop: 2,
  },
  chatContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
    flexGrow: 1,
  },
  dateContainer: {
    alignSelf: 'center',
    backgroundColor: '#E8EBEF',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 14,
    marginVertical: 12,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#667085',
  },
  messageRow: {
    width: '100%',
    marginVertical: 5,
  },
  myMessageRow: {
    alignItems: 'flex-end',
  },
  otherMessageRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 7,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#176B50',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#17202A',
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  timeText: {
    fontSize: 10,
    color: '#9299A2',
  },
  myTimeText: {
    color: '#D7F5E7',
  },
  readIcon: {
    marginLeft: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9EDF2',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5F7',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 5,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    color: '#17202A',
    fontSize: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  attachButton: {
    padding: 8,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#176B50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
  },
  disabledSendButton: {
    backgroundColor: '#A9C5BA',
  },
});

export default ChatScreen;
