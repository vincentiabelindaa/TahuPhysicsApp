import { Colors } from '@/constants/theme';
import { auth, db } from '@/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export default function ProfileScreen() {
  const theme = Colors.light || { background: '#f0f2f5', primary: '#0d47a1', secondary: '#42a5f5', cardBorder: '#bbdefb', danger: '#ffebee' };
  const router = useRouter(); 

  // --- STATE ---
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState(''); 
  
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const [loadingPass, setLoadingPass] = useState(false); 

  // --- 1. AMBIL DATA ---
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || ''); 
      getDoc(doc(db, "users", user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
          setName(docSnap.data().name || '');
        }
      });
    }
  }, []);

  // --- 2. UPDATE PROFIL ---
  const handleUpdateProfile = () => {
    if (!name.trim()) {
        Alert.alert("Gagal", "Nama tidak boleh kosong.");
        return;
    }
    const user = auth.currentUser;
    if (user) {
        updateDoc(doc(db, "users", user.uid), { name: name });
        Alert.alert("Sukses", "Profil berhasil diperbarui!");
    }
  };

  // --- 3. GANTI PASSWORD ---
  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
        Alert.alert("Error", "Semua kolom password harus diisi.");
        return;
    }
    if (newPass.length < 6) {
        Alert.alert("Error", "Password baru minimal 6 karakter.");
        return;
    }
    if (newPass !== confirmPass) {
        Alert.alert("Error", "Konfirmasi password tidak cocok.");
        return;
    }

    setLoadingPass(true);
    try {
        const user = auth.currentUser;
        if (user && user.email) {
            const credential = EmailAuthProvider.credential(user.email, oldPass);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPass);
            
            Alert.alert("Sukses", "Password berhasil diganti. Silakan login ulang.");
            setOldPass('');
            setNewPass('');
            setConfirmPass('');
        }
    } catch (error: any) {
        let msg = "Gagal mengganti password.";
        if (error.code === 'auth/wrong-password') msg = "Password saat ini salah.";
        Alert.alert("Gagal", msg);
    } finally {
        setLoadingPass(false);
    }
  };

  // --- 4. LOGOUT ---
  const handleLogout = () => {
      if (Platform.OS === 'web') {
          const yakin = window.confirm("Yakin ingin keluar akun?");
          
          if (yakin) {
              signOut(auth).then(() => {
                  window.location.href = "/"; 
              }).catch((err) => console.error(err));
          }
          return;
      }

      Alert.alert("Keluar", "Yakin ingin keluar akun?", [
          { text: "Batal", style: "cancel" },
          { 
              text: "Ya, Keluar", 
              style: 'destructive', 
              onPress: async () => { 
                  await signOut(auth); 
                  router.replace('/'); 
              } 
          }
      ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f2f5' }} edges={['top', 'left', 'right']}>
      
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER TETAP DI ATAS */}
      <View style={styles.customHeader}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={theme.primary} />
         </TouchableOpacity>
         <Text style={styles.headerTitleText}>Profil Saya</Text>
         <View style={{ width: 40 }} />
      </View>

      {/* 3. BUNGKUS SCROLLVIEW DENGAN KEYBOARDAVOIDINGVIEW */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* 4. TAMBAHKAN style={{ flex: 1 }} DI SCROLLVIEW */}
        <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
        
          {/* --- KARTU 1: INFORMASI AKUN --- */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: theme.primary, borderColor: theme.cardBorder }]}>
              Informasi Akun
            </Text>

            <Text style={styles.label}>Nama:</Text>
            <TextInput 
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Memuat nama..." 
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput 
              style={[styles.input, styles.readOnly]} 
              value={email}
              editable={false} 
            />

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.secondary }]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Update Profil</Text>
            </TouchableOpacity>
          </View>

          {/* --- KARTU 2: GANTI PASSWORD --- */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: theme.primary, borderColor: theme.cardBorder }]}>
              Ganti Password
            </Text>

            <Text style={styles.label}>Password Saat Ini:</Text>
            <TextInput 
              style={styles.input}
              value={oldPass}
              onChangeText={setOldPass}
              secureTextEntry={true} 
            />

            <Text style={styles.label}>Password Baru (min. 6 karakter):</Text>
            <TextInput 
              style={styles.input}
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry={true}
            />

            <Text style={styles.label}>Konfirmasi Password Baru:</Text>
            <TextInput 
              style={styles.input}
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry={true}
            />

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.secondary }]}
              onPress={handleChangePassword}
              disabled={loadingPass}
            >
               {loadingPass ? (
                 <ActivityIndicator color="#fff" />
              ) : (
                 <Text style={styles.buttonText}>Ganti Password</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: theme.danger }]}
              onPress={handleLogout}
          >
              <Text style={[styles.logoutText, { color: '#c62828' }]}>Keluar (Logout)</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
             <Text style={styles.footerText}>© 2025 IndiBelin | All rights reserved</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- STYLE HEADER CUSTOM ---
  customHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, 
    zIndex: 10,  
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d47a1',
  },

  // --- STYLE KONTEN ---
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50, // Tambahan padding bawah biar enak scroll mentoknya
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12, 
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbdefb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12, 
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  readOnly: {
    backgroundColor: '#f5f5f5', 
    color: '#666',
  },
  button: {
    padding: 12,
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ef9a9a',
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  }
});