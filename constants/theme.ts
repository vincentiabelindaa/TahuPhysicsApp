/**
 * Konfigurasi Warna TahuPhysics
 * File: constants/theme.ts
 */

import { Platform } from 'react-native';

// --- PALET WARNA TAHUPHYSICS (Global) ---
const tahuPrimary = '#0d47a1';      // Biru Tua (Judul)
const tahuSecondary = '#1e88e5';    // Biru Terang (Tombol/Link)
const tahuBackground = '#f0f8ff';   // Latar Belakang (Biru Sangat Muda)
const tahuCardBorder = '#bbdefb';   // Garis Pinggir Kartu
const tahuText = '#333333';         // Teks Utama

// Warna Navigasi
const tintColorLight = tahuSecondary;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: tahuText,
    background: tahuBackground,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // --- KAMUS WARNA TAHUPHYSICS ---
    primary: tahuPrimary,       // #0d47a1
    secondary: tahuSecondary,   // #1e88e5 (Ini warna tombol kamu)
    cardBorder: tahuCardBorder, // #bbdefb
    cardBg: '#ffffff',          
    success: '#e8f5e9',         
    danger: '#ffcdd2',          
  },
  
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // --- KAMUS DARK MODE ---
    // Saya sesuaikan sedikit supaya teks Putih di tombol tetap terbaca
    primary: '#64b5f6',         
    secondary: '#1e88e5',       // Saya samakan dengan light biar tombol tetap biru jelas
    cardBorder: '#424242',
    cardBg: '#2d2d2d',
    success: '#1b5e20',
    danger: '#b71c1c',
  },
};

// Bagian Fonts (Bawaan Expo)
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});