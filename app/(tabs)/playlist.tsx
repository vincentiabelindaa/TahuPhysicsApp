import React, { useCallback, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

export default function PlaylistScreen() {
  const playlistId = "PLXz9cUd9nygPdfr9RD4579RyNsHvxjhu1";
  const [playing, setPlaying] = useState(false);

  // --- LOGIKA UKURAN VIDEO ---
  const { width } = useWindowDimensions();
  // Dikurangi 70 karena: Padding Container (20*2) + Padding Card (15*2) = 70
  const videoWidth = width - 70; 
  const videoHeight = videoWidth * (9 / 16);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      
      {/* HEADER (Sama persis dengan Lab & Challenge) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Playlist Materi</Text>
        <Text style={styles.headerSubtitle}>
          Selesaikan semua materi di bawah ini untuk menguasai konsep usaha dan energi!
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.videoContainer}>
          <Text style={styles.sectionHeader}>
            Selesaikan Materi Usaha dan Energi
          </Text>
          
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
                height={videoHeight}
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

        <View style={styles.descriptionBox}>
          <Text style={styles.paragraph}>
            Playlist ini mencakup enam video pembelajaran yang mendalam tentang konsep 
            <Text style={{fontWeight: 'bold', color: '#0d47a1'}}> Usaha dan Energi</Text> dalam fisika.
          </Text>
          
          <Text style={styles.paragraph}>
            Mulai dari pengenalan dasar <Text style={{fontWeight: 'bold', color: '#0d47a1'}}>Konsep Usaha</Text> (part 1), 
            teorema <Text style={{fontWeight: 'bold', color: '#0d47a1'}}>Usaha-Energi Kinetik</Text> (part 2), hingga 
            pembahasan <Text style={{fontWeight: 'bold', color: '#0d47a1'}}>Energi Potensial</Text> (part 3).
          </Text>
          
          <Text style={styles.paragraph}>
            Selain itu, juga dibahas konsep <Text style={{fontWeight: 'bold', color: '#0d47a1'}}>Energi Mekanik</Text> dan 
            <Text style={{fontWeight: 'bold', color: '#0d47a1'}}> Hukum Kekekalan Energi</Text> (part 4 & 5), serta 
            penerapan <Text style={{fontWeight: 'bold', color: '#0d47a1'}}>Daya</Text> (part 6).
          </Text>

          <Text style={styles.paragraph}>
            Terdapat <Text style={{fontWeight: 'bold', color: '#0d47a1'}}>5 pembahasan problem set</Text> yang dapat dicoba 
            untuk memahami pengetahuan.
          </Text>
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>© 2025 IndiBelin | All rights reserved</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  // --- HEADER STYLE (Sama dengan file lain) ---
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // --- CONTENT STYLE ---
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  videoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  videoPlayerBox: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  descriptionBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbdefb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  paragraph: {
    fontSize: 14,
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