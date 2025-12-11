import { Link } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* --- BAGIAN HEADER (Pengganti Sidebar Header) --- */}
        {/* --- HEADER --- */}
        <View style={styles.header}>
          
          {/* BAGIAN KIRI: Logo & Judul */}
          <View style={styles.headerLeft}>
            <Image 
              source={require('@/assets/images/tahu.jpg')} 
              style={styles.logo}
            />
            <View>
              <Text style={[styles.headerTitle, ]}>
                TahuPhysics
              </Text>
              <Text style={styles.headerSubtitle}>Belajar Fisika Jadi Mudah</Text>
            </View>
          </View>

          {/* BAGIAN KANAN: Ikon Profil */}
          <Link href="/profile" asChild>
            <TouchableOpacity>
              <Ionicons name="person-circle-outline" size={36} color="#0d47a1" />
            </TouchableOpacity>
          </Link>
          
        </View>

        {/* --- BAGIAN PROFIL SINGKAT --- */}
        <View style={styles.profileSection}>
          <Image 
            // Pastikan profile.jpg ada di assets/images
            source={require('@/assets/images/profile.jpg')} 
            style={styles.profileImage} 
          />
          <View>
            <Text style={styles.welcomeText}>Halo, Selamat Datang! 👋</Text>
            {/* Nanti ini kita ganti pakai data Firebase asli */}
            <Text style={styles.userName}>Guest User</Text>
          </View>
        </View>

        {/* --- KONTEN UTAMA --- */}
        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Mulai Belajar</Text>
          <Text style={styles.sectionDesc}>
            Mulai petualanganmu belajar Fisika topik Usaha dan Energi. Pilih menu di bawah ini:
          </Text>

          {/* --- FEATURE CARDS (Grid Menu) --- */}
          <View style={styles.cardContainer}>
            
            {/* Kartu 1: Playlist */}
            {/* Link href belum ada filenya, nanti error kalau diklik sebelum filenya dibuat */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Materi Playlist</Text>
              <Text style={styles.cardDesc}>Tonton video pembelajaran interaktif konsep Usaha dan Energi.</Text>
              <Link href="/playlist" asChild>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Lihat Materi</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Kartu 2: Virtual Lab */}
            {/* Mengarah ke /lab (sesuai file yang kita rename tadi) */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Virtual Lab</Text>
              <Text style={styles.cardDesc}>Simulasikan Energi Kinetik & Potensial secara interaktif.</Text>
              <Link href="/lab" asChild>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Masuk Lab</Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            {/* Kartu 3: Quiz */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quiz</Text>
              <Text style={styles.cardDesc}>Tes kemampuanmu melalui kuis interaktif.</Text>
              <Link href="/quiz" asChild>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Mulai Kuis</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Kartu 4: Challenge */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tantangan</Text>
              <Text style={styles.cardDesc}>Uji pemahamanmu dengan tantangan menggunakan Virtual Lab.</Text>
              <Link href="/challenge" asChild>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Mulai Tantangan</Text>
                </TouchableOpacity>
              </Link>
            </View>

          </View>
        </View>

        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 IndiBelin | All rights reserved</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLE (CSS-nya Mobile) ---
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',       // Susun ke samping
    alignItems: 'center',       // Rata tengah vertikal
    justifyContent: 'space-between', // PENTING: Logo kiri, Profil kanan
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e3f2fd', // Warna biru muda ala TahuPhysics
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  welcomeText: {
    fontSize: 14,
    color: '#555',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mainContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionDesc: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  cardContainer: {
    gap: 20, // Jarak antar kartu
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: -10,
    borderWidth: 2,
    borderColor: '#bbdefb', // Border biru muda
    // Shadow style (Android & iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3, 
    position: 'relative'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#42a5f5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  }
});