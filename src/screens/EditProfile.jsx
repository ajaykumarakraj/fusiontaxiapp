import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';

const EditProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    photo: '',

  });
 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
const [profileImage, setProfileImage] = useState(null);

console.log("profileImage",profileImage)

const uploadimage = async () => {
  try {
    if (!profileImage) {
      Alert.alert('Select Image', 'Please select a profile image first.');
      return;
    }

    const credentials = await Keychain.getGenericPassword();

    if (!credentials) {
      Alert.alert('Session Expired', 'Please login again.');
      return;
    }

    const token = credentials.password;

    const formData = new FormData();

    formData.append('photo', {
      uri: profileImage,
      type: 'image/jpeg',
      name: `profile_${Date.now()}.jpg`,
    });

    console.log('Uploading image...');
    console.log('Image URI:', formData);

    const res = await axios.post(
      'https://api.squarebigha.com/oldApi/api/v1/profile/photo',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
setProfileImage(res.data.data.url)
    console.log('Photo Response:', res.data.data.url);

    Alert.alert(
      'Success',
      'Profile photo uploaded successfully.',
    );

    // Profile dobara load
    getProfile();

    // Selected image clear
    // setProfileImage(null);

  } catch (error) {
    console.log(
      'Upload Image Error:',
      error?.response?.data || error?.message,
    );

    Alert.alert(
      'Upload Failed',
      error?.response?.data?.message ||
        'Unable to upload profile photo.',
    );
  }
};

const pickImage = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert(
        'Error',
        result.errorMessage || 'Unable to select image',
      );
      return;
    }

    const image = result.assets?.[0];

    if (!image?.uri) {
      return;
    }

    console.log('Selected Image:', image);

    setProfileImage(image.uri);

  } catch (error) {
    console.log('Image Picker Error:', error);
    Alert.alert(
      'Error',
      'Something went wrong while selecting image.',
    );
  }
};

  // =========================
  // GET PROFILE
  // =========================
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);

      const credentials = await Keychain.getGenericPassword();

      if (!credentials) {
        console.log('Token not found');
        setLoading(false);

        Alert.alert(
          'Session Expired',
          'Please login again.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.replace('Login');
              },
            },
          ],
        );

        return;
      }

      const token = credentials.password;

      console.log('Token found');

      const response = await axios.get(
        'https://api.squarebigha.com/oldApi/api/v1/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      console.log('Profile API Response:', response.data);

      const data = response.data?.data;

      if (data) {
        setProfile({
          name: data?.name || '',
          email: data?.email || '',
          phone: data?.phone || '',
          photo:data?.profile_photo
          // address: data?.address || '',
          // avatar: data?.avatar || '',
        });
      }
    } catch (error) {
      console.log(
        'Profile API Error:',
        error?.response?.data || error?.message,
      );

      if (error?.response?.status === 401) {
        Alert.alert(
          'Session Expired',
          'Please login again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await Keychain.resetGenericPassword();
                navigation.replace('Login');
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Error',
          'Unable to load profile. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async () => {
  if (!profile.name.trim()) {
    Alert.alert('Validation', 'Please enter your name.');
    return;
  }

  if (!profile.email.trim()) {
    Alert.alert('Validation', 'Please enter your email.');
    return;
  }

  if (!profile.phone.trim()) {
    Alert.alert('Validation', 'Please enter your phone number.');
    return;
  }

  try {
    setSaving(true);

    const credentials = await Keychain.getGenericPassword();

    if (!credentials) {
      Alert.alert('Session Expired', 'Please login again.');
      return;
    }

    const token = credentials.password;

    // =========================
    // UPDATE PROFILE DETAILS
    // =========================

    const payload = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      // address: profile.address,
    };

    console.log('Profile Update Payload:', payload);

    const response = await axios.put(
      'https://api.squarebigha.com/oldApi/api/v1/profile',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );

    console.log('Profile Update Response:', response.data);

    // =========================
    // UPLOAD PROFILE PHOTO
    // =========================

    if (profileImage) {
      console.log('New image selected. Uploading...');

      const photoUploaded = await uploadimage();

      if (!photoUploaded) {
        return;
      }

      console.log('Photo uploaded successfully');
    }

    // =========================
    // SUCCESS
    // =========================

    setProfileImage(null);

    Alert.alert(
      'Success',
      'Profile updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            getProfile();
          },
        },
      ],
    );

  } catch (error) {
    console.log(
      'Update Profile Error:',
      error?.response?.data || error?.message,
    );

    Alert.alert(
      'Error',
      error?.response?.data?.message ||
        'Unable to update profile. Please try again.',
    );
  } finally {
    setSaving(false);
  }
};
  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f40b0f" />
        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // =========================
  // UI
  // =========================

  console.log("get data ",profile.photo)
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Edit Profile
        </Text>

        <View style={styles.headerRight} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
         <View style={styles.avatarWrapper}>
    <Image
      source={{
        uri: profileImage || profile?.photo,
      }}
      style={styles.avatar}
      resizeMode="cover"
    />

    <TouchableOpacity
      style={styles.cameraBtn}
      onPress={pickImage}
    >
      <Icon
        name="camera"
        size={18}
        color="#fff"
      />
    </TouchableOpacity>
  </View>

        <Text style={styles.changePhoto}>
          Change profile photo
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Full Name
          </Text>

          <View style={styles.inputWrapper}>
            <Icon
              name="person-outline"
              size={20}
              color="#777"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#aaa"
              value={profile.name}
              onChangeText={text =>
                setProfile(prev => ({
                  ...prev,
                  name: text,
                }))
              }
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Email Address
          </Text>

          <View style={styles.inputWrapper}>
            <Icon
              name="mail-outline"
              size={20}
              color="#777"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={profile.email}
              onChangeText={text =>
                setProfile(prev => ({
                  ...prev,
                  email: text,
                }))
              }
            />
          </View>
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Phone Number
          </Text>

          <View style={styles.inputWrapper}>
            <Icon
              name="call-outline"
              size={20}
              color="#777"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              maxLength={10}
              value={profile.phone}
              onChangeText={text =>
                setProfile(prev => ({
                  ...prev,
                  phone: text,
                }))
              }
            />
          </View>
        </View>

        
      </View>

      {/* Account Security */}
      <View style={styles.securityCard}>
        <View style={styles.securityIcon}>
          <Icon
            name="shield-checkmark-outline"
            size={22}
            color="#f40b0f"
          />
        </View>

        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>
            Account Security
          </Text>

          <Text style={styles.securityText}>
            Your profile information is securely stored.
          </Text>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveBtn,
          saving && styles.disabledButton,
        ]}
        onPress={updateProfile}
        disabled={saving}>

        {saving ? (
          <ActivityIndicator
            size="small"
            color="#fff"
          />
        ) : (
          <>
            <Icon
              name="checkmark-circle-outline"
              size={21}
              color="#fff"
            />

            <Text style={styles.saveText}>
              Save Changes
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Bottom Space */}
      <View style={{height: 30}} />
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f7f9',
  },

  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },

  header: {
     paddingTop: 40,
    height: 65,
    backgroundColor: '#f40b0f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRight: {
    width: 40,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 25,
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#fff',
  },

  defaultAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },

  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f40b0f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },

  changePhoto: {
    marginTop: 10,
    fontSize: 13,
    color: '#f40b0f',
    fontWeight: '600',
  },

  form: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 7,
  },

  inputWrapper: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    backgroundColor: '#fafafa',
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    marginLeft: 10,
    paddingVertical: 10,
  },

  addressWrapper: {
    alignItems: 'flex-start',
    minHeight: 80,
    paddingTop: 13,
  }, 

  addressIcon: {
    marginTop: 2,
  },

  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },

  securityCard: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  securityIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  securityContent: {
    flex: 1,
    marginLeft: 12,
  },

  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  securityText: {
    marginTop: 3,
    fontSize: 12,
    color: '#777',
  },

  saveBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f40b0f',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,

  },
});