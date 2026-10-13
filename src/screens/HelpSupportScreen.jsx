
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HelpSupportScreen = ({navigation}) => {
  const [search, setSearch] = useState('');

  const topics = [
    {
      id: '1',
      title: 'Booking a ride',
      subtitle: 'Booking, cancellation and ride requests',
      icon: 'car-outline',
    },
    {
      id: '2',
      title: 'Payments & refunds',
      subtitle: 'Payment methods, charges and refunds',
      icon: 'card-outline',
    },
    {
      id: '3',
      title: 'Ride details',
      subtitle: 'Pickup, drop-off and ride information',
      icon: 'location-outline',
    },
    {
      id: '4',
      title: 'Account & profile',
      subtitle: 'Manage your account and personal details',
      icon: 'person-outline',
    },
  ];

  const filteredTopics = topics.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  const openLink = async url => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open this application.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleTopicPress = topic => {
    Alert.alert(
      topic.title,
      `For help with ${topic.title.toLowerCase()}, please contact our support team.`,
      [
        {text: 'Close', style: 'cancel'},
        {
          text: 'Contact Support',
          onPress: () => openLink('mailto:support@fusiontaxi.com'),
        },
      ],
    );
  };

  const ContactCard = ({icon, title, subtitle, onPress}) => (
    <TouchableOpacity
      style={styles.contactCard}
      activeOpacity={0.75}
      onPress={onPress}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={23} color="#111827" />
      </View>

      <View style={styles.contactText}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help & Support</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        {/* Intro */}
        <View style={styles.intro}>
          <View style={styles.illustration}>
            <Ionicons
              name="headset-outline"
              size={38}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.heading}>How can we help you?</Text>
          <Text style={styles.description}>
            Find answers to your questions or get in touch with our support team.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={21} color="#6B7280" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search for help"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Popular Topics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular topics</Text>
          <Text style={styles.sectionCaption}>Browse help topics</Text>
        </View>

        <View style={styles.topicsContainer}>
          {filteredTopics.length > 0 ? (
            filteredTopics.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.topicItem}
                activeOpacity={0.7}
                onPress={() => handleTopicPress(item)}>
                <View style={styles.topicIcon}>
                  <Ionicons name={item.icon} size={23} color="#111827" />
                </View>

                <View style={styles.topicText}>
                  <Text style={styles.topicTitle}>{item.title}</Text>
                  <Text style={styles.topicSubtitle}>{item.subtitle}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={28}
                color="#9CA3AF"
              />
              <Text style={styles.emptyTitle}>No topics found</Text>
              <Text style={styles.emptyDescription}>
                Try searching with different keywords.
              </Text>
            </View>
          )}
        </View>

        {/* Contact Support */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact us</Text>
          <Text style={styles.sectionCaption}>We're here to help</Text>
        </View>

        <View style={styles.contactContainer}>
          <ContactCard
            icon="call-outline"
            title="Call support"
            subtitle="Speak directly with our team"
            onPress={() => openLink('tel:+911234567890')}
          />

          <ContactCard
            icon="chatbubble-ellipses-outline"
            title="Chat with us"
            subtitle="Get assistance with your ride"
            onPress={() =>
              Alert.alert(
                'Chat support',
                'Live chat is not configured yet. Please email our support team.',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Email us',
                    onPress: () =>
                      openLink('mailto:support@fusiontaxi.com'),
                  },
                ],
              )
            }
          />

          <ContactCard
            icon="mail-outline"
            title="Email support"
            subtitle="Send us your questions or feedback"
            onPress={() =>
              openLink('mailto:support@fusiontaxi.com')
            }
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="heart-outline" size={18} color="#6B7280" />
          <Text style={styles.footerText}>
            We're here to help, every step of the way.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  intro: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 24,
  },
  illustration: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 9,
    paddingHorizontal: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 10,
    paddingVertical: 8,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCaption: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  topicsContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 30,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topicIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  topicSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 5,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  emptyDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
    textAlign: 'center',
  },
  contactContainer: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  contactIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    flex: 1,
    marginHorizontal: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});