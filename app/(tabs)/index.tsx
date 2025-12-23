import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- PALET WARNA "SOFT VIBRANT" (Tidak Pucat, Tidak Ngejreng) ---
const colors = {
  // Warna Tombol (Lebih hidup, support teks putih)
  blueBtn: '#4BA3EB',    // Soft Blue
  mintBtn: '#4DB6AC',    // Soft Teal
  orangeBtn: '#FF9F43',  // Soft Orange
  purpleBtn: '#A55EEA',  // Soft Violet

  // Warna Background Icon/Badge (Tetap sangat muda biar kontras)
  blueBg: '#EDF7FF',     
  mintBg: '#EDF9F8',     
  orangeBg: '#FFF5EB',    
  purpleBg: '#F6F0FD',   

  btnText: '#FFFFFF',    // BALIK KE PUTIH (Kunci biar terlihat aktif)
};

export default function HomeScreen() {
  return (
    <SafeAreaView 
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: '#f0f8ff' }} // Background sedikit lebih bersih
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER (ORIGINAL) --- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('@/assets/images/tahu.jpg')} 
              style={styles.logo}
            />
            <View>
              <Text style={styles.headerTitle}>TahuPhysics</Text>
              <Text style={styles.headerSubtitle}>Halo, Selamat Datang!👋</Text>
            </View>
          </View>
          <Link href="/profile" asChild>
            <TouchableOpacity>
              <Ionicons name="person-circle-outline" size={36} color="#0d47a1" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* --- KONTEN UTAMA --- */}
        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Mulai Belajar</Text>
          <Text style={styles.sectionDesc}>
            Mulai petualanganmu belajar Fisika topik Usaha dan Energi.
          </Text>
          
          <View style={styles.cardContainer}>
            
            {/* Kartu 1: Playlist (Soft Blue) */}
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextContent}>
                   <View style={[styles.iconBadge, { backgroundColor: colors.blueBg }]}>
                      <Ionicons name="play" size={24} color={colors.blueBtn} />
                   </View>
                   <Text style={styles.cardTitle}>Materi Playlist</Text>
                   <Text style={styles.cardDesc}>Tonton video pembelajaran interaktif konsep Usaha dan Energi.</Text>
                </View>
                <Ionicons name="play-circle-outline" size={80} color={colors.blueBg} style={styles.bgIcon} />
              </View>
              <Link href="/playlist" asChild>
                <TouchableOpacity style={styles.btnBlue}>
                  <Text style={styles.actionButtonText}>Lihat Materi</Text>
                  {/* Ikon panah putih */}
                  <Ionicons name="arrow-forward" size={16} color={colors.btnText} />
                </TouchableOpacity>
              </Link>
            </View>

            {/* Kartu 2: Virtual Lab (Soft Teal) */}
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextContent}>
                   <View style={[styles.iconBadge, { backgroundColor: colors.mintBg }]}>
                      <Ionicons name="flask" size={24} color={colors.mintBtn} />
                   </View>
                   <Text style={styles.cardTitle}>Virtual Lab</Text>
                   <Text style={styles.cardDesc}>Simulasikan energi kinetik & potensial secara interaktif.</Text>
                </View>
                <Ionicons name="flask-outline" size={80} color={colors.mintBg} style={styles.bgIcon} />
              </View>
              <Link href="/lab" asChild>
                <TouchableOpacity style={styles.btnMint}>
                  <Text style={styles.actionButtonText}>Masuk Lab</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.btnText} />
                </TouchableOpacity>
              </Link>
            </View>
            
            {/* Kartu 3: Quiz (Soft Orange) */}
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextContent}>
                   <View style={[styles.iconBadge, { backgroundColor: colors.orangeBg }]}>
                      <Ionicons name="help-circle" size={24} color={colors.orangeBtn} />
                   </View>
                   <Text style={styles.cardTitle}>Quiz</Text>
                   <Text style={styles.cardDesc}>Tes kemampuanmu melalui kuis interaktif.</Text>
                </View>
                <Ionicons name="school-outline" size={80} color={colors.orangeBg} style={styles.bgIcon} />
              </View>
              <Link href="/quiz" asChild>
                <TouchableOpacity style={styles.btnOrange}>
                  <Text style={styles.actionButtonText}>Mulai Kuis</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.btnText} />
                </TouchableOpacity>
              </Link>
            </View>

            {/* Kartu 4: Challenge (Soft Violet) */}
            <View style={styles.card}>
              <View style={styles.cardRow}>
                 <View style={styles.cardTextContent}>
                   <View style={[styles.iconBadge, { backgroundColor: colors.purpleBg }]}>
                      <Ionicons name="trophy" size={24} color={colors.purpleBtn} />
                   </View>
                   <Text style={styles.cardTitle}>Tantangan</Text>
                   <Text style={styles.cardDesc}>Uji pemahamanmu dengan tantangan melalui Virtual Lab.</Text>
                </View>
                <Ionicons name="trophy-outline" size={80} color={colors.purpleBg} style={styles.bgIcon} />
              </View>
              <Link href="/challenge" asChild>
                <TouchableOpacity style={styles.btnPurple}>
                  <Text style={styles.actionButtonText}>Mulai Tantangan</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.btnText} />
                </TouchableOpacity>
              </Link>
            </View>

          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 IndiBelin | All rights reserved</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 50 },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 70, height: 45, borderRadius: 0, marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0d47a1' },
  headerSubtitle: { fontSize: 14, color: '#666' },
  mainContent: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  sectionDesc: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  cardContainer: { gap: 16 },
  
  // --- CARD STYLES ---
  card: {
    backgroundColor: '#fff',
    borderRadius: 16, 
    padding: 15,
    // Shadow sedikit lebih tegas dari sebelumnya
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3, 
    overflow: 'hidden', 
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    position: 'relative',
  },
  cardTextContent: { flex: 1, paddingRight: 10, zIndex: 2 },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bgIcon: {
    position: 'absolute',
    right: -15,
    top: -10,
    opacity: 100, // Sedikit lebih terlihat
    transform: [{ rotate: '-10deg' }, { scale: 1.1 }] // Sedikit lebih besar
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#777', lineHeight: 18 },

  // --- TOMBOL SOFT VIBRANT ---
  // Teks tombol KEMBALI PUTIH
  actionButtonText: {
    color: colors.btnText,
    fontWeight: '700',
    fontSize: 14,
  },
  
  // Warna-warni Soft Vibrant
  btnBlue: {
    backgroundColor: colors.blueBtn, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12, borderRadius: 12, gap: 8,
  },
  btnMint: {
    backgroundColor: colors.mintBtn, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12, borderRadius: 12, gap: 8,
  },
  btnOrange: {
    backgroundColor: colors.orangeBtn, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12, borderRadius: 12, gap: 8,
  },
  btnPurple: {
    backgroundColor: colors.purpleBtn, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12, borderRadius: 12, gap: 8,
  },

  footer: { marginTop: 10, alignItems: 'center', padding: 20 },
  footerText: { color: '#999', fontSize: 12 }
});