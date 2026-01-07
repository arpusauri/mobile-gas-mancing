import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundLayout from "../components/BackgroundLayout";

const { width, height } = Dimensions.get("window");
const isSmallScreen = height < 700;

export default function OnboardingScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (token && userId) {
        router.replace("/(tabs)");
      }
    };

    checkLogin();
  }, []);

  const handleSignUp = () => router.push("/Signup");
  const handleSignIn = () => router.push("/Signin");

  return (
    <BackgroundLayout>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center", // <- ini bikin konten di tengah
            alignItems: "center",
            paddingHorizontal: 25,
            paddingVertical: 30,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* WELCOME TEXT */}
          <View style={{ alignItems: "center", marginBottom: 30 }}>
            <Text style={styles.titleText}>
              WELCOME TO <Text style={styles.highlightText}>GASMANCING</Text>
            </Text>
            <Text style={styles.subtitleText}>Fish Anywhere in The World</Text>
          </View>

          {/* DESCRIPTION + BUTTONS */}
          <View style={{ alignItems: "center", width: "100%" }}>
            <Text style={styles.descriptionText}>
              Discover thousands of secret fishing spots and join the largest
              global community of passionate anglers.
            </Text>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpText}>SIGN UP</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 25,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  titleText: {
    fontSize: width * 0.08,
    fontWeight: "800",
    textAlign: "center",
    color: "#000",
  },
  highlightText: {
    color: "#164081",
  },
  subtitleText: {
    fontSize: width * 0.045,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 40,
    fontWeight: "600",
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: "#000",
    borderRadius: 2,
    marginVertical: 20,
  },
  descriptionText: {
    fontSize: width * 0.036,
    textAlign: "center",
    color: "#4B5563",
    lineHeight: 24,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  signUpButton: {
    backgroundColor: "#164081",
    width: "100%",
    maxWidth: 300,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#164081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3B95D5",
  },
});
