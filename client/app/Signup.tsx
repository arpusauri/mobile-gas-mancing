import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import BackgroundLayout from "../components/BackgroundLayout";

const { width, height } = Dimensions.get("window");

// Responsive sizes
const isSmallScreen = height < 700;
const padding = isSmallScreen ? 15 : 25;
const paddingTop = isSmallScreen ? 20 : 40;

const InputField = ({
  icon,
  placeholder,
  isPassword = false,
  iconColor,
}: any) => (
  <View style={styles.inputContainer}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      secureTextEntry={isPassword}
    />
  </View>
);

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <BackgroundLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: padding, paddingTop: paddingTop },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require("../assets/icon/logo_halaman_depan.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Gas Mancing</Text>
          </View>

          {/* PAGE TITLE */}
          <Text style={styles.pageTitle}>Sign Up</Text>

          {/* FORM CARD DENGAN GRADIENT */}
          <LinearGradient
            colors={["#2A5CA8", "#06162e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >
            {/* 1. Email */}
            <InputField
              icon="mail"
              placeholder="Enter your email"
              iconColor="#000000"
            />

            {/* 2. Username */}
            <InputField
              icon="person"
              placeholder="Enter your username"
              iconColor="#000000"
            />

            {/* 3. Phone */}
            <InputField
              icon="call"
              placeholder="Enter your phone"
              iconColor="#000000"
            />

            {/* 4. Password */}
            <InputField
              icon="lock-closed"
              placeholder="Enter your password"
              isPassword={true}
              iconColor="#000000"
            />

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => router.replace("/(tabs)")}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  logoImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: "black",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },

  // TITLE
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 25,
  },

  // CARD (Gradient Style)
  formCard: {
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: "100%",
    elevation: 15,
    shadowColor: "#051226",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  // INPUT
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 44,
  },
  iconWrapper: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },

  // BUTTON
  submitButton: {
    backgroundColor: "#6495ED",
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
