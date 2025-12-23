import { auth, db } from '@/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router'; // Tambah import Stack
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
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
      // 2. Buat User di Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Auth Berhasil:', user.email);

      // 3. Simpan data di background (Tanpa await biar UI gak macet)
      setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      }).then(() => {
         console.log("Simpan data di background sukses");
      }).catch((err) => {
         console.error("Gagal simpan data background:", err);
      });

      // 4. Matikan Loading & Pindah
      setLoading(false);

      Alert.alert('Berhasil!', 'Akunmu sudah jadi. Yuk masuk!', [
        { text: 'OK', onPress: () => router.replace('/') } // Balik ke Login (index)
      ]);

    } catch (error: any) {
      setLoading(false);
      console.error(error);
      let errorMessage = 'Gagal mendaftar.';

      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email ini sudah terdaftar lho.';
      if (error.code === 'auth/invalid-email') errorMessage = 'Format emailnya salah.';
      if (error.code === 'auth/weak-password') errorMessage = 'Password terlalu lemah (min. 6 karakter).';

      Alert.alert('Gagal Daftar', errorMessage);
    }
  };

  return (
    <>
      {/* 1. HILANGKAN HEADER BAWAAN */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* 2. TOMBOL BACK (Style Baru: Chevron) */}
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 3. CARD CONTAINER (Kotak Putih) */}
            <View style={styles.card}>
                
                {/* LOGO & JUDUL */}
                <View style={styles.headerCenter}>
                    <Image 
                        source={require('@/assets/images/tahu.jpg')} 
                        style={styles.logo} 
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Daftar Akun</Text>
                    <Text style={styles.subtitle}>Gabung TahuPhysics sekarang!</Text>
                </View>

                {/* FORM INPUT */}
                <View style={styles.form}>
                
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nama panggilanmu siapa?"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#aaa"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Contoh: budi@gmail.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#aaa"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Minimal 6 karakter"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#aaa"
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
                             <Text style={styles.linkText}>Masuk</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

// --- STYLES (Sama Persis dengan Login, cuma beda warna tombol) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Background luar abu/biru muda
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerNav: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginTop: 40, 
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerCenter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
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
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#00897B', // Hijau Tosca (Biar beda dikit sama Login)
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00897B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#00897B', // Samain warna text link sama tombol
    fontWeight: 'bold',
    fontSize: 14,
  }
});