import { auth, db } from '@/firebaseConfig'; // Import auth & db
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Fungsi bikin akun
import { doc, setDoc } from 'firebase/firestore'; // Fungsi simpan data ke database
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validasi
    if (!name || !email || !password) {
      Alert.alert('Eits!', 'Nama, Email, dan Password wajib diisi semua ya.');
      return;
    }

    setLoading(true);

    try {
      // 2. Buat User di Auth (Ini biasanya cepet)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Auth Berhasil:', user.email);

      // --- PERUBAHAN DI SINI ---
      
      // 3. JANGAN pakai 'await' untuk setDoc supaya UI tidak macet nungguin database.
      // Biarkan dia jalan di background.
      setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      }).then(() => {
         console.log("Simpan data di background sukses");
      }).catch((err) => {
         console.error("Gagal simpan data background:", err);
      });

      // 4. MATIKAN LOADING LANGSUNG
      setLoading(false);

      // 5. Langsung kasih tau sukses & Pindah
      Alert.alert('Berhasil!', 'Akunmu sudah jadi. Yuk masuk!', [
        { text: 'OK', onPress: () => router.replace('/') } 
      ]);

    } catch (error: any) {
      // Kalau Auth gagal, baru kita handle error
      setLoading(false); // Matikan loading kalau error
      console.error(error);
      let errorMessage = 'Gagal mendaftar.';

      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email ini sudah terdaftar lho.';
      if (error.code === 'auth/invalid-email') errorMessage = 'Format emailnya salah.';
      if (error.code === 'auth/weak-password') errorMessage = 'Password terlalu lemah (min. 6 karakter).';

      Alert.alert('Gagal Daftar', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER SEDERHANA */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            <Image 
                source={require('@/assets/images/tahu.jpg')} 
                style={styles.logo} 
            />
            <Text style={styles.title}>Daftar Akun Baru</Text>
            <Text style={styles.subtitle}>Gabung TahuPhysics sekarang!</Text>

            {/* FORM INPUT */}
            <View style={styles.form}>
            
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
                style={styles.input}
                placeholder="Nama panggilanmu siapa?"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Contoh: budi@gmail.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Minimal 6 karakter"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* TOMBOL DAFTAR */}
            <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                <Text style={styles.registerButtonText}>Buat Akun</Text>
                )}
            </TouchableOpacity>

            {/* LINK LOGIN */}
            <View style={styles.footerLink}>
                <Text style={styles.footerText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Masuk di sini</Text>
                </TouchableOpacity>
            </View>

            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES (Soft Vibrant Theme - Register) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40, 
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  content: {
    padding: 25,
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#00897B', // Pakai Hijau Tosca (Vibrant Soft) biar beda dikit sama Login
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#00897B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#00897B',
    fontWeight: 'bold',
    fontSize: 14,
  }
});