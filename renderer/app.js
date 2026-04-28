// ============================================
// VOICE AI ASSISTANT — Core Application Logic
// ============================================

// ============= STATE =============
const state = {
  isActive: false,
  isListening: false,
  isSpeaking: false,
  isThinking: false,
  isRecording: false,
  botName: localStorage.getItem('botName') || 'Atlas',
  apiKey: localStorage.getItem('apiKey') || '',
  mediaRecorder: null,
  audioChunks: [],
  synth: window.speechSynthesis,
  maleVoice: null,
  conversationHistory: [],
};

// ============= DOM ELEMENTS =============
const $ = (id) => document.getElementById(id);
const setupPanel = $('setupPanel');
const mainPanel = $('mainPanel');
const botNameInput = $('botNameInput');
const apiKeyInput = $('apiKeyInput');
const saveSetupBtn = $('saveSetupBtn');
const botNameDisplay = $('botNameDisplay');
const botStatusText = $('botStatusText');
const botAvatar = $('botAvatar');
const settingsBtn = $('settingsBtn');
const settingsDropdown = $('settingsDropdown');
const editBotName = $('editBotName');
const editApiKey = $('editApiKey');
const saveSettingsBtn = $('saveSettingsBtn');
const waveformContainer = $('waveformContainer');
const stateLabel = $('stateLabel');
const toggleBtn = $('toggleBtn');
const toggleHint = $('toggleHint');
const shortcutHint = $('shortcutHint');
const conversationLog = $('conversationLog');
const minimizeBtn = $('minimizeBtn');
const closeBtn = $('closeBtn');

// ============= INITIALIZATION =============
function init() {
  // Check if already configured
  if (state.apiKey && state.botName) {
    showMainPanel();
  } else {
    botNameInput.value = state.botName;
    if (state.apiKey) apiKeyInput.value = state.apiKey;
  }

  // Setup event listeners
  saveSetupBtn.addEventListener('click', handleSetup);
  toggleBtn.addEventListener('click', handleToggle);
  settingsBtn.addEventListener('click', toggleSettings);
  saveSettingsBtn.addEventListener('click', handleSaveSettings);
  minimizeBtn.addEventListener('click', () => window.electronAPI.minimizeWindow());
  closeBtn.addEventListener('click', () => window.electronAPI.closeWindow());

  // Listen for tray toggle
  window.electronAPI.onStatusChange((active) => {
    if (active && !state.isActive) {
      activateAssistant();
    } else if (!active && state.isActive) {
      deactivateAssistant();
    }
  });

  let lastShortcutTime = 0;
  // Listen for global shortcut
  window.electronAPI.onShortcutPressed(() => {
    if (!state.isActive) return;
    
    // Debounce to prevent 429 errors from key repeat if held down
    const now = Date.now();
    if (now - lastShortcutTime < 800) return;
    lastShortcutTime = now;
    
    if (state.isRecording) {
      // If already recording, stop
      stopRecording();
    } else {
      // Start recording
      startRecording();
    }
  });

  // Keep spacebar logic on toggle btn just in case
  toggleBtn.addEventListener('mousedown', (e) => {
    if (!state.isActive) return;
    if (e.button === 0 && !state.isRecording) startRecording();
  });
  toggleBtn.addEventListener('mouseup', (e) => {
    if (!state.isActive) return;
    if (e.button === 0 && state.isRecording) stopRecording();
  });

  // Load available voices
  loadVoices();
  state.synth.onvoiceschanged = loadVoices;

  // Allow Enter key on inputs
  apiKeyInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSetup(); });
  botNameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSetup(); });
}

// ============= VOICES =============
function loadVoices() {
  const voices = state.synth.getVoices();

  // Strategy: find the best male Spanish voice
  // Microsoft David is common on Windows for Spanish
  const priorities = [
    // Windows Spanish male voices
    v => v.lang.startsWith('es') && /david|pablo|jorge|andrés|andres|diego|carlos|male|hombre/i.test(v.name),
    // Any Spanish voice on Windows (Microsoft voices)
    v => v.lang.startsWith('es') && /microsoft/i.test(v.name),
    // Any Spanish voice
    v => v.lang.startsWith('es'),
    // Any male voice
    v => /david|pablo|jorge|male|hombre/i.test(v.name),
    // Fallback: first available
    () => true,
  ];

  for (const check of priorities) {
    const match = voices.find(check);
    if (match) {
      state.maleVoice = match;
      break;
    }
  }

  console.log('Selected voice:', state.maleVoice?.name, state.maleVoice?.lang);
}

