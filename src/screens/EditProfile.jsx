import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    name: "Ajay Kumar",
    email: "ajay@example.com",
    phone: "9876543210",
    address: "Aligarh, Uttar Pradesh",
    avatar: "https://i.pravatar.cc/150?img=12",
  });

  const updateProfile = () => {
    Alert.alert("Success", "Profile updated successfully");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarBox}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraBtn}>
          <Icon name="camera-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
          value={profile.address}
          onChangeText={(text) => setProfile({ ...profile, address: text })}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f40b0f",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarBox: {
    alignSelf: "center",
    marginTop: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f40b0f",
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: "#f40b0f",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
