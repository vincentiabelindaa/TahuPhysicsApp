import { auth } from '@/firebaseConfig'; // Import auth dari file temanmu
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import fungsi login
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  
  // State untuk inputan user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LOGIC LOGIN FIREBASE DI SINI ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eits!', 'Email dan Password harus diisi ya.');
      return;
    }

    setLoading(true); // Tampilkan loading muter-muter

    try {
      // 1. Panggil fungsi login Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Kalau sukses, userCredential berisi data user
      console.log('Login sukses:', userCredential.user.email);
      
      // 3. Pindah ke halaman Home (sesuaikan link-nya, misal '/' atau '/(tabs)')
      router.replace('/'); 
      
    } catch (error: any) {
      // 4. Kalau gagal, tangkap errornya
      console.error(error);
      let errorMessage = 'Terjadi kesalahan saat login.';
      
      if (error.code === 'auth/invalid-email') errorMessage = 'Format email salah.';
      if (error.code === 'auth/user-not-found') errorMessage = 'User tidak ditemukan. Daftar dulu yuk!';
      if (error.code === 'auth/wrong-password') errorMessage = 'Password salah nih.';
      if (error.code === 'auth/invalid-credential') errorMessage = 'Email atau password salah.';

      Alert.alert('Gagal Login', errorMessage);
    } finally {
      setLoading(false); // Matikan loading
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* LOGO & JUDUL */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/tahu.jpg')} 
            style={styles.logo} 
          />
          <Text style={styles.title}>TahuPhysics</Text>
          <Text style={styles.subtitle}>Masuk untuk mulai belajar</Text>
        </View>

        {/* FORM INPUT */}
        <View style={styles.form}>
          
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
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* TOMBOL LOGIN */}
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading} // Cegah klik dobel pas loading
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Masuk Sekarang</Text>
            )}
          </TouchableOpacity>

          {/* LINK DAFTAR */}
          <View style={styles.footerLink}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            {/* Arahkan ke halaman register nanti */}
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>Daftar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

// --- STYLES (Soft Vibrant Theme) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 25,
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4BA3EB', // Soft Blue Vibrant
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4BA3EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  loginButtonText: {
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
    color: '#4BA3EB',
    fontWeight: 'bold',
    fontSize: 14,
  }
});