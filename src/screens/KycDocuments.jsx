import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const documents = [
  {
    id: 1,
    title: "Aadhaar Card",
    subtitle: "Government issued ID proof",
    icon: "card-outline",
    status: "Pending",
    option:"mandatry"
  },
  {
    id: 2,
    title: "Driving License",
    subtitle: "Valid driving permit",
    icon: "car-outline",
    status: "Pending",
    option:"mandatry"
  },
  {
    id: 3,
     title: "PAN Card",
    subtitle: "Income tax identification",
    icon: "document-text-outline",
    status: "Verified",
    option:"optional"
   
  },
  {
    id: 4,
    title: "Passport",
    subtitle: "International identity proof",
    icon: "airplane-outline",
    status: "Not Uploaded",
    option:"optional"
  },
];

const KycDocuments = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KYC Documents</Text>
        <Text style={styles.headerSub}>
          Upload & verify your identity documents
        </Text>
      </View>

      {/* Document List */}
      {documents.map((doc) => (
        <TouchableOpacity
          key={doc.id}
          style={styles.card}
          onPress={() => navigation.navigate("VerifyKYC", { type: doc.title })}
        >
          <View style={styles.left}>
            <Icon name={doc.icon} size={26} color="#f40b0f" />
          </View>

          <View style={styles.center}>
            <Text style={styles.title}>{doc.title}({doc.option})</Text>
            <Text style={styles.subtitle}>{doc.subtitle}</Text>
          </View>

          <View style={styles.right}>
            <Text
              style={[
                styles.status,
                doc.status === "Verified"
                  ? styles.verified
                  : styles.pending,
              ]}
            >
              {doc.status}
            </Text>
            <Icon
              name="chevron-forward-outline"
              size={18}
              color="#999"
              style={{ marginTop: 5 }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default KycDocuments;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f40b0f",
    padding: 22,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerSub: {
    color: "#ffeaea",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  left: {
    width: 40,
    alignItems: "center",
  },
  center: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },
  right: {
    alignItems: "flex-end",
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  verified: {
    backgroundColor: "#e7f8ee",
    color: "#1fa463",
  },
  pending: {
    backgroundColor: "#fff4e5",
    color: "#f57c00",
  },
});