// ============= SETUP =============
function handleSetup() {
  const name = botNameInput.value.trim() || 'Atlas';
  const key = apiKeyInput.value.trim();

  if (!key) {
    showNotification('Ingresá tu API Key de Gemini', 'error');
    apiKeyInput.focus();
    return;
  }

  state.botName = name;
  state.apiKey = key;
  localStorage.setItem('botName', name);
  localStorage.setItem('apiKey', key);

  showMainPanel();
  showNotification(`¡${state.botName} está listo!`, 'success');
}

function showMainPanel() {
  setupPanel.style.display = 'none';
  mainPanel.style.display = 'flex';
  botNameDisplay.textContent = state.botName;
  editBotName.value = state.botName;
  editApiKey.value = state.apiKey;
}

// ============= SETTINGS =============
function toggleSettings() {
  const isVisible = settingsDropdown.style.display !== 'none';
  settingsDropdown.style.display = isVisible ? 'none' : 'block';
}

function handleSaveSettings() {
  const name = editBotName.value.trim();
  const key = editApiKey.value.trim();

  if (name) {
    state.botName = name;
    localStorage.setItem('botName', name);
    botNameDisplay.textContent = name;
  }
  if (key) {
    state.apiKey = key;
    localStorage.setItem('apiKey', key);
  }

  settingsDropdown.style.display = 'none';
  showNotification('Configuración guardada', 'success');
}

// ============= GEMINI MULTIMODAL (REST API) =============
async function askGeminiAudio(base64Audio, mimeType) {
  if (!state.apiKey) {
    return 'No tengo una API Key configurada. Andá a configuración.';
  }

  try {
    const systemInstruction = `Sos un asistente de IA llamado ${state.botName}. El usuario te está hablando por voz. Respondé a lo que escuches de forma concisa, clara y en español. Usá un tono amigable pero profesional. Tus respuestas deben ser cortas (2-3 oraciones máximo) porque se van a leer en voz alta. No uses emojis, asteriscos, ni formato especial.`;

    const contents = [];

    // Add history (text only)
    for (const msg of state.conversationHistory.slice(-6)) {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }],
      });
    }

    // Add current audio
    contents.push({
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: mimeType.split(';')[0], // Gemini doesn't like codec params (e.g. ;codecs=opus)
            data: base64Audio
          }
        }
      ],
    });

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${state.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error (Status ' + response.status + '):', JSON.stringify(errorData, null, 2));
      const msg = errorData?.error?.message || 'Error desconocido';
      return 'Tuve un error de API. Código: ' + response.status + ' - ' + msg;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude entender el audio o generar una respuesta.';

    // We don't have the exact transcript of what the user said (only Gemini heard it), so we just put a generic message in history
    state.conversationHistory.push({ role: 'user', text: '[Audio enviado]' });
    state.conversationHistory.push({ role: 'model', text: text });

    if (state.conversationHistory.length > 20) {
      state.conversationHistory = state.conversationHistory.slice(-20);
    }

    return text;
  } catch (error) {
    console.error('Gemini error:', error);
    return 'Disculpá, tuve un error de conexión al enviar el audio.';
  }
}

// ============= AUDIO RECORDING (PUSH-TO-TALK) =============
async function initMediaRecorder() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.mediaRecorder = new MediaRecorder(stream);

    state.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        state.audioChunks.push(e.data);
      }
    };

    state.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(state.audioChunks, { type: state.mediaRecorder.mimeType });
      state.audioChunks = [];
      
      updateState('thinking');
      
      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1]; // Remove data UI prefix
        
        // Show user message placeholder
        addMessage('user', '🎤 [Mensaje de voz]');
        
        // Ask Gemini
        const response = await askGeminiAudio(base64data, state.mediaRecorder.mimeType);
        
        // Speak Response
        addMessage('bot', response);
        updateState('speaking');
        await speakText(response);
      };
    };
    
    return true;
  } catch (err) {
    console.error('Error accessing microphone:', err);
    showNotification('No se pudo acceder al micrófono', 'error');
    return false;
  }
}

