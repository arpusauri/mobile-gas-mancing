import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import { Link, router } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Pastikan path ini benar sesuai struktur folder Anda
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* --- Bagian Judul Utama --- */}
      <ThemedView style={styles.titleContainer}>
        <View>
          <ThemedText type="subtitle" style={{ opacity: 0.7 }}>Welcome back,</ThemedText>
          <ThemedText type="title">User!</ThemedText>
        </View>
        <TouchableOpacity style={styles.profileIcon}>
           <IconSymbol name="person.crop.circle" size={32} color={iconColor} />
        </TouchableOpacity>
      </ThemedView>

      {/* --- Bagian Grid Menu (Quick Actions) --- */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.gridContainer}>
          {/* Menu 1 */}
          <View style={[styles.gridItem, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }]}>
            <IconSymbol name="star.fill" size={24} color="#FFD700" />
            <ThemedText style={styles.gridText}>Favorites</ThemedText>
          </View>
          {/* Menu 2 */}
          <View style={[styles.gridItem, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }]}>
            <IconSymbol name="bell.fill" size={24} color="#FF6347" />
            <ThemedText style={styles.gridText}>Alerts</ThemedText>
          </View>
          {/* Menu 3 */}
          <View style={[styles.gridItem, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }]}>
             <IconSymbol name="gear" size={24} color={iconColor} />
            <ThemedText style={styles.gridText}>Settings</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* --- Bagian Info Card --- */}
      <ThemedView style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#E8F4FD' }]}>
           <ThemedText type="subtitle" style={{ color: colorScheme === 'dark' ? '#fff' : '#007AFF' }}>
             New Updates Available
           </ThemedText>
           <ThemedText style={{ marginTop: 4, opacity: 0.8 }}>
             Check out the new explore tab to see the latest changes in the UI library.
           </ThemedText>
        </View>
      </ThemedView>

      {/* --- Bagian Tombol Modal (CTA) --- */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Interaction</ThemedText>
        
        <Link href="/modal" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>Open Modal Demo</ThemedText>
            <IconSymbol name="arrow.right" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
        
        <ThemedText style={{ textAlign: 'center', opacity: 0.6, marginTop: 10, fontSize: 12 }}>
          Tap above to test the modal navigation
        </ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    padding: 8,
  },
  sectionContainer: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Elevation untuk Android
    elevation: 2,
  },
  gridText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});