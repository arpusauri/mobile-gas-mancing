import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  ImageBackground,
  Image 
} from 'react-native';
import { Stack } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


// IMPORT COMPONENT BACKGROUND
import BackgroundLayout from '../components/BackgroundLayout'; 

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

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const carouselData = [
  require('../assets/images/tempat1.jpg'), 
  require('../assets/images/tempat2.jpg'),
  require('../assets/images/tempat3.jpg'),
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigasi ke Sign Up
  const handleSignUp = () => {
    // Pastikan nama file kamu 'sign-up.tsx' atau sesuaikan string ini
    router.push('/Signup'); 
  };

  return (
    <BackgroundLayout>
      <Stack.Screen options={{ headerShown: false }} /> 
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* CAROUSEL SECTION */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={width}
              height={height * 0.45}
              autoPlay={true}
              autoPlayInterval={3000}
              data={carouselData}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <View style={styles.carouselItemWrapper}>
                    <View style={styles.cardContainer}>
                        <ImageBackground
                          source={item} 
                          style={styles.cardImage}
                          imageStyle={{ borderRadius: 30 }}
                        >
                        <View style={styles.cardOverlay}>
                            <Image 
                              source={require('../assets/icon/logo_halaman_depan.png')} 
                              style={styles.logoImage} 
                              resizeMode="contain" 
                            />
                        </View>
                        </ImageBackground>
                    </View>
                </View>
              )}
            />
          </View>

          {/* DOTS INDICATOR */}
          <View style={styles.dotsContainer}>
            {carouselData.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  currentIndex === index ? styles.dotActive : styles.dotInactive
                ]} 
              />
            ))}
          </View>

          {/* TEXT SECTION */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>
              WELCOME TO <Text style={styles.highlightText}>GASMANCING</Text>{'\n'}
              Fish Anywhere in The World.
            </Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.descriptionText}>
              Discover thousands of secret fishing spots and join the largest global community of passionate anglers.
            </Text>
          </View>

          {/* BUTTON SECTION */}
          <View style={styles.buttonContainer}>
            {/* Tombol Sign Up */}
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpText}>SIGN UP</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              
              {/* === BAGIAN YANG DIUPDATE === */}
              {/* Mengarahkan ke file sign-in.tsx */}
              <TouchableOpacity onPress={() => router.push('/Signin')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
              {/* =========================== */}
              
            </View>
          </View>

          <View style={{height: 150}} /> 

        </ScrollView>
      </SafeAreaView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  carouselContainer: {
     marginTop: isSmallScreen ? 20 : height * 0.08, 
     height: height * 0.45 
  },
  carouselItemWrapper: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cardContainer: {
    width: width * 0.82, 
    height: '100%',
    borderRadius: 35,
    elevation: 15,
    shadowColor: "#0d2b5c",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    backgroundColor: 'white', 
  },
  cardImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    overflow: 'hidden',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: width * 0.3, 
    height: width * 0.3,
    tintColor: 'white',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#164081',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D1D5DB',
  },
  textContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  titleText: {
    fontSize: width * 0.06,
    fontWeight: '800',
    textAlign: 'center',
    color: '#000',
    lineHeight: width * 0.08,
  },
  highlightText: {
    color: '#164081',
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: '#000',
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 2,
  },
  descriptionText: {
    textAlign: 'center',
    color: '#4B5563',
    fontSize: width * 0.035,
    lineHeight: width * 0.055,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: height * 0.04,
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#164081',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#164081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: 'row',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signInLink: {
    color: '#3B95D5',
    fontWeight: 'bold',
    fontSize: 14,
  },
});