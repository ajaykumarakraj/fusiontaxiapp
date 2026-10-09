import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SelectDateScreen = ({ route, navigation }) => {
  const rideData = route?.params?.rideData || {};
console.log("SelectDateScreen - rideData:", rideData);
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

 const [selectedDate, setSelectedDate] = useState(new Date());

  // Month name
  const monthName = currentMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  // Number of days in current month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  // First day of month
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Sunday = 0
  const calendarDays = [];

  // Empty spaces before first date
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // All dates
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Previous month
  const previousMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );

    // Don't allow previous months
    if (
      newMonth.getFullYear() < today.getFullYear() ||
      (newMonth.getFullYear() === today.getFullYear() &&
        newMonth.getMonth() < today.getMonth())
    ) {
      return;
    }

    setCurrentMonth(newMonth);
  };

  // Next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  // Select date
  const handleDateSelect = (day) => {
    if (!day) return;

    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    // Past date check
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (selected < todayStart) {
      return;
    }

    setSelectedDate(selected);
  };

  // Check selected date
  const isSelected = (day) => {
    if (!day) return false;

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Check today
  const isToday = (day) => {
    if (!day) return false;

    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Continue
  const handleContinue = () => {
    const formattedDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    const finalRideData = {
      ...rideData,
      date: formattedDate,
    };

    console.log("date Data:", finalRideData);

    navigation.navigate("SelectTime", {
      rideData: finalRideData,
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

        <Text style={styles.headerTitle}>Select Date</Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Selected Date */}
      <View style={styles.selectedCard}>
        <Icon name="calendar-outline" size={28} color="#1976D2" />

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.selectedLabel}>Selected Date</Text>

          <Text style={styles.selectedDate}>
       {selectedDate instanceof Date
  ? selectedDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  : "Select a date"}
          </Text>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        {/* Month Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={previousMonth}
            style={styles.arrowButton}
          >
            <Icon name="chevron-back" size={22} color="#222" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>{monthName}</Text>

          <TouchableOpacity
            onPress={nextMonth}
            style={styles.arrowButton}
          >
            <Icon name="chevron-forward" size={22} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Week Days */}
        <View style={styles.weekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <View style={styles.weekDay} key={day}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            )
          )}
        </View>

        {/* Dates */}
        <View style={styles.daysContainer}>
          {calendarDays.map((day, index) => {
            const selected = isSelected(day);
            const todayDate = isToday(day);

            return (
              <TouchableOpacity
                key={index}
                disabled={!day}
                onPress={() => handleDateSelect(day)}
                style={[
                  styles.dateBox,
                  selected && styles.selectedDateBox,
                  todayDate && !selected && styles.todayBox,
                ]}
              >
                {day && (
                  <Text
                    style={[
                      styles.dateText,
                      selected && styles.selectedDateText,
                      todayDate &&
                        !selected &&
                        styles.todayDateText,
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
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

export default SelectDateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
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

  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#EAF3FF",
  },

  selectedLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 3,
  },

  selectedDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1976D2",
  },

  calendarContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekDay: {
    width: "14.28%",
    alignItems: "center",
  },

  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
  },

  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dateBox: {
    width: "14.28%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 3,
  },

  dateText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  selectedDateBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1976D2",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedDateText: {
    color: "#fff",
    fontWeight: "700",
  },

  todayBox: {
    borderWidth: 1,
    borderColor: "#1976D2",
    borderRadius: 21,
    width: 42,
    height: 42,
    alignSelf: "center",
  },

  todayDateText: {
    color: "#1976D2",
    fontWeight: "700",
  },

  continueButton: {
    position: "absolute",
    bottom: 25,
    left: 16,
    right: 16,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#1976D2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});