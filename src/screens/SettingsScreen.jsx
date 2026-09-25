import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({navigation}) => {
  const handlePress = item => {
    if (item === 'Help & Support') {
      navigation.navigate('Help');
    } else if (item === 'Payment Method') {
      navigation.navigate('PaymentMethod');
    } else if (item === 'Terms & Conditions') {
      navigation.navigate('TermsConditions');
    } else if (item === 'Change Password') {
      navigation.navigate('ChangePassword');
    }
  };

  const options = [
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
    },
    {
      title: 'Payment Method',
      subtitle: 'Manage your payment methods',
      icon: 'card-outline',
    },
    {
      title: 'Terms & Conditions',
      subtitle: 'Read our terms and conditions',
      icon: 'document-text-outline',
    },
    {
      title: 'Change Password',
      subtitle: 'Update your account password',
      icon: 'lock-closed-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={23} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{width: 42}} />
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => handlePress(item.title)}>

            <View style={styles.iconBox}>
              <Icon name={item.icon} size={24} color="#E50914" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            <Icon
              name="chevron-forward"
              size={21}
              color="#999"
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  optionsContainer: {
    padding: 16,
  },

  option: {
    backgroundColor: '#FFFFFF',
    minHeight: 76,
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 2,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#EAF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 12.5,
    color: '#888',
  },
});