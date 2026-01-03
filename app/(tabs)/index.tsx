import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useFocusEffect } from 'expo-router'; 
import React, { useState, useCallback } from 'react'; 
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const colors = {
  blueBtn: '#4BA3EB',
  mintBtn: '#4DB6AC',
  orangeBtn: '#FF9F43',
  purpleBtn: '#A55EEA',
  
  blueBg: '#EDF7FF',
  mintBg: '#EDF9F8',
  orangeBg: '#FFF5EB',
  purpleBg: '#F6F0FD',
  
  btnText: '#FFFFFF',
};

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState('Sobat Fisika'); 

  useFocusEffect(
    useCallback(() => {
      const fetchUserName = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().name) {
              setDisplayName(docSnap.data().name);
            } else {
              setDisplayName(user.email?.split('@')[0] || 'Sobat Fisika');
            }
          } catch (error) {
            console.log("Gagal ambil nama:", error);
          }
        }
      };
      fetchUserName();
    }, [])
  );

  return (
    <SafeAreaView 
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: '#f0f8ff' }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('@/assets/images/tahu.jpg')} 
              style={styles.logo}
            />
            <View>
              <Text style={styles.headerTitle}>TahuPhysics</Text>
              <Text style={styles.headerSubtitle}>Hai, welcome {displayName}!👋</Text>
            </View>
          </View>
          <Link href="/profile" asChild>
            <TouchableOpacity>
              <Ionicons name="person-circle-outline" size={36} color="#0d47a1" />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Mulai Belajar</Text>
          <Text style={styles.sectionDesc}>
            Mulai petualanganmu belajar Fisika topik Usaha dan Energi.
          </Text>
          
          <View style={styles.cardContainer}>
            
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextContent}>
                   <View style={[styles.iconBadge, { backgroundColor: colors.blueBg }]}>
                      <Ionicons name="play" size={24} color={colors.blueBtn} />
                   </View>
                   <Text style={styles.cardTitle}>Materi Playlist</Text>
                   <Text style={styles.cardDesc}>Tonton video pembelajaran interaktif konsep Usaha dan Energi.</Text>
                </View>
                
                <Ionicons name="play-circle-outline" size={80} color={colors.blueBtn} style={styles.bgIcon} />
                
              </View>
              <Link href="/playlist" asChild>
                <TouchableOpacity style={styles.btnBlue}>
                  <Text style={styles.actionButtonText}>Lihat Materi</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.btnText} />
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextContent}>
                   <View style={[styles.iconBadge, { backgroundColor: colors.mintBg }]}>
                      <Ionicons name="flask" size={24} color={colors.mintBtn} />
                   </View>
                   <Text style={styles.cardTitle}>Virtual Lab</Text>
                   <Text style={styles.cardDesc}>Simulasikan energi kinetik & potensial secara interaktif.</Text>
                </View>
                
                <Ionicons name="flask-outline" size={80} color={colors.mintBtn} style={styles.bgIcon} />
                
              </View>
              <Link href="/lab" asChild>
                <TouchableOpacity style={styles.btnMint}>
                  <Text style={styles.actionButtonText}>Masuk Lab</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.btnText} />
                </TouchableOpacity>
              </Link>
            </View>
            
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardTextContent}>
                   <View style={[styles.iconBadge, { backgroundColor: colors.orangeBg }]}>
                      <Ionicons name="help-circle" size={24} color={colors.orangeBtn} />
                   </View>
                   <Text style={styles.cardTitle}>Quiz</Text>
                   <Text style={styles.cardDesc}>Tes kemampuanmu melalui kuis interaktif.</Text>
                </View>
                
                <Ionicons name="school-outline" size={80} color={colors.orangeBtn} style={styles.bgIcon} />
                
              </View>
              <Link href="/quiz" asChild>
                <TouchableOpacity style={styles.btnOrange}>
                  <Text style={styles.actionButtonText}>Mulai Kuis</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.btnText} />
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                  <View style={styles.cardTextContent}>
                    <View style={[styles.iconBadge, { backgroundColor: colors.purpleBg }]}>
                      <Ionicons name="trophy" size={24} color={colors.purpleBtn} />
                    </View>
                    <Text style={styles.cardTitle}>Tantangan</Text>
                    <Text style={styles.cardDesc}>Uji pemahamanmu dengan tantangan melalui Virtual Lab.</Text>
                  </View>
                
                <Ionicons name="trophy-outline" size={80} color={colors.purpleBtn} style={styles.bgIcon} />
                
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
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  mainContent: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  sectionDesc: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  cardContainer: { gap: 16 },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 16, 
    padding: 15,
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
    opacity: 0.2, 
    transform: [{ rotate: '-10deg' }, { scale: 1.1 }] 
  },

  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#777', lineHeight: 18 },

  actionButtonText: {
    color: colors.btnText,
    fontWeight: '700',
    fontSize: 14,
  },
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