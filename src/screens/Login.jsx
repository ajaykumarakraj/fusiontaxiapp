import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10) {
      Alert.alert("Invalid Number", "Enter a valid 10 digit mobile number");
      return;
    }

    // 👉 API CALL WILL COME HERE (later)
    console.log("OTP sent to:", phoneNumber);

    navigation.navigate("VerifyOtp", { phoneNumber });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icons/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.inputWrapper}>
        <Icon name="call-outline" size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number"
          keyboardType="number-pad"
          maxLength={10}
          value={phoneNumber}
          onChangeText={(text) =>
            setPhoneNumber(text.replace(/[^0-9]/g, ""))
          }
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSendOtp}>
        <Text style={styles.btnText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ab4d4dff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 10,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#000",
    width: "100%",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
