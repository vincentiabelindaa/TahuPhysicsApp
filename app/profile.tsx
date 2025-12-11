import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router'; 
import { Colors } from '@/constants/theme'; 
import Ionicons from '@expo/vector-icons/Ionicons'; 

export default function ProfileScreen() {
  const theme = Colors.light;
  const router = useRouter(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('belindaaa@gmail.com'); 
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Profil Saya',
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.primary,
        // --- BAGIAN INI YANG DIGANTI ---
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15, padding: 5 }}>
             {/* Ganti jadi 'chevron-back' supaya lebih cocok untuk iPhone & Android */}
             <Ionicons name="chevron-back" size={28} color={theme.primary} />
          </TouchableOpacity>
        ),
        // -------------------------------
      }} />

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* --- KARTU 1: INFORMASI AKUN --- */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.primary, borderColor: theme.cardBorder }]}>
            Informasi Akun
          </Text>

          <Text style={styles.label}>Nama Lengkap:</Text>
          <TextInput 
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama lengkap"
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput 
            style={[styles.input, styles.readOnly]} 
            value={email}
            editable={false} 
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondary }]}>
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

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondary }]}>
            <Text style={styles.buttonText}>Ganti Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.danger }]}>
            <Text style={[styles.logoutText, { color: '#c62828' }]}>Keluar (Logout)</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
           <Text style={styles.footerText}>© 2025 IndiBelin | All rights reserved</Text>
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12, 
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
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