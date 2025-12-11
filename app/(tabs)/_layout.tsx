import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
// 1. Ganti import IconSymbol jadi Ionicons langsung dari vector-icons
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 10, marginBottom: 4 },
      }}>
      
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // house.fill -> home
          tabBarIcon: ({ color }) => <Ionicons size={25} name="home" color={color} />,
        }}
      />

      {/* 2. Playlist */}
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          // play.rectangle.fill -> play-circle
          tabBarIcon: ({ color }) => <Ionicons size={25} name="play-circle" color={color} />,
        }}
      />

      {/* 3. Virtual Lab */}
      <Tabs.Screen
        name="lab" // Pastikan nama file kamu lab.tsx
        options={{
          title: 'Lab',
          // flask.fill -> flask
          tabBarIcon: ({ color }) => <Ionicons size={25} name="flask" color={color} />,
        }}
      />

      {/* 4. Quiz */}
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          // lightbulb.fill -> bulb
          tabBarIcon: ({ color }) => <Ionicons size={25} name="bulb" color={color} />,
        }}
      />

      {/* 5. Challenge */}
      <Tabs.Screen
        name="challenge"
        options={{
          title: 'Challenge',
          // trophy.fill -> trophy
          tabBarIcon: ({ color }) => <Ionicons size={25} name="trophy" color={color} />,
        }}
      />

    </Tabs>
  );
}