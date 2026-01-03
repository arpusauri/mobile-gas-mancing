import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Background Gradient Navbar */}
      <LinearGradient
        colors={['#133E87', '#050F21']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          
          // Icon Mapping
          let iconName: any = 'home';
          if (route.name === 'index') iconName = 'home'; 
          else if (route.name === 'cart') iconName = 'cart'; 
          else if (route.name === 'ensiklopedia') iconName = 'bookmark'; 
          else if (route.name === 'profile') iconName = 'person';

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrapper}>
                
                {/* Gambar Gelembung hanya muncul pas Aktif (isFocused) */}
                {isFocused && (
                    <Image 
                        // Pastikan path gambarnya benar
                        source={require('../assets/icon/gelembung-icon-navbar.png')} 
                        style={styles.activeBubbleImage}
                        resizeMode="contain"
                    />
                )}

                {/* ICON UTAMA */}
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color="white" // <--- DIBUAT TETAP PUTIH
                  style={{ zIndex: 2 }} // Pastikan icon di atas gambar
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  gradient: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    borderRadius: 35,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeBubbleImage: {
    position: 'absolute',
    width: 60,  // Sesuaikan besar gelembungnya di sini
    height: 60,
    top: -5,    // Geser naik/turun biar pas tengah
    zIndex: 1,
  }
});