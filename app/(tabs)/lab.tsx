import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LabScreen() {
  const webViewRef = useRef<WebView>(null);

  useFocusEffect(
    useCallback(() => {
      const checkChallenge = async () => {
        try {
          const current = await AsyncStorage.getItem('activeChallenge');
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
        
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`window.receiveActiveChallenge('');`);
        }
        Alert.alert("🎉 Selamat!", data.message);
      }
      
      if (data.type === 'CHALLENGE_CANCEL') {
        await AsyncStorage.removeItem('activeChallenge');
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

        .top-panel {
          padding: 10px 15px; background: #fff; 
          flex-shrink: 0; z-index: 10;
          border-bottom: 1px solid #eee;
        }
        
        .info-grid {
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 8px;
          margin-top: 10px; 
          background: #e3f2fd;
          padding: 10px; 
          border-radius: 8px;
        }
        
        .stat-item {
          background: #fff;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid #bbdefb;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;
        }
        
        .stat-val {
          font-weight: bold; color: #1565c0; font-size: 14px; margin-top: 2px;
        }

        .canvas-container {
          flex-grow: 1; position: relative; background: #fff;
          overflow: hidden; margin: 10px 15px;
          border: 2px dashed #90caf9; border-radius: 12px;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
        }
        canvas { display: block; width: 100%; height: 100%; }
        .canvas-placeholder {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          color: #ccc; font-size: 14px; pointer-events: none; font-weight: 600; text-align: center;
        }

        .bottom-panel {
          background: #fff; flex-shrink: 0;
          padding: 15px; border-top: 1px solid #ddd;
          display: flex; flex-direction: column; gap: 10px;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
        }

        .toolbar-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
        .draggable-item {
          background: #1976d2; color: white; width: 30%; padding: 10px 0;
          border-radius: 8px; font-size: 11px; font-weight: 600;
          text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .draggable-item:active { transform: scale(0.95); background: #0d47a1; }

        .drag-ghost {
          position: fixed; pointer-events: none;
          background: rgba(25, 118, 210, 0.9);
          color: white; padding: 10px 15px; border-radius: 20px;
          font-size: 14px; font-weight: bold; z-index: 9999;
          transform: translate(-50%, -150%);
          display: none; border: 2px solid white;
        }

        .controls { display: flex; gap: 10px; margin-top: 5px;}
        .btn { flex: 1; padding: 12px; border: none; border-radius: 8px; color: white; font-weight: bold; font-size: 13px; }
        .btn-start { background: #27a82dff; }
        .btn-reset { background: #fb8c00; }
        .btn-clear { background: #ef5350; }

        #challenge-banner { 
          display: none; background: #fffde7; padding: 8px; 
          border-radius: 6px; margin-bottom: 8px; 
          font-size: 12px; color: #f57f17; border: 1px solid #fbc02d;
          align-items: center; justify-content: space-between;
        }
        .cancel-link {
          text-decoration: underline; color: #d32f2f; cursor: pointer; margin-left: 10px; font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div id="ghost" class="drag-ghost">Item</div>
      
      <div class="top-panel">
        <div id="challenge-banner">
           <span>🎯 <span id="ch-text"></span></span>
           <span class="cancel-link" onclick="cancelChallenge()">Batalkan</span>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; margin-bottom:5px; color:#333;">
          <span>Massa Bola: <b id="massVal" style="color:#1565c0;">5</b> kg</span>
          <input type="range" id="massRange" min="1" max="10" step="0.5" value="5" style="width: 50%;">
        </div>
        
        <div class="info-grid">
          <div class="stat-item">
             <span class="stat-label">Energi Kinetik</span>
             <span class="stat-val" id="ek">0.0 J</span>
          </div>
          <div class="stat-item">
             <span class="stat-label">Energi Potensial</span>
             <span class="stat-val" id="ep">0.0 J</span>
          </div>
          <div class="stat-item">
             <span class="stat-label">Energi Total</span>
             <span class="stat-val" id="et">0.0 J</span>
          </div>
          <div class="stat-item">
             <span class="stat-label">Ketinggian (h)</span>
             <span class="stat-val" id="hCurrent">0.0 m</span>
          </div>
        </div>
      </div>

      <div class="canvas-container">
        <canvas id="canvas"></canvas>
      </div>

      <div class="bottom-panel">
        <div style="text-align:center; font-size: 11px; color:#888;">Susun lintasan dengan <i>hold & drag</i> balok di bawah ini ke area kanvas</div>
        <div class="toolbar-grid">
          <div class="draggable-item" data-type="flat">Datar</div>
          <div class="draggable-item" data-type="up">Naik</div>
          <div class="draggable-item" data-type="down">Turun</div>
          <div class="draggable-item" data-type="hill">Bukit</div>
          <div class="draggable-item" data-type="valley">Lembah</div>
        </div>
        <div class="controls">
          <button class="btn btn-start" onclick="togglePlay()" id="playBtn">Mulai</button>
          <button class="btn btn-reset" onclick="resetSim()">Ulang</button>
          <button class="btn btn-clear" onclick="clearTrack()">Hapus</button>
        </div>
      </div>

      <script>
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const container = document.querySelector('.canvas-container');
        function resize() { canvas.width = container.clientWidth; canvas.height = container.clientHeight; draw(); }
        window.addEventListener('resize', resize); setTimeout(resize, 100);

        let segments = []; let animationId = null; let progress = 0; 
        
        let MASS = 5; 
        // --- UKURAN BOLA DIPERBESAR (Base: 10px) ---
        let BALL_RADIUS = 10 + MASS; 

        let activeChallengeId = null;
        let visualSpeed = 3; 
        const GRAVITY = 9.8; 
        const PIXELS_PER_METER = 30;
        
        const ghost = document.getElementById('ghost'); let draggedType = null;

        document.querySelectorAll('.draggable-item').forEach(item => {
          item.addEventListener('touchstart', (e) => {
             e.preventDefault(); draggedType = item.getAttribute('data-type');
             ghost.innerText = item.innerText; ghost.style.display = 'block';
             const touch = e.touches[0]; moveGhost(touch.clientX, touch.clientY);
             item.style.opacity = '0.5';
          }, {passive: false});
          item.addEventListener('touchmove', (e) => {
             if(draggedType) { e.preventDefault(); const touch = e.touches[0]; moveGhost(touch.clientX, touch.clientY); }
          }, {passive: false});
          item.addEventListener('touchend', (e) => {
             item.style.opacity = '1'; const touch = e.changedTouches[0]; const rect = canvas.getBoundingClientRect();
             if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                tryAddSegment(draggedType);
             }
             draggedType = null; ghost.style.display = 'none';
          });
        });

        function moveGhost(x, y) { ghost.style.left = x + 'px'; ghost.style.top = (y - 70) + 'px'; }
        
        function tryAddSegment(type) {
          let startX = 20; let startY = canvas.height / 2; 
          if (segments.length > 0) { const lastSeg = segments[segments.length - 1]; const lastPt = lastSeg.points[lastSeg.points.length - 1]; startX = lastPt.x; startY = lastPt.y; }
          const length = 50; const height = 40; 
          if (startX + length > canvas.width - 10) return alert("⚠️ Batas Kanan!");
          let endY = startY;
          if (type === 'up') endY = startY - height; if (type === 'down') endY = startY + height;
          const peakY = (type === 'hill') ? startY - height : (type === 'valley' ? startY + height : endY);
          if (endY < 10 || peakY < 10) return alert("⚠️ Terlalu Tinggi!");
          if (endY > canvas.height - 10 || peakY > canvas.height - 10) return alert("⚠️ Terlalu Rendah!");
          segments.push(createSegment(type, startX, startY, length, height)); draw();
        }

        function createSegment(type, x, y, length, height) {
          let points = []; const steps = 30;
          if(type === 'flat') for(let i=0; i<=steps; i++) points.push({x: x + (i/steps)*length, y: y});
          else if(type === 'up') for(let i=0; i<=steps; i++) points.push({x: x + (i/steps)*length, y: y - (i/steps)*height});
          else if(type === 'down') for(let i=0; i<=steps; i++) points.push({x: x + (i/steps)*length, y: y + (i/steps)*height});
          else if(type === 'hill' || type === 'valley') { const h = type === 'hill' ? -height : height; for(let i=0; i<=steps; i++) { const t = i/steps; points.push({x: x + t*length, y: y + h * Math.sin(t * Math.PI)}); }}
          return { type, points };
        }

        document.getElementById('massRange').oninput = function(e) { 
          MASS = parseFloat(e.target.value); 
          document.getElementById('massVal').innerText = MASS;
          // Rumus ukuran bola (Updated):
          BALL_RADIUS = 10 + MASS; 
          resetSim(); 
        };

        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#eee"; ctx.lineWidth = 1; ctx.beginPath();
          for(let i=0; i<canvas.width; i+=PIXELS_PER_METER) { ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); }
          for(let j=0; j<canvas.height; j+=PIXELS_PER_METER) { ctx.moveTo(0,j); ctx.lineTo(canvas.width,j); }
          ctx.stroke();

          ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = "#1976d2"; ctx.beginPath();
          if(segments.length > 0) {
            let all = getAllPoints(); ctx.moveTo(all[0].x, all[0].y); for(let p of all) ctx.lineTo(p.x, p.y); ctx.stroke();
            if(!animationId && progress === 0) drawBall(all[0].x, all[0].y);
          }
        }

        function drawBall(x, y) {
          // Posisi Y dikurang BALL_RADIUS supaya bola "duduk" di atas garis
          const centerY = y - BALL_RADIUS;

          ctx.beginPath(); 
          ctx.arc(x, centerY, BALL_RADIUS, 0, Math.PI * 2); 
          ctx.fillStyle = "#d32f2f"; ctx.fill();
          ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
          
          // Kilauan
          ctx.beginPath(); 
          const shineOffset = BALL_RADIUS * 0.3;
          ctx.arc(x - shineOffset, centerY - shineOffset, 2, 0, Math.PI * 2); 
          ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fill();
        }

        function getAllPoints() {
          if(segments.length === 0) return []; let pts = [...segments[0].points]; for(let i=1; i<segments.length; i++) pts.push(...segments[i].points.slice(1)); return pts;
        }

        window.togglePlay = function() {
          if(animationId) { cancelAnimationFrame(animationId); animationId = null; document.getElementById('playBtn').innerText = "Lanjut"; }
          else { if(segments.length === 0) return alert("Buat lintasan dulu!"); document.getElementById('playBtn').innerText = "Pause"; animate(); }
        };

        window.resetSim = function() {
          cancelAnimationFrame(animationId); animationId = null; progress = 0;
          visualSpeed = 3; 
          document.getElementById('playBtn').innerText = "Mulai"; draw(); updateStats(0,0,0,0);
        };
        window.clearTrack = function() { resetSim(); segments = []; draw(); };

        function animate() {
          const all = getAllPoints();
          if(progress >= all.length - 1) {
            cancelAnimationFrame(animationId); 
            animationId = null; 
            document.getElementById('playBtn').innerText = "Mulai"; 
            checkChallengeSuccess(); 
            return;
          }
          
          const curr = all[Math.floor(progress)];
          const next = all[Math.floor(progress)+1];
          if(!next) return;

          const slope = next.y - curr.y; 
          visualSpeed += (slope * 0.05);
          if(visualSpeed < 2) visualSpeed = 2; 
          if(visualSpeed > 8) visualSpeed = 8;

          progress += visualSpeed * 0.2; 

          const idx = Math.floor(progress);
          const t = progress - idx;
          const ballX = curr.x + (next.x - curr.x) * t;
          const ballY = curr.y + (next.y - curr.y) * t;
          
          const hMeters = (canvas.height - ballY) / PIXELS_PER_METER;
          const Ep = MASS * GRAVITY * hMeters;
          const Ek = 0.5 * MASS * (visualSpeed * visualSpeed);
          const ETotal = Ep + Ek;

          draw(); 
          drawBall(ballX, ballY); 
          updateStats(Ek, Ep, ETotal, hMeters);
          
          animationId = requestAnimationFrame(animate);
        }

        function updateStats(k, p, t, h) {
          document.getElementById('ek').innerText = k.toFixed(1) + " J";
          document.getElementById('ep').innerText = p.toFixed(1) + " J";
          document.getElementById('et').innerText = t.toFixed(1) + " J";
          document.getElementById('hCurrent').innerText = h.toFixed(2) + " m";
        }

        window.receiveActiveChallenge = function(id) {
          activeChallengeId = id;
          const banner = document.getElementById('challenge-banner');
          const txt = document.getElementById('ch-text');
          if(id && id !== '') {
             banner.style.display = 'flex'; 
             if(id === 'challenge_1') txt.innerText = "1 Bukit & 1 Lembah";
             else if(id === 'challenge_2') txt.innerText = "Kompleks (3L, 2Trn, 3Nk)";
          } else {
             activeChallengeId = null; banner.style.display = 'none';
          }
        }

        window.cancelChallenge = function() {
           window.receiveActiveChallenge(''); 
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CHALLENGE_CANCEL' }));
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Virtual Lab</Text>
        <Text style={styles.headerSubtitle}>Uji pemahamanmu dengan simulasi ini.</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#0d47a1', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#666', lineHeight: 20 },
});