import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const cars = [
  {
    id: "1",
    name: "Sedan",
    description: "Comfortable for 4 passengers",
    icon: "car-sport-outline",
    seats: 4,
  },
  {
    id: "2",
    name: "SUV",
    description: "Spacious for 5-7 passengers",
    icon: "car-outline",
    seats: 7,
  },
  {
    id: "3",
    name: "Hatchback",
    description: "Compact and economical",
    icon: "car-outline",
    seats: 4,
  },
  {
    id: "4",
    name: "MUV",
    description: "More space for passengers",
    icon: "car-sport-outline",
    seats: 7,
  },
];

const SelectCarScreen = ({ navigation, route }) => {
  const rideData = route?.params?.rideData || {};

  const [selectedCar, setSelectedCar] = useState(
    rideData?.car || null
  );

  const handleContinue = () => {
    if (!selectedCar) return;

    const finalRideData = {
      ...rideData,
      car: selectedCar,
    };

    console.log("Ride Data:", finalRideData);

    navigation.navigate("ReviewRide", {
      rideData: finalRideData,
    });
  };

  const renderCar = ({ item }) => {
    const isSelected = selectedCar?.id === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.carCard,
          isSelected && styles.selectedCarCard,
        ]}
        onPress={() => setSelectedCar(item)}
      >
        <View
          style={[
            styles.iconContainer,
            isSelected && styles.selectedIconContainer,
          ]}
        >
          <Ionicons
            name={item.icon}
            size={32}
            color={isSelected ? "#fff" : "#2563EB"}
          />
        </View>

        <View style={styles.carInfo}>
          <Text style={styles.carName}>{item.name}</Text>

          <Text style={styles.description}>
            {item.description}
          </Text>

          <View style={styles.seatRow}>
            <Ionicons
              name="people-outline"
              size={16}
              color="#666"
            />

            <Text style={styles.seatText}>
              {item.seats} seats
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.radio,
            isSelected && styles.radioSelected,
          ]}
        >
          {isSelected && <View style={styles.radioDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select Car</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Which car are you driving?</Text>

        <Text style={styles.subtitle}>
          Select the car you will use for this ride
        </Text>
      </View>

      {/* Car List */}
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={renderCar}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Continue */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!selectedCar}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            !selectedCar && styles.disabledButton,
          ]}
        >
          <Text style={styles.continueText}>Continue</Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SelectCarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },

  list: {
    padding: 20,
    paddingBottom: 120,
  },

  carCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectedCarCard: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  selectedIconContainer: {
    backgroundColor: "#2563EB",
  },

  carInfo: {
    flex: 1,
  },

  carName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  seatText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#2563EB",
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  continueButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: "#9CA3AF",
  },

  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});