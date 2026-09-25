
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TravelPreferences = ({navigation}) => {
  const [preferences, setPreferences] = useState({
    ac: true,
    music: false,
    smoking: false,
    pets: false,
    luggage: true,
    conversation: false,
  });

  const togglePreference = key => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const preferenceList = [
    {
      key: 'ac',
      title: 'Air Conditioning',
      subtitle: 'Prefer AC during the journey',
      icon: 'snow-outline',
    },
    {
      key: 'music',
      title: 'Music',
      subtitle: 'I am comfortable with music',
      icon: 'musical-notes-outline',
    },
    {
      key: 'smoking',
      title: 'Smoking',
      subtitle: 'Allow smoking during the ride',
      icon: 'flame-outline',
    },
    {
      key: 'pets',
      title: 'Pets',
      subtitle: 'I am comfortable travelling with pets',
      icon: 'paw-outline',
    },
    {
      key: 'luggage',
      title: 'Extra Luggage',
      subtitle: 'I may carry extra luggage',
      icon: 'briefcase-outline',
    },
    {
      key: 'conversation',
      title: 'Conversation',
      subtitle: 'I am comfortable with conversation',
      icon: 'chatbubble-ellipses-outline',
    },
  ];

  const savePreferences = () => {
    console.log('Travel Preferences:', preferences);

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={23} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Travel Preferences</Text>

        <View style={{width: 42}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        <Text style={styles.heading}>
          Your travel preferences
        </Text>

        <Text style={styles.description}>
          Let other travellers know what you prefer during your journey.
        </Text>

        {/* Preferences */}
        {preferenceList.map(item => (
          <View style={styles.preferenceCard} key={item.key}>
            <View style={styles.iconBox}>
              <Icon
                name={item.icon}
                size={23}
                color="#E50914"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {item.title}
              </Text>

              <Text style={styles.subtitle}>
                {item.subtitle}
              </Text>
            </View>

            <Switch
              value={preferences[item.key]}
              onValueChange={() =>
                togglePreference(item.key)
              }
              trackColor={{
                false: '#D5D5D5',
                true: '#90CAF9',
              }}
              thumbColor={
                preferences[item.key]
                  ? '#E50914'
                  : '#F4F4F4'
              }
            />
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={savePreferences}>
          <Text style={styles.saveText}>
            Save Preferences
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TravelPreferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginTop: 5,
  },

  description: {
    fontSize: 13,
    color: '#777',
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 19,
  },

  preferenceCard: {
    minHeight: 78,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EAF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  textContainer: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#222',
  },

  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    lineHeight: 17,
  },

  saveButton: {
    height: 52,
    backgroundColor: '#E50914',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
