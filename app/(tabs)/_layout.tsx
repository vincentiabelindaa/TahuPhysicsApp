import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
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
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="play-circle" color={color} />,
        }}
      />

      <Tabs.Screen
        name="lab" 
        options={{
          title: 'Lab',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="flask" color={color} />,
        }}
      />

      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="bulb" color={color} />,
        }}
      />

      <Tabs.Screen
        name="challenge"
        options={{
          title: 'Challenge',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="trophy" color={color} />,
        }}
      />

    </Tabs>
  );
}