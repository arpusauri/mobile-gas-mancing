import React from 'react';
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
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Import Gradient

// IMPORT COMPONENT BACKGROUND
import BackgroundLayout from '../components/BackgroundLayout'; 

const { width } = Dimensions.get('window');

const InputField = ({ icon, placeholder, isPassword = false, iconColor }: any) => (
  <View style={styles.inputContainer}>
    {/* Icon Wrapper */}
    <View style={styles.iconWrapper}>
       <Ionicons name={icon} size={24} color={iconColor} />
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

  return (
    <BackgroundLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require('../assets/icon/logo_halaman_depan.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Gas Mancing</Text>
          </View>

          {/* PAGE TITLE */}
          <Text style={styles.pageTitle}>Sign Up</Text>

          {/* FORM CARD DENGAN GRADIENT */}
          {/* Perhatikan colors=['#2A5CA8', '#081833'] untuk efek cahaya dari atas */}
          <LinearGradient
            colors={['#2A5CA8', '#06162e']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >

            {/* 1. Email (Merah Bata) */}
            <InputField
              icon="mail" 
              placeholder="Enter your email"
              iconColor="#000000" 
            />

            {/* 2. Username (Disamakan Tone-nya jadi Oranye Tua) */}
            {/* Sebelumnya Coklat, sekarang Oranye agar 'Selaras' dengan tema warm */}
            <InputField
              icon="person" 
              placeholder="Enter your username"
              iconColor="#000000" 
            />

            {/* 3. Phone (Oranye Kemerahan) */}
            <InputField
              icon="call" 
              placeholder="Enter your phone"
              iconColor="#000000" 
            />

            {/* 4. Password (Merah Tua) */}
            <InputField
              icon="lock-closed" 
              placeholder="Enter your password"
              isPassword={true}
              iconColor="#000000" 
            />

            {/* SUBMIT BUTTON */}
            <TouchableOpacity style={styles.submitButton} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

          </LinearGradient>

        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 35,
    height: 35,
    marginRight: 10,
    tintColor: 'black' 
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },

  // TITLE
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },

  // CARD (Gradient Style)
  formCard: {
    // Background color dihapus karena sudah diganti LinearGradient di component
    borderRadius: 30,
    paddingVertical: 35,
    paddingHorizontal: 25,
    width: '100%',
    // Shadow
    elevation: 20, // Lebih tebal shadow-nya
    shadowColor: '#051226',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },

  // INPUT
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 30, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4, 
    marginBottom: 18, 
    height: 48,
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

  // BUTTON
  submitButton: {
    backgroundColor: '#6495ED', // Cornflower Blue (Mirip desain tombol yang soft)
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 15,
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