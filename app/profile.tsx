import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme'; // Ambil tema

export default function ProfileScreen() {
  const theme = Colors.light;

  // State untuk form (biar nanti gampang disambung ke backend)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('belindaaa@gmail.com'); // Read-only example
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  return (
    <>
      {/* Header Halaman */}
      <Stack.Screen options={{ 
        title: 'Profil Saya',
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.primary,
      }} />

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* --- KARTU 1: INFORMASI AKUN --- */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.primary, borderColor: theme.cardBorder }]}>
            Informasi Akun
          </Text>

          {/* Input Nama */}
          <Text style={styles.label}>Nama Lengkap:</Text>
          <TextInput 
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama lengkap"
          />

          {/* Input Email (Read Only) */}
          <Text style={styles.label}>Email:</Text>
          <TextInput 
            style={[styles.input, styles.readOnly]} // Style khusus read-only
            value={email}
            editable={false} // Supaya gabisa diedit
          />

          {/* Tombol Update */}
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
            secureTextEntry={true} // Biar jadi bintang-bintang *****
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

          {/* Tombol Ganti Password */}
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondary }]}>
            <Text style={styles.buttonText}>Ganti Password</Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Logout (Merah) */}
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
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    // Border & Shadow
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  readOnly: {
    backgroundColor: '#f5f5f5', // Abu-abu dikit nunjukin gak bisa diedit
    color: '#666',
  },
  button: {
    padding: 12,
    borderRadius: 5,
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
    borderRadius: 5,
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