import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SelectTimeScreen = ({ route, navigation }) => {
  const rideData = route?.params?.rideData || {};

  const [mode, setMode] = useState("hour");
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [period, setPeriod] = useState("AM");

  // 1 - 12
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  // 5 minute interval
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const selectHour = (hour) => {
    setSelectedHour(hour);
    setMode("minute");
  };

  const selectMinute = (minute) => {
    setSelectedMinute(minute);
  };

  const getTime = () => {
    if (selectedHour === null || selectedMinute === null) {
      return "";
    }

    return `${String(selectedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")} ${period}`;
  };

  const handleContinue = () => {
    if (selectedHour === null || selectedMinute === null) {
      return;
    }

    const formattedTime = getTime();

    const finalRideData = {
      ...rideData,
      time: formattedTime,
    };

    console.log("select time Data:", finalRideData);

    navigation.navigate("SelectPassenger", {
      rideData: finalRideData,
    });
  };

  const renderClockNumbers = () => {
    const values = mode === "hour" ? hours : minutes;

    return values.map((value, index) => {
      const angle = index * 30;

      const selected =
        mode === "hour"
          ? selectedHour === value
          : selectedMinute === value;

      let displayValue = value;

      if (mode === "minute") {
        displayValue = String(value).padStart(2, "0");
      }

      return (
        <TouchableOpacity
          key={value}
          onPress={() =>
            mode === "hour"
              ? selectHour(value)
              : selectMinute(value)
          }
          style={[
            styles.number,
            {
              transform: [
                { rotate: `${angle}deg` },
                { translateY: -110 },
                { rotate: `${-angle}deg` },
              ],
            },
            selected && styles.selectedNumber,
          ]}
        >
          <Text
            style={[
              styles.numberText,
              selected && styles.selectedNumberText,
            ]}
          >
            {displayValue}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select Time</Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Date */}
      <View style={styles.dateCard}>
        <Icon
          name="calendar-outline"
          size={24}
          color="#1976D2"
        />

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.dateLabel}>Travel Date</Text>

          <Text style={styles.dateText}>
            {rideData?.date || "Date not selected"}
          </Text>
        </View>
      </View>

      {/* Selected Time */}
      <View style={styles.timeDisplay}>
        <Text style={styles.timeDisplayText}>
          {selectedHour !== null
            ? String(selectedHour).padStart(2, "0")
            : "--"}
          :
          {selectedMinute !== null
            ? String(selectedMinute).padStart(2, "0")
            : "--"}
        </Text>

        <View style={styles.periodContainer}>
          <TouchableOpacity
            onPress={() => setPeriod("AM")}
            style={[
              styles.periodButton,
              period === "AM" && styles.activePeriod,
            ]}
          >
            <Text
              style={[
                styles.periodText,
                period === "AM" && styles.activePeriodText,
              ]}
            >
              AM
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPeriod("PM")}
            style={[
              styles.periodButton,
              period === "PM" && styles.activePeriod,
            ]}
          >
            <Text
              style={[
                styles.periodText,
                period === "PM" && styles.activePeriodText,
              ]}
            >
              PM
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Select Label */}
      <Text style={styles.selectLabel}>
        {mode === "hour" ? "Select Hour" : "Select Minutes"}
      </Text>

      {/* Clock */}
      <View style={styles.clock}>
        {/* Clock circle */}
        <View style={styles.clockCircle} />

        {/* Clock numbers */}
        {renderClockNumbers()}

        {/* Center */}
        <View style={styles.centerDot} />

        {/* Hand */}
        {(selectedHour !== null ||
          selectedMinute !== null) && (
          <View
            style={[
              styles.clockHand,
              {
                transform: [
                  {
                    rotate: `${
                      mode === "hour"
                        ? selectedHour * 30
                        : selectedMinute * 6
                    }deg`,
                  },
                ],
              },
            ]}
          />
        )}
      </View>

      {/* Switch Hour / Minute */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setMode("hour")}
          style={[
            styles.switchButton,
            mode === "hour" && styles.activeSwitch,
          ]}
        >
          <Text
            style={[
              styles.switchText,
              mode === "hour" && styles.activeSwitchText,
            ]}
          >
            Hour
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (selectedHour !== null) {
              setMode("minute");
            }
          }}
          style={[
            styles.switchButton,
            mode === "minute" && styles.activeSwitch,
          ]}
        >
          <Text
            style={[
              styles.switchText,
              mode === "minute" && styles.activeSwitchText,
            ]}
          >
            Minute
          </Text>
        </TouchableOpacity>
      </View>

      {/* Continue */}
      <TouchableOpacity
        disabled={
          selectedHour === null || selectedMinute === null
        }
        onPress={handleContinue}
        style={[
          styles.continueButton,
          (selectedHour === null ||
            selectedMinute === null) &&
            styles.disabledButton,
        ]}
      >
        <Text style={styles.continueText}>Continue</Text>

        <Icon
          name="arrow-forward"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SelectTimeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F3F5",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#222",
  },

  dateCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#EAF3FF",
    flexDirection: "row",
    alignItems: "center",
  },

  dateLabel: {
    fontSize: 12,
    color: "#777",
  },

  dateText: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: "700",
    color: "#1976D2",
  },

  timeDisplay: {
    marginTop: 18,
    alignItems: "center",
  },

  timeDisplayText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#1976D2",
  },

  periodContainer: {
    flexDirection: "row",
    marginTop: 8,
    backgroundColor: "#E8EDF3",
    borderRadius: 20,
    padding: 3,
  },

  periodButton: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 17,
  },

  activePeriod: {
    backgroundColor: "#1976D2",
  },

  periodText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },

  activePeriodText: {
    color: "#fff",
  },

  selectLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },

  clock: {
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  clockCircle: {
    position: "absolute",
    width: 245,
    height: 245,
    borderRadius: 123,
    borderWidth: 1,
    borderColor: "#E5EAF0",
  },

  number: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  numberText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  selectedNumber: {
    backgroundColor: "#1976D2",
  },

  selectedNumberText: {
    color: "#fff",
    fontWeight: "700",
  },

  centerDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1976D2",
  },

  clockHand: {
    position: "absolute",
    width: 2,
    height: 100,
    backgroundColor: "#1976D2",
    bottom: "50%",
    left: "50%",
    marginLeft: -1,
    transformOrigin: "bottom",
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
    gap: 10,
  },

  switchButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E8EDF3",
  },

  activeSwitch: {
    backgroundColor: "#1976D2",
  },

  switchText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },

  activeSwitchText: {
    color: "#fff",
  },

  continueButton: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#1976D2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  disabledButton: {
    backgroundColor: "#AFC8E8",
  },

  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});