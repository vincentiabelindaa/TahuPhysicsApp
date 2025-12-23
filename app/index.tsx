import { auth } from '@/firebaseConfig';
import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
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

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); 

  // --- CEK STATUS LOGIN (AUTO REDIRECT) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Kalau user ada, langsung lempar ke Dashboard
        router.replace('/(tabs)'); 
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eits!', 'Email dan Password harus diisi ya.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Router otomatis pindah karena useEffect di atas
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Terjadi kesalahan saat login.';
      if (error.code === 'auth/invalid-email') errorMessage = 'Format email salah.';
      if (error.code === 'auth/user-not-found') errorMessage = 'User tidak ditemukan.';
      if (error.code === 'auth/wrong-password') errorMessage = 'Password salah.';
      if (error.code === 'auth/invalid-credential') errorMessage = 'Email atau password salah.';
      Alert.alert('Gagal Login', errorMessage);
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#F0F4F8'}}>
        <ActivityIndicator size="large" color="#4BA3EB" />
      </View>
    );
  }

  return (
    <>
      {/* Matikan Header Bawaan */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* CARD CONTAINER (Kotak Putih di Tengah) */}
            <View style={styles.card}>
              
              <View style={styles.headerCenter}>
                <Image 
                  source={require('@/assets/images/tahu.jpg')} 
                  style={styles.logo} 
                  resizeMode="contain"
                />
                <Text style={styles.title}>TahuPhysics</Text>
                <Text style={styles.subtitle}>Masuk untuk mulai belajar</Text>
              </View>

              <View style={styles.form}>
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
                  placeholder="Masukkan password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#aaa"
                />

                <TouchableOpacity 
                  style={styles.loginButton} 
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Masuk Sekarang</Text>
                </TouchableOpacity>

                <View style={styles.footerLink}>
                  <Text style={styles.footerText}>Belum punya akun? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.linkText}>Daftar</Text>
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

// --- STYLES (Sudah dirapikan ke bawah vertikal) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerCenter: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
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
    marginBottom: 20,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#4BA3EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    // Shadow Button
    shadowColor: '#4BA3EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
  },
});