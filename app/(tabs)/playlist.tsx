import React, { useState, useCallback } from 'react';
// 1. Tambah useWindowDimensions
import { StyleSheet, Text, View, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import YoutubePlayer from "react-native-youtube-iframe";
import { Colors } from '@/constants/theme'; 

export default function PlaylistScreen() {
  
  const playlistId = "PLXz9cUd9nygPdfr9RD4579RyNsHvxjhu1";
  const theme = Colors.light;
  const [playing, setPlaying] = useState(false);

  // --- LOGIKA UKURAN VIDEO ---
  const { width } = useWindowDimensions();
  // Kita kurangi 70 pixel karena ada padding kiri kanan di layout (20+15 = 35 x 2 sisi)
  const videoWidth = width - 70; 
  // Rumus 16:9 (Standar YouTube)
  const videoHeight = videoWidth * (9 / 16);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Playlist',
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.primary,
      }} />

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        
        <Text style={[styles.title, { color: theme.text }]}>Playlist Materi</Text>
        <Text style={styles.subtitle}>
          Selesaikan semua materi di bawah ini untuk menguasai konsep usaha dan energi!
        </Text>

        <View style={styles.videoContainer}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>
            Selesaikan Materi Usaha dan Energi
          </Text>
          
          {/* Style height pembungkusnya kita hapus/sesuaikan biar ngikutin video */}
          <View style={[styles.videoPlayerBox, { height: videoHeight }]}>
            {Platform.OS === 'web' ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
              />
            ) : (
              <YoutubePlayer
                height={videoHeight} // <-- PAKAI TINGGI DINAMIS
                play={playing}
                playList={playlistId}
                onChangeState={onStateChange}
                webViewProps={{
                  allowsInlineMediaPlayback: true,
                }}
              />
            )}
          </View>
        </View>

        <View style={[styles.descriptionBox, { borderColor: theme.cardBorder }]}>
          <Text style={styles.paragraph}>
            Playlist ini mencakup enam video pembelajaran yang mendalam tentang konsep 
            <Text style={{fontWeight: 'bold', color: theme.primary}}> Usaha dan Energi</Text> dalam fisika.
          </Text>
          
          <Text style={styles.paragraph}>
            Mulai dari pengenalan dasar <Text style={{fontWeight: 'bold', color: theme.primary}}>Konsep Usaha</Text> (part 1), 
            teorema <Text style={{fontWeight: 'bold', color: theme.primary}}>Usaha-Energi Kinetik</Text> (part 2), hingga 
            pembahasan <Text style={{fontWeight: 'bold', color: theme.primary}}>Energi Potensial</Text> (part 3).
          </Text>
          
          <Text style={styles.paragraph}>
            Selain itu, juga dibahas konsep <Text style={{fontWeight: 'bold', color: theme.primary}}>Energi Mekanik</Text> dan 
            <Text style={{fontWeight: 'bold', color: theme.primary}}> Hukum Kekekalan Energi</Text> (part 4 & 5), serta 
            penerapan <Text style={{fontWeight: 'bold', color: theme.primary}}>Daya</Text> (part 6).
          </Text>

          <Text style={styles.paragraph}>
            Terdapat <Text style={{fontWeight: 'bold', color: theme.primary}}>5 pembahasan problem set</Text> yang dapat dicoba 
            untuk memahami pengetahuan.
          </Text>
        </View>

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
    padding: 20, // Ini padding luar (20px)
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  videoContainer: {
    backgroundColor: 'white',
    padding: 15, // Ini padding dalam kartu (15px)
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  videoPlayerBox: {
    width: '100%',
    // Height statis 220 dihapus dari sini, dipindah ke inline style
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  descriptionBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  paragraph: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  }
});