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
import { LinearGradient } from 'expo-linear-gradient'; 

// IMPORT COMPONENT BACKGROUND (Pastikan path-nya sesuai struktur foldermu)
import BackgroundLayout from '../components/BackgroundLayout'; 

const { width } = Dimensions.get('window');

// Komponen InputField (Sama persis dengan Sign Up)
const InputField = ({ icon, placeholder, isPassword = false, iconColor }: any) => (
  <View style={styles.inputContainer}>
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

export default function SignInScreen() {
  const router = useRouter();

  return (
    <BackgroundLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* HEADER (Logo & Text) */}
          <View style={styles.header}>
            <Image
              source={require('../assets/icon/logo_halaman_depan.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Gas Mancing</Text>
          </View>

          {/* PAGE TITLE */}
          <Text style={styles.pageTitle}>Sign In</Text>

          {/* FORM CARD (GRADIENT) */}
          <LinearGradient
            colors={['#2A5CA8', '#06162e']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >

            {/* 1. Email (Merah Bata - Sesuai gambar referensi Sign In) */}
            <InputField
              icon="mail" 
              placeholder="Enter your email"
              iconColor="#000000" 
            />

            {/* 2. Password (Merah Tua - Sesuai gambar referensi Sign In) */}
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
          
          {/* Opsi Tambahan (Optional: Forgot Password / Register Link) */}
          <View style={styles.footerLinks}>
             <TouchableOpacity onPress={() => router.push('/Signup')}>
                <Text style={styles.linkText}>Don't have an account? <Text style={styles.boldLink}>Sign Up</Text></Text>
             </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 80, // Sedikit lebih turun dibanding Sign Up karena formnya lebih pendek
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },

  // CARD GRADIENT
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

  // INPUT STYLES
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 30, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4, 
    marginBottom: 25, // Jarak antar input sedikit lebih lega karena cuma 2 field
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

  // BUTTON
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

  // FOOTER LINKS (Tambahan agar UX lebih baik)
  footerLinks: {
    marginTop: 30,
    alignItems: 'center',
  },
  linkText: {
    color: '#333',
    fontSize: 14,
  },
  boldLink: {
    fontWeight: 'bold',
    color: '#2A5CA8',
  }
});