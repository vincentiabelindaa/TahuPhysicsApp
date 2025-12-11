import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LabScreen() {
  const webViewRef = useRef<WebView>(null);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const checkChallenge = async () => {
        try {
          const current = await AsyncStorage.getItem('activeChallenge');
          setActiveChallenge(current);
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
              if(window.receiveActiveChallenge) window.receiveActiveChallenge('${current || ''}');
            `);
          }
        } catch (e) {
          console.error(e);
        }
      };
      checkChallenge();
    }, [])
  );

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'CHALLENGE_COMPLETE') {
        const completedJson = await AsyncStorage.getItem('completedChallenges');
        let completed = completedJson ? JSON.parse(completedJson) : [];
        if (!completed.includes(data.challengeId)) {
          completed.push(data.challengeId);
          await AsyncStorage.setItem('completedChallenges', JSON.stringify(completed));
        }
        await AsyncStorage.removeItem('activeChallenge');
        setActiveChallenge(null);
        Alert.alert("🎉 Selamat!", data.message);
      }
    } catch (e) {
      // ignore
    }
  };

  const LabHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body, html { 
          margin: 0; padding: 0; height: 100%; overflow: hidden; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: #f8f9fa;
          display: flex; flex-direction: column;
        }

        /* --- NOTE: Header Judul sudah dihapus dari CSS ini karena pakai Native React Native --- */

        /* --- INFO PANEL --- */
        .top-panel {
          padding: 10px 20px; background: #fff; 
          flex-shrink: 0; z-index: 10;
          border-bottom: 1px solid #eee; /* Batas tipis dgn header native */
        }
        .info-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;
          text-align: center; font-size: 11px; color: #555;
          margin-top: 8px; background: #e3f2fd;
          padding: 8px; border-radius: 8px;
        }
        .info-val { font-weight: bold; color: #1565c0; font-size: 13px; }

        /* --- CANVAS --- */
        .canvas-container {
          flex-grow: 1; position: relative; background: #fff;
          overflow: hidden; margin: 10px 20px;
          border: 2px dashed #90caf9; border-radius: 12px;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
        }
        canvas { display: block; width: 100%; height: 100%; }
        .canvas-placeholder {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          color: #ccc; font-size: 14px; pointer-events: none; font-weight: 600;
        }

        /* --- BOTTOM PANEL --- */
        .bottom-panel {
          background: #fff; flex-shrink: 0;
          padding: 15px 20px; border-top: 1px solid #ddd;
          display: flex; flex-direction: column; gap: 12px;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
        }

        /* GRID TOOLBAR */
        .toolbar-grid {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
        }
        .draggable-item {
          background: #1976d2; color: white; 
          width: 30%; padding: 12px 0;
          border-radius: 8px; font-size: 12px; font-weight: 600;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s, background 0.1s;
        }
        .draggable-item:active { transform: scale(0.95); background: #0d47a1; }

        .drag-ghost {
          position: fixed; pointer-events: none;
          background: rgba(25, 118, 210, 0.9);
          color: white; padding: 10px 15px; border-radius: 20px;
          font-size: 14px; font-weight: bold; z-index: 9999;
          transform: translate(-50%, -150%);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          display: none; border: 2px solid white;
        }

        .controls { display: flex; gap: 10px; margin-top: 5px;}
        .btn { 
          flex: 1; padding: 12px; border: none; border-radius: 8px; 
          color: white; font-weight: bold; font-size: 13px;
        }
        .btn-start { background: #43a047; }
        .btn-reset { background: #fb8c00; }
        .btn-clear { background: #ef5350; }

        #challenge-banner { 
          display: none; background: #fffde7; padding: 8px; 
          border-radius: 6px; margin-bottom: 8px; 
          font-size: 12px; color: #f57f17; border: 1px solid #fbc02d;
          text-align: center; font-weight: bold;
        }
      </style>
    </head>
    <body>

      <div id="ghost" class="drag-ghost">Item</div>

      <div class="top-panel">
        <div id="challenge-banner">🎯 Tantangan: <span id="ch-text"></span></div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:5px;">
          <span>Massa: <b id="massVal">5</b> kg</span>
          <input type="range" id="massRange" min="1" max="10" step="0.5" value="5" style="width: 55%;">
        </div>
        
        <div class="info-grid">
          <div>Ek <div id="ek" class="info-val">0</div></div>
          <div>Ep <div id="ep" class="info-val">0</div></div>
          <div>Total <div id="et" class="info-val">0</div></div>
        </div>
      </div>

      <div class="canvas-container">
        <div class="canvas-placeholder">Area Lintasan</div>
        <canvas id="canvas"></canvas>
      </div>

      <div class="bottom-panel">
        <div style="text-align:center; font-size: 11px; color:#888;">
          Tahan tombol biru & geser ke area lintasan
        </div>
        
        <div class="toolbar-grid">
          <div class="draggable-item" data-type="flat">➖ Datar</div>
          <div class="draggable-item" data-type="up">↗️ Naik</div>
          <div class="draggable-item" data-type="down">↘️ Turun</div>
          <div class="draggable-item" data-type="hill">⛰️ Bukit</div>
          <div class="draggable-item" data-type="valley">🥣 Lembah</div>
        </div>

        <div class="controls">
          <button class="btn btn-start" onclick="togglePlay()" id="playBtn">▶ Mulai</button>
          <button class="btn btn-reset" onclick="resetSim()">↺ Ulang</button>
          <button class="btn btn-clear" onclick="clearTrack()">🗑 Hapus</button>
        </div>
      </div>

      <script>
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const container = document.querySelector('.canvas-container');

        function resize() {
           canvas.width = container.clientWidth;
           canvas.height = container.clientHeight;
           draw();
        }
        window.addEventListener('resize', resize);
        setTimeout(resize, 100);

        let segments = [];
        let animationId = null;
        let progress = 0;
        let MASS = 5;
        let activeChallengeId = null;
        const GRAVITY = 9.8;
        const PIXELS_PER_METER = 35; 

        const ghost = document.getElementById('ghost');
        let draggedType = null;

        document.querySelectorAll('.draggable-item').forEach(item => {
          item.addEventListener('touchstart', (e) => {
             e.preventDefault(); 
             draggedType = item.getAttribute('data-type');
             ghost.innerText = item.innerText;
             ghost.style.display = 'block';
             const touch = e.touches[0];
             moveGhost(touch.clientX, touch.clientY);
             item.style.opacity = '0.5';
          }, {passive: false});

          item.addEventListener('touchmove', (e) => {
             if(draggedType) {
               e.preventDefault(); 
               const touch = e.touches[0];
               moveGhost(touch.clientX, touch.clientY);
             }
          }, {passive: false});

          item.addEventListener('touchend', (e) => {
             item.style.opacity = '1';
             const touch = e.changedTouches[0];
             const rect = canvas.getBoundingClientRect();
             if (
               touch.clientX >= rect.left && 
               touch.clientX <= rect.right && 
               touch.clientY >= rect.top && 
               touch.clientY <= rect.bottom
             ) {
                tryAddSegment(draggedType);
             }
             draggedType = null;
             ghost.style.display = 'none';
          });
        });

        function moveGhost(x, y) {
           ghost.style.left = x + 'px';
           ghost.style.top = (y - 70) + 'px'; 
        }

        function tryAddSegment(type) {
          let startX = 30; 
          let startY = canvas.height / 2; 
          if (segments.length > 0) {
            const lastSeg = segments[segments.length - 1];
            const lastPt = lastSeg.points[lastSeg.points.length - 1];
            startX = lastPt.x;
            startY = lastPt.y;
          }
          const length = 60; const height = 50; 
          if (startX + length > canvas.width - 10) return alert("⚠️ Mentok Kanan!");
          let endY = startY;
          if (type === 'up') endY = startY - height;
          if (type === 'down') endY = startY + height;
          const peakY = (type === 'hill') ? startY - height : (type === 'valley' ? startY + height : endY);
          if (endY < 10 || peakY < 10) return alert("⚠️ Mentok Atas!");
          if (endY > canvas.height - 10 || peakY > canvas.height - 10) return alert("⚠️ Mentok Bawah!");
          segments.push(createSegment(type, startX, startY, length, height));
          draw();
        }

        function createSegment(type, x, y, length, height) {
          let points = [];
          const steps = 20;
          if(type === 'flat') for(let i=0; i<=steps; i++) points.push({x: x + (i/steps)*length, y: y});
          else if(type === 'up') for(let i=0; i<=steps; i++) points.push({x: x + (i/steps)*length, y: y - (i/steps)*height});
          else if(type === 'down') for(let i=0; i<=steps; i++) points.push({x: x + (i/steps)*length, y: y + (i/steps)*height});
          else if(type === 'hill' || type === 'valley') {
             const h = type === 'hill' ? -height : height;
             for(let i=0; i<=steps; i++) {
               const t = i/steps;
               points.push({x: x + t*length, y: y + h * Math.sin(t * Math.PI)});
             }
          }
          return { type, points };
        }

        document.getElementById('massRange').oninput = function(e) {
          MASS = parseFloat(e.target.value);
          document.getElementById('massVal').innerText = MASS;
          resetSim();
        };

        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#f0f0f0"; ctx.lineWidth = 1; ctx.beginPath();
          for(let i=0; i<canvas.width; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); }
          for(let j=0; j<canvas.height; j+=20) { ctx.moveTo(0,j); ctx.lineTo(canvas.width,j); }
          ctx.stroke();

          ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = "#1976d2"; ctx.beginPath();
          if(segments.length > 0) {
            let all = getAllPoints();
            ctx.moveTo(all[0].x, all[0].y);
            for(let p of all) ctx.lineTo(p.x, p.y);
            ctx.stroke();
            if(!animationId && progress === 0) drawBall(all[0].x, all[0].y);
          }
        }

        // --- BOLA SHINY (3D) ---
        function drawBall(x, y) {
          ctx.beginPath();
          ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#d32f2f"; 
          ctx.fill();
          ctx.strokeStyle = "white"; 
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x - 3, y - 11, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.fill();
        }

        function getAllPoints() {
          if(segments.length === 0) return [];
          let pts = [...segments[0].points];
          for(let i=1; i<segments.length; i++) pts.push(...segments[i].points.slice(1));
          return pts;
        }

        window.togglePlay = function() {
          if(animationId) {
             cancelAnimationFrame(animationId); animationId = null;
             document.getElementById('playBtn').innerText = "▶ Lanjut";
          } else {
             if(segments.length === 0) return alert("Belum ada lintasan!");
             document.getElementById('playBtn').innerText = "⏸ Pause";
             animate();
          }
        };

        window.resetSim = function() {
          cancelAnimationFrame(animationId); animationId = null; progress = 0;
          document.getElementById('playBtn').innerText = "▶ Mulai";
          draw(); updateStats(0,0,0);
        };

        window.clearTrack = function() {
          resetSim(); segments = []; draw();
        };

        function animate() {
          const all = getAllPoints();
          if(progress >= all.length - 1) {
            cancelAnimationFrame(animationId); animationId = null;
            document.getElementById('playBtn').innerText = "Selesai";
            checkChallengeSuccess(); return;
          }
          const curr = all[Math.floor(progress)];
          const next = all[Math.floor(progress)+1];
          if(!next) return;

          const slope = (next.y - curr.y); 
          let speed = 0.6 + (slope * 0.05); if(speed < 0.1) speed = 0.1;
          progress += speed;
          
          const idx = Math.floor(progress); const t = progress - idx;
          const nextPt = all[idx+1] || curr;
          const ballX = all[idx].x + (nextPt.x - all[idx].x) * t;
          const ballY = all[idx].y + (nextPt.y - all[idx].y) * t;

          const hMeters = (canvas.height - ballY) / PIXELS_PER_METER;
          const Ep = MASS * GRAVITY * hMeters;
          const startY = all[0].y;
          const hStart = (canvas.height - startY) / PIXELS_PER_METER;
          const Etot = MASS * GRAVITY * hStart;
          let Ek = Etot - Ep; if(Ek < 0) Ek = 0;

          draw(); drawBall(ballX, ballY); updateStats(Ek, Ep, Etot);
          animationId = requestAnimationFrame(animate);
        }

        function updateStats(k, p, t) {
          document.getElementById('ek').innerText = k.toFixed(1);
          document.getElementById('ep').innerText = p.toFixed(1);
          document.getElementById('et').innerText = t.toFixed(1);
        }

        window.receiveActiveChallenge = function(id) {
          activeChallengeId = id;
          const banner = document.getElementById('challenge-banner');
          const txt = document.getElementById('ch-text');
          if(id === 'challenge_1') {
             banner.style.display = 'block'; txt.innerText = "1 Bukit & 1 Lembah";
          } else if(id === 'challenge_2') {
             banner.style.display = 'block'; txt.innerText = "Kompleks (3L, 2Trn, 3Nk)";
          } else {
             banner.style.display = 'none';
          }
        }

        function checkChallengeSuccess() {
           if(!activeChallengeId) return;
           const hillCount = segments.filter(s => s.type === 'hill').length;
           const valleyCount = segments.filter(s => s.type === 'valley').length;
           const upCount = segments.filter(s => s.type === 'up').length;
           const downCount = segments.filter(s => s.type === 'down').length;

           let success = false; let msg = "";
           if(activeChallengeId === 'challenge_1') {
              if(MASS == 5 && hillCount >= 1 && valleyCount >= 1) { success = true; msg = "Tantangan Dasar Selesai!"; }
           }
           else if(activeChallengeId === 'challenge_2') {
              if(MASS == 5 && valleyCount >= 3 && downCount >= 2 && upCount >= 3) { success = true; msg = "Tantangan Kompleks Selesai!"; }
           }
           if(success) {
             window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CHALLENGE_COMPLETE', challengeId: activeChallengeId, message: msg }));
           }
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* INI NATIVE HEADER (SAMA PERSIS DENGAN CHALLENGE.TSX)
        Posisinya di luar WebView agar render-nya sama persis 
      */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Virtual Lab</Text>
        <Text style={styles.headerSubtitle}>
          Uji pemahamanmu dengan simulasi ini.
        </Text>
      </View>

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: LabHTML }}
        onMessage={handleMessage}
        style={{ flex: 1, backgroundColor: '#f8f9fa' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false} 
        overScrollMode="never"
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

// STYLING INI COPAS 100% DARI CHALLENGE.TSX KAMU
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60, // Ini yang bikin jarak ke atas sama persis
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
});