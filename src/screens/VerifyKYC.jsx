import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const VerifyKYC = () => {
  const [kycStatus, setKycStatus] = useState("Pending");
  const [idNumber, setIdNumber] = useState("");
  const [document, setDocument] = useState(null);

  const uploadDocument = () => {
    // integrate image picker here
    setDocument("https://via.placeholder.com/200");
  };

  const submitKYC = () => {
    if (!idNumber || !document) {
      Alert.alert("Error", "Please complete all KYC details");
      return;
    }

    Alert.alert("Success", "KYC Submitted Successfully");
    setKycStatus("Under Review");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verify KYC</Text>
        <Text style={styles.headerSub}>
          Complete KYC to start accepting rides
        </Text>
      </View>

      {/* Status */}
      <View style={styles.statusCard}>
        <Icon
          name="shield-checkmark-outline"
          size={24}
          color={kycStatus === "Verified" ? "green" : "#f40b0f"}
        />
        <Text style={styles.statusText}>
          Status: <Text style={styles.status}>{kycStatus}</Text>
        </Text>
      </View>

      {/* ID Number */}
      <View style={styles.card}>
        <Text style={styles.label}>Aadhaar / PAN Number</Text>
        <TextInput
          placeholder="Enter ID Number"
          value={idNumber}
          onChangeText={setIdNumber}
          style={styles.input}
        />
      </View>

      {/* Upload Document */}
      <View style={styles.card}>
        <Text style={styles.label}>Upload ID Proof</Text>

        <TouchableOpacity style={styles.uploadBox} onPress={uploadDocument}>
          {document ? (
            <Image source={{ uri: document }} style={styles.preview} />
          ) : (
            <>
              <Icon name="cloud-upload-outline" size={30} color="#777" />
              <Text style={styles.uploadText}>Upload Document</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={submitKYC}>
        <Text style={styles.submitText}>Submit KYC</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VerifyKYC;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f40b0f",
    padding: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSub: {
    color: "#ffeaea",
    marginTop: 5,
  },
  statusCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 10,
    fontSize: 16,
  },
  status: {
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#bbb",
    borderRadius: 8,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    marginTop: 10,
    color: "#777",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  submitBtn: {
    backgroundColor: "#f40b0f",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
