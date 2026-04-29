<div align="center">

<!-- HEADER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6C63FF,100:A855F7&height=220&section=header&text=Voice%20AI%20Assistant&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Tu%20asistente%20de%20voz%20con%20IA%20powered%20by%20Gemini&descAlignY=60&descSize=20" width="100%" />

[![GitHub Stars](https://img.shields.io/github/stars/juannredondo/voice-ai-assistant?style=for-the-badge&logo=github&color=A855F7)](https://github.com/juannredondo/voice-ai-assistant/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/juannredondo/voice-ai-assistant?style=for-the-badge&logo=github&color=6C63FF)](https://github.com/juannredondo/voice-ai-assistant/network)

<br/>

[![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Animations-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

> **🎙️ Un asistente de IA conversacional por voz, construido con Electron y potenciado por Google Gemini Flash.**  
> Habla con tu asistente, obtén respuestas inteligentes y escúchalas en voz alta — todo desde tu escritorio.

<br/>

</div>

---

## ✨ Características

<table>
  <tr>
    <td align="center" width="33%">
      <h3>🎤 Push-to-Talk</h3>
      <p>Presioná <kbd>Ctrl</kbd>+<kbd>Space</kbd> para grabar tu mensaje de voz y enviarlo al asistente instantáneamente.</p>
    </td>
    <td align="center" width="33%">
      <h3>🧠 IA Conversacional</h3>
      <p>Powered by <strong>Google Gemini Flash</strong>, el asistente mantiene el contexto de la conversación y responde de forma natural en español.</p>
    </td>
    <td align="center" width="33%">
      <h3>🔊 Respuestas por Voz</h3>
      <p>El asistente te responde en voz alta usando síntesis de voz nativa, con preferencia por voces masculinas en español.</p>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <h3>🖥️ App de Escritorio</h3>
      <p>Corre como aplicación nativa en Windows gracias a <strong>Electron</strong>, con ventana sin bordes y bandeja del sistema.</p>
    </td>
    <td align="center" width="33%">
      <h3>📊 Visualización de Ondas</h3>
      <p>Animación de waveform en tiempo real que refleja el estado del asistente: grabando, pensando o respondiendo.</p>
    </td>
    <td align="center" width="33%">
      <h3>⚙️ Personalizable</h3>
      <p>Podés ponerle un nombre personalizado a tu asistente y configurar tu API Key directamente desde la app.</p>
    </td>
  </tr>
</table>

---

## 🚀 Demo

<div align="center">

```
┌─────────────────────────────────────────┐
│         🤖 Atlas — Voice AI             │
│─────────────────────────────────────────│
│                                         │
│          ╔══════════════╗               │
│          ║   ~ ~ ~ ~    ║               │
│          ║  ~ LISTO  ~  ║  ← Waveform   │
│          ║   ~ ~ ~ ~    ║               │
│          ╚══════════════╝               │
│                                         │
│     [ 🎙️ Activar Asistente ]           │
│     Presioná Ctrl+Espacio para hablar   │
│                                         │
│  ╭────────────────────────────────╮     │
│  │ Vos: 🎤 [Mensaje de voz]       │     │
│  │ Atlas: Hola! ¿En qué te puedo  │     │
│  │        ayudar hoy?             │     │
│  ╰────────────────────────────────╯     │
└─────────────────────────────────────────┘
```

</div>

---

## 🛠️ Stack Tecnológico

| Tecnología | Descripción | Versión |
|---|---|---|
| **[Electron](https://www.electronjs.org/)** | Framework para apps de escritorio multiplataforma | `^33.0.0` |
| **[Google Gemini AI](https://aistudio.google.com/)** | Motor de inteligencia artificial (modelo `gemini-flash-latest`) | `^0.21.0` |
| **Web Speech API** | Síntesis de voz (TTS) nativa del navegador | Native |
| **MediaRecorder API** | Captura de audio del micrófono | Native |
| **HTML5 / CSS3 / JS** | Interfaz de usuario con animaciones y diseño oscuro | ES2022 |

---

## 📋 Requisitos Previos

Antes de empezar, asegurate de tener instalado:

- **[Node.js](https://nodejs.org/)** — v18 o superior
- **[npm](https://www.npmjs.com/)** — incluido con Node.js
- **API Key de Google Gemini** — Obtenerla gratis en [Google AI Studio](https://aistudio.google.com/)

---

## ⚙️ Instalación

### 1. Cloná el repositorio

```bash
git clone https://github.com/juannredondo/voice-ai-assistant.git
cd voice-ai-assistant
```

### 2. Instalá las dependencias

```bash
npm install
```

### 3. Ejecutá la aplicación

```bash
npm start
```

> 💡 Para modo de desarrollo con DevTools disponibles:
> ```bash
> npm run dev
> ```

---

## 🔑 Configuración

Al abrir la aplicación por primera vez, se mostrará un panel de configuración:

1. **Nombre del Bot** — Elegí cómo se llamará tu asistente (por defecto: `Atlas`)
2. **API Key de Gemini** — Ingresá tu clave de API obtenida en [aistudio.google.com](https://aistudio.google.com/)

> ⚠️ **La API Key se almacena localmente** en el `localStorage` de Electron. Nunca se envía a ningún servidor externo más allá de la API oficial de Google.

---

## 🎮 Cómo Usarlo

| Acción | Descripción |
|---|---|
| **Click en el botón** | Activa/desactiva el asistente |
| <kbd>Ctrl</kbd> + <kbd>Space</kbd> | Inicia la grabación de voz (primer press) |
| <kbd>Ctrl</kbd> + <kbd>Space</kbd> | Envía el audio grabado al asistente (segundo press) |
| **⚙️ Ícono de configuración** | Abre el panel para cambiar nombre y API Key |
| **Doble click en bandeja** | Muestra/restaura la ventana desde la barra del sistema |

### Flujo de conversación

```
1. Activar asistente  →  2. Ctrl+Space (grabar)  →  3. Hablar
     ↓
4. Ctrl+Space (enviar)  →  5. Gemini procesa audio  →  6. Respuesta en voz
```

---

## 📁 Estructura del Proyecto

```
voice-ai-assistant/
│
├── 📄 main.js              # Proceso principal de Electron (ventana, tray, IPC, shortcuts)
├── 📄 preload.js           # Bridge seguro entre main y renderer (contextIsolation)
├── 📄 package.json         # Dependencias y scripts del proyecto
│
├── 📁 renderer/            # Interfaz de usuario (proceso renderer)
│   ├── 📄 index.html       # Estructura HTML de la app
│   ├── 📄 styles.css       # Estilos, animaciones y diseño oscuro
│   └── 📄 app.js           # Lógica: grabación, IA, TTS, estado UI
│
└── 📁 assets/              # Recursos estáticos
    └── 🖼️ icon.png         # Ícono de la aplicación y bandeja del sistema
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      ELECTRON APP                           │
│                                                             │
│  ┌──────────────┐   IPC Bridge   ┌───────────────────────┐  │
│  │  Main Process │◄─────────────►│  Renderer Process     │  │
│  │  (main.js)   │               │  (index.html + app.js) │  │
│  │              │               │                         │  │
│  │ • BrowserWin │               │ • UI State Management   │  │
│  │ • Tray Icon  │               │ • Audio Recording       │  │
│  │ • Global     │               │ • Gemini API Calls      │  │
│  │   Shortcuts  │               │ • Text-to-Speech        │  │
│  └──────────────┘               └───────────────────────┘  │
│                                          │                  │
│                                          ▼                  │
│                               ┌─────────────────────┐       │
│                               │  Google Gemini API  │       │
│                               │  (gemini-flash)     │       │
│                               └─────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Seguridad

Este proyecto implementa las mejores prácticas de seguridad de Electron:

- ✅ `contextIsolation: true` — El contexto de Node.js está aislado del renderer
- ✅ `nodeIntegration: false` — Node.js no está expuesto en el renderer
- ✅ **Preload script** — Expone solo las APIs necesarias a través de `contextBridge`
- ✅ **Permission handler** — Solo se permite acceso a `media` (micrófono)

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encontrás un bug o querés proponer una mejora:

1. Fork el repositorio
2. Creá tu branch: `git checkout -b feature/nueva-feature`
3. Commiteá tus cambios: `git commit -m 'feat: agregar nueva feature'`
4. Push al branch: `git push origin feature/nueva-feature`
5. Abrí un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia **MIT** — mirá el archivo [LICENSE](./LICENSE) para más detalles.

---

<div align="center">

**Hecho con ❤️ usando Electron y Google Gemini AI**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-@juannredondo-181717?style=for-the-badge&logo=github)](https://github.com/juannredondo)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:A855F7,100:6C63FF&height=120&section=footer" width="100%" />

</div>
