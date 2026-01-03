import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUESTIONS = [
  {
    id: 'q1',
    question: "1. Sebuah benda bermassa 2 kg bergerak dengan kecepatan 4 m/s, kemudian mendapat gaya konstan 6 N selama 5 detik searah gerak benda. Tentukan usaha total yang dilakukan gaya tersebut.",
    options: [
      { key: 'A', text: '100 J' },
      { key: 'B', text: '245 J' },
      { key: 'C', text: '300 J' },
      { key: 'D', text: '345 J' },
      { key: 'E', text: '400 J' },
    ],
    correct: 'D',
    explanation: "Cara 1 (Gaya & Perpindahan):\n1. Percepatan a = F/m = 6/2 = 3 m/s²\n2. Perpindahan s = v₀t + ½at² = 4(5) + 0.5(3)(25) = 20 + 37.5 = 57.5 m\n3. Usaha W = F·s = 6 · 57.5 = 345 J.\n\nCara 2 (Teorema Usaha-Energi):\nΔEk = ½m(vₜ² - v₀²) menghasilkan 345 J juga."
  },
  {
    id: 'q2',
    question: "2. Sebuah pegas dengan konstanta 200 N/m diregangkan sejauh 0.1 m. Berapa energi potensial elastis yang tersimpan?",
    options: [
      { key: 'A', text: '0.5 J' },
      { key: 'B', text: '1 J' },
      { key: 'C', text: '2 J' },
      { key: 'D', text: '3 J' },
      { key: 'E', text: '5 J' },
    ],
    correct: 'B',
    explanation: "Rumus Ep Pegas: Ep = ½ k x²\nEp = 0.5 × 200 × (0.1)²\nEp = 100 × 0.01 = 1 J."
  },
  {
    id: 'q3',
    question: "3. Sebuah benda bermassa 5 kg dijatuhkan dari ketinggian 20 m. Abaikan gesekan udara. Tentukan kecepatan saat menyentuh tanah.",
    options: [
      { key: 'A', text: '10 m/s' },
      { key: 'B', text: '15 m/s' },
      { key: 'C', text: '20 m/s' },
      { key: 'D', text: '25 m/s' },
      { key: 'E', text: '30 m/s' },
    ],
    correct: 'C',
    explanation: "Hukum Kekekalan Energi:\nEp awal = Ek akhir\nmgh = ½mv²\nv = √(2gh) = √(2 × 9.8 × 20) = √392 ≈ 19.8 m/s (dibulatkan 20 m/s)."
  },
  {
    id: 'q4',
    question: "4. Sebuah mesin mengangkat beban 50 kg setinggi 10 m dalam waktu 5 s. Hitung daya mesin.",
    options: [
      { key: 'A', text: '500 W' },
      { key: 'B', text: '750 W' },
      { key: 'C', text: '980 W' },
      { key: 'D', text: '1000 W' },
      { key: 'E', text: '1200 W' },
    ],
    correct: 'C',
    explanation: "1. Usaha W = m·g·h = 50 × 9.8 × 10 = 4900 J\n2. Daya P = W/t = 4900/5 = 980 Watt."
  },
  {
    id: 'q5',
    question: "5. Sebuah gaya F = (4x² + 2x) N bekerja pada benda sepanjang lintasan dari x=0 hingga x=3 m. Tentukan usaha total.",
    options: [
      { key: 'A', text: '45 J' },
      { key: 'B', text: '54 J' },
      { key: 'C', text: '60 J' },
      { key: 'D', text: '66 J' },
      { key: 'E', text: '72 J' },
    ],
    correct: 'A',
    explanation: "Gunakan Integral:\nW = ∫(4x² + 2x) dx dari 0 sampai 3\n= [ (4/3)x³ + x² ] dari 0 sampai 3\n= (4/3 · 27 + 9) - 0\n= 36 + 9 = 45 J."
  },
  {
    id: 'q6',
    question: "6. Sebuah benda 2 kg bergerak dengan kecepatan 10 m/s. Gaya gesek 4 N bekerja selama 5 detik. Tentukan kecepatan akhirnya.",
    options: [
      { key: 'A', text: '0 m/s' },
      { key: 'B', text: '2 m/s' },
      { key: 'C', text: '5 m/s' },
      { key: 'D', text: '6 m/s' },
      { key: 'E', text: '8 m/s' },
    ],
    correct: 'A',
    explanation: "Perlambatan a = F/m = -4/2 = -2 m/s²\nKecepatan akhir vt = v₀ + at\nvt = 10 + (-2)(5) = 10 - 10 = 0 m/s."
  },
  {
    id: 'q7',
    question: "7. Benda 1 kg dilempar vertikal ke atas dengan kecepatan awal 20 m/s. Tentukan ketinggian maksimum.",
    options: [
      { key: 'A', text: '10 m' },
      { key: 'B', text: '15 m' },
      { key: 'C', text: '20 m' },
      { key: 'D', text: '25 m' },
      { key: 'E', text: '30 m' },
    ],
    correct: 'C',
    explanation: "Kekekalan Energi (Ek awal = Ep puncak):\n½mv² = mgh\nh = v² / 2g = 20² / (2 × 9.8) = 400 / 19.6 ≈ 20.4 m."
  },
  {
    id: 'q8',
    question: "8. Sebuah gaya 50 N menarik benda sejauh 10 m membentuk sudut 60° terhadap arah gerak. Tentukan usaha yang dilakukan.",
    options: [
      { key: 'A', text: '125 J' },
      { key: 'B', text: '150 J' },
      { key: 'C', text: '200 J' },
      { key: 'D', text: '250 J' },
      { key: 'E', text: '300 J' },
    ],
    correct: 'D',
    explanation: "Rumus Usaha dengan Sudut:\nW = F · s · cos(θ)\nW = 50 · 10 · cos(60°)\nW = 500 · 0.5 = 250 J."
  },
  {
    id: 'q9',
    question: "9. Energi kinetik suatu benda berubah dari 100 J menjadi 400 J dalam 4 detik. Berapa daya rata-rata yang dilakukan gaya tersebut?",
    options: [
      { key: 'A', text: '50 W' },
      { key: 'B', text: '75 W' },
      { key: 'C', text: '100 W' },
      { key: 'D', text: '150 W' },
      { key: 'E', text: '200 W' },
    ],
    correct: 'B',
    explanation: "Daya P = ΔEk / t\nP = (400 - 100) / 4\nP = 300 / 4 = 75 Watt."
  },
  {
    id: 'q10',
    question: "10. Benda bermassa 4 kg mengalami gaya konstan 12 N selama 3 s dari keadaan diam. Tentukan energi kinetik akhirnya.",
    options: [
      { key: 'A', text: '54 J' },
      { key: 'B', text: '72 J' },
      { key: 'C', text: '81 J' },
      { key: 'D', text: '100 J' },
      { key: 'E', text: '162 J' },
    ],
    correct: 'E',
    explanation: "1. Percepatan a = F/m = 12/4 = 3 m/s²\n2. Kecepatan akhir v = at = 3(3) = 9 m/s\n3. Ek = ½mv² = 0.5(4)(9)² = 2(81) = 162 J."
  },
  {
    id: 'q11',
    question: "11. Sebuah benda bermassa 2 kg meluncur dari puncak bidang miring licin setinggi 5 m. Tentukan kecepatan benda saat mencapai dasar bidang.",
    options: [
      { key: 'A', text: '5 m/s' },
      { key: 'B', text: '7 m/s' },
      { key: 'C', text: '10 m/s' },
      { key: 'D', text: '12 m/s' },
      { key: 'E', text: '15 m/s' },
    ],
    correct: 'C',
    explanation: "Kekekalan Energi (Ep = Ek):\nmgh = ½mv²\nv = √(2gh) = √(2 × 9.8 × 5) = √98 ≈ 9.9 m/s (dibulatkan 10 m/s)."
  },
  {
    id: 'q12',
    question: "12. Benda bermassa 3 kg bergerak di permukaan kasar dengan kecepatan awal 6 m/s dan berhenti setelah menempuh jarak 4.5 m. Tentukan koefisien gesekan kinetiknya.",
    options: [
      { key: 'A', text: '0.6' },
      { key: 'B', text: '0.4' },
      { key: 'C', text: '0.3' },
      { key: 'D', text: '0.2' },
      { key: 'E', text: '0.1' },
    ],
    correct: 'B',
    explanation: "Usaha gesek menghilangkan Ek:\nμmg · d = ½mv²\nμ(9.8)(4.5) = 0.5(6)²\nμ(44.1) = 18\nμ = 18 / 44.1 ≈ 0.4."
  },
  {
    id: 'q13',
    question: "13. Sebuah pegas dengan konstanta 100 N/m ditekan sejauh 0.2 m untuk melontarkan benda 0.5 kg di permukaan licin. Tentukan kecepatan benda setelah terlepas.",
    options: [
      { key: 'A', text: '6.2 m/s' },
      { key: 'B', text: '3.1 m/s' },
      { key: 'C', text: '4.4 m/s' },
      { key: 'D', text: '5.6 m/s' },
      { key: 'E', text: '2.8 m/s' },
    ],
    correct: 'E',
    explanation: "Ep Pegas = Ek Benda\n½kx² = ½mv²\nv = x√(k/m) = 0.2√(100/0.5) = 0.2√200 ≈ 2.83 m/s."
  },
  {
    id: 'q14',
    question: "14. Sebuah bola bermassa 0,1 kg dilempar horizontal dari tebing setinggi 45 m. Tentukan energi kinetik bola saat menyentuh tanah.",
    options: [
      { key: 'A', text: '14 J' },
      { key: 'B', text: '24 J' },
      { key: 'C', text: '34 J' },
      { key: 'D', text: '44 J' },
      { key: 'E', text: '54 J' },
    ],
    correct: 'D',
    explanation: "Kekekalan Energi (Ep awal = Ek akhir):\nEk = mgh = 0.1 × 9.8 × 45 = 44.1 J (mendekati 44 J)."
  },
  {
    id: 'q15',
    question: "15. Sebuah mesin mengerjakan usaha sebesar 5000 J untuk memindahkan beban 100 kg setinggi 4 m. Tentukan efisiensi mesin.",
    options: [
      { key: 'A', text: '90%' },
      { key: 'B', text: '85%' },
      { key: 'C', text: '80%' },
      { key: 'D', text: '75%' },
      { key: 'E', text: '70%' },
    ],
    correct: 'C',
    explanation: "Output (Ep) = mgh = 100 × 9.8 × 4 = 3920 J\nInput = 5000 J\nEfisiensi = (3920 / 5000) × 100% = 78.4% (mendekati 80%)."
  },
];

