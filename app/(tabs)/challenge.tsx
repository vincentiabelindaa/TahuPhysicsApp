import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Data Tantangan (Biar codingnya rapi, kita buat array object)
const CHALLENGES_DATA = [
  {
    id: 'challenge_1',
    title: 'Tantangan #1: Kriteria Dasar',
    description: 'Atur Massa = 5 kg. Buat lintasan dengan minimal 1 Bukit (hill) dan 1 Lembah (valley), lalu selesaikan lintasannya!',
  },
  {
    id: 'challenge_2',
    title: 'Tantangan #2: Lintasan Kompleks',
    description: 'Atur Massa = 5 kg. Buat lintasan dengan minimal 3 Lembah, 2 Turun, dan 3 Naik, lalu selesaikan lintasannya!',
  },
];

export default function ChallengeScreen() {
  const router = useRouter();
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  // 1. Load data progress saat aplikasi dibuka
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('completedChallenges');
      if (jsonValue != null) {
        setCompletedChallenges(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Gagal load data", e);
    }
  };

  // 2. Fungsi Mulai Tantangan
  const handleStart = async (challengeId: string) => {
    try {
      // Simpan challenge mana yang sedang aktif (mirip logic web kamu)
      await AsyncStorage.setItem('activeChallenge', challengeId);
      
      // Pindah ke halaman Virtual Lab
      // Pastikan nama filenya 'lab.tsx' sesuai layout sebelumnya
      router.push('/lab'); 
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Fungsi Reset Tantangan
  const handleReset = async (challengeId: string) => {
    try {
      // Filter array: buang ID yang mau di-reset
      const newStatus = completedChallenges.filter(id => id !== challengeId);
      setCompletedChallenges(newStatus);
      
      // Simpan status baru ke storage
      await AsyncStorage.setItem('completedChallenges', JSON.stringify(newStatus));
      
      Alert.alert("Reset Berhasil", "Tantangan bisa dikerjakan ulang.");
    } catch (e) {
      console.error(e);
    }
  };

  // --- Render UI ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tantangan Fisika</Text>
        <Text style={styles.headerSubtitle}>
          Uji pemahamanmu! Selesaikan semua tantangan menggunakan Virtual Lab.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {CHALLENGES_DATA.map((item) => {
          const isCompleted = completedChallenges.includes(item.id);

          return (
            <View key={item.id} style={styles.card}>
              
              {/* Badge Selesai (Posisi Absolute di pojok kanan) */}
              {isCompleted && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>✅ Selesai</Text>
                </View>
              )}

              <Text style={styles.cardTitle}>{item.title}</Text>
              
              <Text style={styles.cardDesc}>
                {item.description}
              </Text>

              {/* Logic Tombol: Jika selesai -> Reset, Jika belum -> Mulai */}
              {isCompleted ? (
                <TouchableOpacity 
                  style={styles.resetBtn} 
                  onPress={() => handleReset(item.id)}
                >
                  <Text style={styles.resetBtnText}>Coba Lagi</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.startBtn} 
                  onPress={() => handleStart(item.id)}
                >
                  <Text style={styles.startBtnText}>Mulai Kerjakan!</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Footer sederhana */}
        <Text style={styles.footerText}>
          © 2025 TahuPhysics Mobile
        </Text>
      </ScrollView>
    </View>
  );
}

// --- Styling (Mirip CSS kamu tapi versi React Native) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Background abu-abu muda
  },
  header: {
    padding: 20,
    paddingTop: 60, // Biar ga ketutup status bar
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d47a1', // Warna biru tua sesuai web
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#bbdefb', // Border biru muda
    // Shadow style (Android & iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3, 
    position: 'relative', // Penting buat badge absolute
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 10,
    paddingRight: 60, // Biar judul ga nabrak badge
  },
  cardDesc: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22, // Spasi antar baris biar enak dibaca
    marginBottom: 20,
  },
  // Tombol Mulai (Biru Solid)
  startBtn: {
    backgroundColor: '#42a5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Tombol Reset (Biru Pucat)
  resetBtn: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  resetBtnText: {
    color: '#1e88e5',
    fontWeight: '600',
    fontSize: 16,
  },
  // Badge Selesai
  badgeContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  badgeText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
  }
});