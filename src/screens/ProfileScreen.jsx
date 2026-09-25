import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {useAuth} from '../context/AuthContext';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();

  // AuthContext se logout function
  const {logout} = useAuth();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const menuOptions = [
    {
      id: 1,
      title: 'Add a Mini Bio',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      screen: 'MiniBio',
    },
    {
      id: 3,
      title: 'Edit Travel Preferences',
      subtitle: 'Edit Travel Preferences....',
      icon: 'card-outline',
      screen: 'Travepreferences',
    },
  ];

  const rideOptions = [
    {
      id: 4,
      title: 'Add Vehicle',
      subtitle: 'View your Vehicle',
      icon: 'time-outline',
      screen: 'AddVehicle',
    },
  ];

  const supportOptions = [
    {
      id: 5,
      title: 'Settings',
      subtitle: 'Manage app preferences',
      icon: 'settings-outline',
      screen: 'Settings',
    },
    {
      id: 6,
      title: 'Help & Support',
      subtitle: 'Get help with your account',
      icon: 'help-circle-outline',
      screen: 'Settings',
    },
  ];

  useEffect(() => {
    fun();
  }, []);

  const fun = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();

      if (!credentials) {
        console.log('Token not found');
        setLoading(false);
        return;
      }

      const token = credentials.password;

      const res = await axios.get(
        'https://api.squarebigha.com/oldApi/api/v1/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Profile:', res.data.data);

      setUser(res.data.data || {});
    } catch (error) {
      console.log(
        'Profile API Error:',
        error?.response?.data || error?.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = option => {
    navigation.navigate(option.screen);
  };

  // ================= LOGOUT =================

 
const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout from your account?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.log('Logout Error:', error);
          }
        },
      },
    ],
  );
};



  const renderMenuItem = option => {
    return (
      <TouchableOpacity
        key={option.id}
        activeOpacity={0.75}
        style={styles.menuItem}
        onPress={() => handleMenuPress(option)}>

        <View style={styles.iconContainer}>
          <Icon
            name={option.icon}
            size={21}
            color="#E50914"
          />
        </View>

        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>
            {option.title}
          </Text>

          <Text style={styles.menuSubtitle}>
            {option.subtitle}
          </Text>
        </View>

        <Icon
          name="chevron-forward"
          size={20}
          color="#A0A0A0"
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#E50914"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#E50914"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>
              My Profile
            </Text>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() =>
                navigation.navigate('Settings')
              }>
              <Icon
                name="settings-outline"
                size={21}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}

          <View style={styles.profileCard}>

            <View style={styles.avatarWrapper}>
              {user?.avatar ? (
                <Image
                  source={{uri: user.avatar}}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon
                    name="person"
                    size={45}
                    color="#aaa"
                  />
                </View>
              )}

              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text
                style={styles.name}
                numberOfLines={1}>
                {user?.name || 'User'}
              </Text>

              <Text
                style={styles.email}
                numberOfLines={1}>
                {user?.email || 'No email available'}
              </Text>

              {user?.phone && (
                <View style={styles.phoneRow}>
                  <Icon
                    name="call-outline"
                    size={14}
                    color="#777"
                  />

                  <Text style={styles.phone}>
                    {user.phone}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('EditProfile')
              }>
              <Icon
                name="create-outline"
                size={17}
                color="#E50914"
              />
            </TouchableOpacity>

          </View>
        </View>

        {/* ================= KYC CARD ================= */}

        <View style={styles.kycCard}>

          <View style={styles.kycIcon}>
            <Icon
              name="shield-checkmark"
              size={22}
              color="#E50914"
            />
          </View>

          <View style={styles.kycContent}>
            <Text style={styles.kycTitle}>
              Verify your Govt. ID
            </Text>

            <Text style={styles.kycSubtitle}>
              Complete KYC to unlock all features
            </Text>
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() =>
              navigation.navigate('KycDocuments')
            }>
            <Text style={styles.verifyText}>
              Verify
            </Text>
          </TouchableOpacity>

        </View>

        {/* ================= ACCOUNT ================= */}

        <Text style={styles.sectionTitle}>
          About You
        </Text>

        <View style={styles.menuCard}>
          {menuOptions.map(renderMenuItem)}
        </View>

        {/* ================= RIDES ================= */}

        <Text style={styles.sectionTitle}>
          Vehicle
        </Text>

        <View style={styles.menuCard}>
          {rideOptions.map(renderMenuItem)}
        </View>

        {/* ================= SUPPORT ================= */}

        <Text style={styles.sectionTitle}>
          SUPPORT & PREFERENCES
        </Text>

        <View style={styles.menuCard}>
          {supportOptions.map(renderMenuItem)}
        </View>

        {/* ================= LOGOUT ================= */}

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={handleLogout}>

          <View style={styles.logoutIcon}>
            <Icon
              name="log-out-outline"
              size={21}
              color="#E50914"
            />
          </View>

          <Text style={styles.logoutText}>
            Logout
          </Text>

          <Icon
            name="chevron-forward"
            size={20}
            color="#E50914"
          />
        </TouchableOpacity>

        <Text style={styles.version}>
          FusionTaxi • Version 1.0.0
        </Text>

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
   
  },

  scrollContent: {
    
    paddingBottom: 35,
  },

  header: {
    backgroundColor: '#E50914',
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 55,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: -48,
    minHeight: 112,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 7,
  },

  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#fff',
  },

  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F1F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  onlineBadge: {
    position: 'absolute',
    right: 1,
    bottom: 2,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  onlineDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },

  profileInfo: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    fontSize: 19,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 4,
  },

  email: {
    fontSize: 13,
    color: '#777',
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  phone: {
    fontSize: 12,
    color: '#777',
    marginLeft: 5,
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  kycCard: {
    marginTop: 72,
    marginHorizontal: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  kycIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  kycContent: {
    flex: 1,
    marginLeft: 12,
  },

  kycTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },

  kycSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },

  verifyButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
  },

  verifyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8B8B8B',
    letterSpacing: 1,
    marginTop: 25,
    marginBottom: 9,
    marginHorizontal: 20,
  },

  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },

  menuItem: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuContent: {
    flex: 1,
    marginLeft: 13,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202020',
  },

  menuSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 3,
  },

  logoutButton: {
    marginHorizontal: 18,
    marginTop: 24,
    height: 60,
    borderRadius: 17,
    backgroundColor: '#FFF1F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    flex: 1,
    marginLeft: 13,
    fontSize: 15,
    fontWeight: '700',
    color: '#E50914',
  },

  version: {
    textAlign: 'center',
    color: '#A4A4A4',
    fontSize: 11,
    marginTop: 22,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#888',
  },
});