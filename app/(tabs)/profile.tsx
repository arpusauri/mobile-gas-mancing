import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { Stack } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 

import BackgroundLayout from '../../components/BackgroundLayout'; 

const { width } = Dimensions.get('window');

// Komponen Input Field (sama seperti di Sign In agar konsisten)
const InputField = ({ icon, placeholder, isPassword = false, iconColor, keyboardType = 'default' }: any) => (
  <View style={styles.inputContainer}>
    <View style={styles.iconWrapper}>
       <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      secureTextEntry={isPassword}
      keyboardType={keyboardType}
    />
  </View>
);

export default function UserProfileScreen() {
  return (
    <BackgroundLayout>
      {/* Hilangkan Header bawaan agar tampilan bersih & full screen */}
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >

          {/* HEADER HALAMAN */}
          <View style={styles.header}>
            <Ionicons name="person" size={32} color="black" style={{ marginRight: 10 }} />
            <Text style={styles.pageTitle}>Profile</Text>
          </View>

          {/* FORM CARD (GRADIENT) */}
          <LinearGradient
            colors={['#2A5CA8', '#06162e']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >
            {/* 1. Email */}
            <InputField
              icon="mail" 
              placeholder="Enter your email"
              iconColor="#000000" 
              keyboardType="email-address"
            />

            {/* 2. Username */}
            <InputField
              icon="person" 
              placeholder="Enter your username"
              iconColor="#000000" 
            />

            {/* 3. Phone Number */}
            <InputField
              icon="call" 
              placeholder="Enter your phone"
              iconColor="#000000" 
              keyboardType="phone-pad"
            />

            {/* 4. Password */}
            <InputField
              icon="lock-closed" 
              placeholder="Enter your password"
              isPassword={true}
              iconColor="#000000" 
            />

            {/* SUBMIT BUTTON */}
            <TouchableOpacity style={styles.submitButton} onPress={() => alert('Profile Updated!')}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

          </LinearGradient>

          {/* Spacer Bawah agar tidak tertutup Tab Bar */}
          <View style={{ height: 100 }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Konten di tengah vertikal
    paddingHorizontal: 25,
    paddingTop: 40, 
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 20, // Sedikit jarak dari atas layar
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },

  formCard: {
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 25,
    width: '100%',
    elevation: 20,
    shadowColor: '#051226',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },

  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 30, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4, 
    marginBottom: 20, // Jarak antar input
    height: 50,
  },
  iconWrapper: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },

  submitButton: {
    backgroundColor: '#6495ED', 
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: 'center',
    width: '60%', 
    alignSelf: 'center', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});