function startRecording() {
  if (!state.isActive || state.isSpeaking || state.isThinking) return;
  if (!state.mediaRecorder) {
    initMediaRecorder().then(success => {
      if (success) startRecording();
    });
    return;
  }

  // Stop any ongoing speech
  state.synth.cancel();
  
  state.isRecording = true;
  state.audioChunks = [];
  state.mediaRecorder.start();
  updateState('listening');
}

function stopRecording() {
  if (!state.isRecording || !state.mediaRecorder) return;
  
  state.isRecording = false;
  state.mediaRecorder.stop();
  updateState('thinking');
}



// ============= TEXT-TO-SPEECH =============
function speakText(text) {
  return new Promise((resolve) => {
    state.isSpeaking = true;

    // Cancel any pending speech
    state.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    window.currentUtterance = utterance; // Prevents garbage collection on long sentences

    if (state.maleVoice) {
      utterance.voice = state.maleVoice;
    }
    utterance.lang = 'es-AR';
    utterance.rate = 1.05;
    utterance.pitch = 0.85; // Lower pitch for masculine voice

    utterance.onend = () => {
      state.isSpeaking = false;
      if (state.isActive) {
        updateState('inactive');
      }
      resolve();
    };

    utterance.onerror = (e) => {
      console.error('TTS error:', e);
      state.isSpeaking = false;
      if (state.isActive) {
        updateState('inactive');
      }
      resolve();
    };

    state.synth.speak(utterance);
  });
}

// ============= TOGGLE ASSISTANT =============
function handleToggle() {
  if (state.isActive) {
    deactivateAssistant();
  } else {
    activateAssistant();
  }
}

function activateAssistant() {
  state.isActive = true;
  window.electronAPI.toggleAssistant(true);

  if (!state.mediaRecorder) {
    initMediaRecorder();
  }

  toggleBtn.classList.add('active');
  toggleHint.textContent = 'Presioná Ctrl+Espacio';
  shortcutHint.style.display = 'block';
  botAvatar.querySelector('.avatar-pulse').classList.add('active');
  updateState('inactive');

  showNotification(`${state.botName} activado`, 'success');
}

function deactivateAssistant() {
  state.isActive = false;
  window.electronAPI.toggleAssistant(false);

  if (state.isRecording) {
    stopRecording();
  }
  state.synth.cancel();
  state.isSpeaking = false;

  toggleBtn.classList.remove('active');
  toggleHint.textContent = 'Toca para activar';
  shortcutHint.style.display = 'none';
  botAvatar.querySelector('.avatar-pulse').classList.remove('active');
  updateState('inactive');

  showNotification(`${state.botName} desactivado`, 'success');
}

// ============= UI STATE UPDATES =============
function updateState(newState) {
  waveformContainer.classList.remove('active', 'listening', 'thinking', 'speaking');

  const statusMap = {
    inactive: { label: 'LISTO', status: `Tocá Ctrl+Espacio para hablar`, class: '' },
    listening: { label: 'GRABANDO', status: `Apretá de vuelta Ctrl+Espacio para enviar`, class: 'listening' },
    thinking: { label: 'PENSANDO', status: 'Procesando respuesta...', class: 'thinking' },
    speaking: { label: 'HABLANDO', status: 'Respondiendo...', class: 'speaking' },
  };

  const s = statusMap[newState] || statusMap.inactive;
  stateLabel.textContent = s.label;
  botStatusText.textContent = s.status;
  botStatusText.className = 'bot-status ' + (newState !== 'inactive' ? newState : '');

  if (s.class) {
    waveformContainer.classList.add(s.class);
  }
}

// ============= CONVERSATION LOG =============
function addMessage(type, text) {
  const emptyState = conversationLog.querySelector('.empty-state');
  if (emptyState) emptyState.remove();

  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'message-label';
  labelDiv.textContent = type === 'user' ? 'Vos' : state.botName;

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = text;

  messageDiv.appendChild(labelDiv);
  messageDiv.appendChild(bubbleDiv);
  conversationLog.appendChild(messageDiv);

  conversationLog.scrollTop = conversationLog.scrollHeight;
}

// ============= NOTIFICATIONS =============
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add('show');
  });

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

// ============= START =============
document.addEventListener('DOMContentLoaded', init);