export default function QuizScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const [userAnswers, setUserAnswers] = useState<any>({});

  const currentQ = QUESTIONS[currentIndex];
  const currentStatus = userAnswers[currentIndex] || {};

  const handleSelect = (key: string) => {
    if (currentStatus.checked) return; 
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: { ...currentStatus, selected: key }
    });
  };

  const handleCheck = () => {
    if (!currentStatus.selected) {
      Alert.alert("Pilih Jawaban", "Silakan pilih salah satu jawaban dulu.");
      return;
    }

    const isCorrect = currentStatus.selected === currentQ.correct;
    
    if (isCorrect) setScore(score + 1);

    setUserAnswers({
      ...userAnswers,
      [currentIndex]: { ...currentStatus, checked: true, isCorrect }
    });
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentIndex(0);
    setUserAnswers({});
    setFinished(false);
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hasil Quiz</Text>
        </View>
        <View style={styles.resultContainer}>
          <Ionicons name="trophy" size={80} color="#FFD700" />
          <Text style={styles.resultTitle}>Selamat!</Text>
          <Text style={styles.resultScore}>
            Skor: {score} / {QUESTIONS.length}
          </Text>
          <Text style={styles.resultDesc}>
            Kamu telah menyelesaikan semua soal tentang Usaha dan Energi.
          </Text>
          
          <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
            <Text style={styles.restartBtnText}>Ulangi Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz Interaktif</Text>
        <Text style={styles.headerSubtitle}>Soal {currentIndex + 1} dari {QUESTIONS.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          
          {currentQ.options.map((opt) => {
            const isSelected = currentStatus.selected === opt.key;
            let optionStyle = styles.option;
            let textStyle = styles.optionText;

            if (isSelected) {
              optionStyle = { ...styles.option, ...styles.optionSelected };
              textStyle = { ...styles.optionText, ...styles.optionTextSelected };
            }

            return (
              <TouchableOpacity 
                key={opt.key} 
                style={optionStyle} 
                onPress={() => handleSelect(opt.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text style={textStyle}>{opt.key}. {opt.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {currentStatus.checked && (
          <View style={[
            styles.feedbackBox, 
            currentStatus.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
          ]}>
            <Text style={[
              styles.feedbackTitle, 
              { color: currentStatus.isCorrect ? '#2e7d32' : '#c62828' }
            ]}>
              {currentStatus.isCorrect ? "✅ Jawaban Benar!" : "❌ Jawaban Salah"}
            </Text>
            
            <Text style={styles.explanationText}>
              <Text style={{fontWeight: 'bold'}}>Kunci: {currentQ.correct}</Text>
              {"\n\n"}
              {currentQ.explanation}
            </Text>
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <View style={{flex: 1}}>
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.navBtnSecondary} onPress={handlePrev}>
              <Text style={styles.navBtnTextSec}>&larr; Sebelumnya</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{flex: 1, alignItems: 'flex-end'}}>
          {!currentStatus.checked ? (
            <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
              <Text style={styles.checkBtnText}>Periksa</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {currentIndex === QUESTIONS.length - 1 ? "Selesai" : "Berikutnya"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, 
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbdefb',
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  optionSelected: {
    borderColor: '#42a5f5',
    backgroundColor: '#e3f2fd',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: '#42a5f5',
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#42a5f5',
  },
  optionText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  optionTextSelected: {
    color: '#0d47a1',
    fontWeight: 'bold',
  },
  feedbackBox: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  feedbackCorrect: {
    backgroundColor: '#e8f5e9',
    borderColor: '#a5d6a7',
  },
  feedbackWrong: {
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtnSecondary: {
    backgroundColor: '#9e9e9e', 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  navBtnTextSec: {
    color: '#fff', 
    fontWeight: 'bold',
  },
  checkBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nextBtn: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginTop: 20,
  },
  resultScore: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  resultDesc: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  restartBtn: {
    backgroundColor: '#00796b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  restartBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});