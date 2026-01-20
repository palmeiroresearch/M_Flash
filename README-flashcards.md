# 📚 Flashcards Médicas - Sistema de Estudio Inteligente

PWA completa para crear, organizar y estudiar flashcards médicas con soporte offline, estadísticas y sistema de revisión espaciada.

## 🚀 Acceso Rápido

**URL Local:** Abrir `flashcards-medicas.html` en navegador  
**GitHub Pages:** `https://tu-usuario.github.io/FlashcardsMedicas/`

---

## ✨ Características Principales

### 📝 Dos Tipos de Flashcards

1. **Pregunta/Respuesta Simple (Flip Card)**
   - Haz clic para voltear la tarjeta
   - Evalúa si sabías la respuesta
   - Ideal para: definiciones, mecanismos, dosis

2. **Opción Múltiple**
   - 2-6 opciones de respuesta
   - Feedback visual inmediato (verde/rojo)
   - Explicación opcional de la respuesta correcta
   - Ideal para: diagnóstico diferencial, tratamientos

### 🎯 Sistema de Estudio

✅ **Modo de Estudio Aleatorio**
- Selecciona sistema médico a estudiar
- Las cards se mezclan aleatoriamente
- Progreso visual en tiempo real
- Contador de correctas/incorrectas

✅ **Sesiones Personalizables**
- Estudia por sistema (Cardiovascular, Respiratorio, etc.)
- Opción "Todos" para revisión completa
- Termina cuando quieras y ve resultados

✅ **Estadísticas Detalladas**
- Precisión por sesión
- Total de flashcards por sistema
- Distribución por dificultad
- Historial de estudio (próximamente)

### 🗂️ Organización Inteligente

✅ **12 Sistemas Médicos:**
- ❤️ Cardiovascular
- 🫁 Respiratorio
- 🧠 Neurológico
- 🩺 Gastrointestinal
- 🔬 Renal
- ⚗️ Endocrino
- 🩸 Hematológico
- 🛡️ Inmunológico
- 🦠 Infeccioso
- 💊 Farmacología
- 👶 Pediatría
- 🤰 Obstetricia

✅ **Etiquetas Personalizadas:**
- Agrega múltiples etiquetas por flashcard
- Filtra por etiquetas en biblioteca
- Búsqueda inteligente

✅ **3 Niveles de Dificultad:**
- 😊 Fácil
- 😐 Medio
- 😰 Difícil

### 🎨 Interfaz y Experiencia

✅ PWA instalable (funciona como app nativa)  
✅ Diseño responsive (móvil, tablet, PC)  
✅ Modo offline completo  
✅ Animaciones suaves  
✅ Controles intuitivos  

---

## 📦 Estructura del Proyecto

```
FlashcardsMedicas/
├── flashcards-medicas.html       # App principal
├── flashcards-app.js              # Lógica completa
├── manifest-flashcards.json       # Configuración PWA
├── service-worker-flashcards.js   # Funcionalidad offline
├── flashcards-ejemplo.json        # 15 flashcards de ejemplo
├── icon-flashcards-192.png        # Icono 192x192
├── icon-flashcards-512.png        # Icono 512x512
└── README.md                      # Esta documentación
```

---

## 🛠️ Instalación y Uso

### Opción 1: Uso Local (más rápido)

1. **Descargar archivos:**
   - `flashcards-medicas.html`
   - `flashcards-app.js`
   - `manifest-flashcards.json`
   - `service-worker-flashcards.js`

2. **Abrir en navegador:**
   ```bash
   # Navegar a la carpeta
   cd FlashcardsMedicas
   
   # Abrir HTML directamente
   # O usar servidor local:
   python -m http.server 8000
   # Luego abrir: http://localhost:8000/flashcards-medicas.html
   ```

3. **Importar flashcards de ejemplo:**
   - Tab "Biblioteca" → Botón "📤 Importar"
   - Seleccionar `flashcards-ejemplo.json`
   - Listo! 15 flashcards médicas cargadas

### Opción 2: GitHub Pages (para compartir)

1. **Crear repositorio:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Flashcards Médicas"
   ```

2. **Subir a GitHub:**
   ```bash
   git remote add origin https://github.com/TU-USUARIO/FlashcardsMedicas.git
   git branch -M main
   git push -u origin main
   ```

3. **Activar GitHub Pages:**
   - Settings → Pages
   - Source: main branch / root
   - Save

4. **Acceder:**
   `https://TU-USUARIO.github.io/FlashcardsMedicas/flashcards-medicas.html`

### Instalación como PWA

**Android:**
- Chrome → Menú (⋮) → "Añadir a pantalla de inicio"

**iOS:**
- Safari → Compartir (📤) → "Añadir a pantalla de inicio"

**PC:**
- Chrome → Icono de instalación en barra de direcciones

---

## 📖 Guía de Uso Completa

### Crear una Flashcard Simple

1. **Click en "➕ Nueva Flashcard"**
2. **Seleccionar tipo:** "Pregunta/Respuesta Simple"
3. **Llenar campos:**
   - **Pregunta:** "¿Cuál es la dosis de epinefrina en paro cardíaco?"
   - **Respuesta:** "1 mg IV/IO cada 3-5 minutos"
   - **Sistema:** Cardiovascular
   - **Dificultad:** Fácil
   - **Etiquetas:** paro, ACLS, dosis, emergencias
4. **Guardar**

### Crear una Flashcard de Opción Múltiple

1. **Click en "➕ Nueva Flashcard"**
2. **Seleccionar tipo:** "Opción Múltiple"
3. **Llenar pregunta:**
   ```
   En EPA hipertensivo (PAS >140), ¿cuál es el tratamiento inicial?
   ```
4. **Agregar opciones:**
   - ❌ A. Solo furosemida
   - ✅ B. Nitroglicerina IV + Furosemida (marcar correcta)
   - ❌ C. Dobutamina + furosemida
   - ❌ D. Morfina sola
5. **Explicación (opcional):**
   ```
   En EPA hipertensivo, la prioridad es reducción agresiva de PA 
   + precarga. NTG IV tiene efecto vasodilatador rápido.
   ```
6. **Sistema:** Cardiovascular
7. **Etiquetas:** EPA, emergencias, tratamiento
8. **Guardar**

### Estudiar Flashcards

#### Modo Sistema Específico

1. **Tab "📖 Estudiar"**
2. **Seleccionar sistema** (ej: Cardiovascular)
3. **Click "🎯 Comenzar Estudio"**
4. **Para flashcards simples:**
   - Lee la pregunta
   - Haz clic para voltear
   - Evalúa: "❌ No sabía" o "✅ La sabía"
5. **Para opción múltiple:**
   - Lee las opciones
   - Click en tu respuesta
   - Feedback inmediato
   - Avanza automáticamente en 3 seg
6. **Ver resultados** al finalizar

#### Modo Todos los Sistemas

1. Selecciona "🎯 Todos"
2. Estudia flashcards mezcladas de todos los sistemas
3. Útil para revisión general

### Gestionar Biblioteca

#### Buscar y Filtrar

- **Por Sistema:** Dropdown "Sistema"
- **Por Tipo:** Simple o Opción Múltiple
- **Por Texto:** Busca en preguntas y etiquetas

#### Editar Flashcard

1. **En biblioteca:** Click "✏️ Editar"
2. Modifica lo necesario
3. Guardar

#### Eliminar Flashcard

1. Click "🗑️" en la flashcard
2. Confirmar

#### Estudiar Flashcard Individual

- Click "📖 Estudiar" en cualquier card de la biblioteca
- Sesión de 1 sola flashcard

### Exportar e Importar

#### Exportar (Backup)

1. Botón "📥 Exportar" en header
2. Se descarga JSON con todas tus flashcards
3. Guardar en lugar seguro

#### Importar

1. Botón "📤 Importar"
2. Seleccionar archivo JSON
3. Las flashcards se AGREGAN (no reemplazan)
4. Útil para:
   - Restaurar backup
   - Compartir barajas entre compañeros
   - Importar flashcards de ejemplo

### Ver Estadísticas

Tab "📊 Estadísticas" muestra:
- Total de flashcards
- Por tipo (Simple vs Múltiple)
- Por sistema
- Por dificultad

---

## 📋 Formato JSON de Flashcards

### Flashcard Simple

```json
{
  "id": "1737244800001",
  "type": "simple",
  "question": "¿Cuál es la dosis de epinefrina en paro?",
  "answer": "1 mg IV/IO cada 3-5 minutos durante toda la RCP.",
  "system": "Cardiovascular",
  "difficulty": "facil",
  "tags": ["paro", "ACLS", "dosis"],
  "createdAt": "2025-01-19T00:00:00.000Z",
  "reviewCount": 0,
  "lastReviewed": null
}
```

### Flashcard Opción Múltiple

```json
{
  "id": "1737244800002",
  "type": "multiple",
  "question": "En EPA hipertensivo, ¿cuál es el tratamiento?",
  "options": [
    "Solo furosemida",
    "NTG IV + Furosemida",
    "Dobutamina",
    "Morfina"
  ],
  "correctOption": 1,
  "explanation": "NTG IV tiene efecto vasodilatador rápido...",
  "system": "Cardiovascular",
  "difficulty": "medio",
  "tags": ["EPA", "emergencias"],
  "createdAt": "2025-01-19T00:00:00.000Z",
  "reviewCount": 0,
  "lastReviewed": null
}
```

---

## 💡 Consejos de Uso

### Para Crear Buenas Flashcards

✅ **Pregunta clara y específica**
- ❌ "Habla sobre el IMA"
- ✅ "¿Cuál es el tratamiento de reperfusión en IMACEST <3h sin ICP?"

✅ **Respuesta concisa pero completa**
- Incluye información clave
- No escribas ensayos

✅ **Usa etiquetas estratégicamente**
- Patología: IMA, asma, sepsis
- Categoría: diagnóstico, tratamiento, dosis
- Urgencia: emergencias, rutina
- Especialidad: cardiología, neumología

✅ **Opción múltiple efectiva**
- Opciones plausibles (distractores buenos)
- Explicación que enseñe
- No más de 6 opciones

### Para Estudiar Efectivamente

📖 **Sesiones cortas y frecuentes**
- 10-15 min mejor que 2h seguidas
- Estudia a diario

🎯 **Enfoque por sistema**
- Antes de guardia: revisa sistema relevante
- Antes de examen: sistema específico

🔄 **Revisión espaciada**
- Repasa flashcards viejas periódicamente
- Las que fallas, márcalas mentalmente para repasar

📊 **Usa estadísticas**
- Identifica sistemas débiles
- Crea más flashcards donde necesitas

---

## 🔧 Personalización

### Agregar Nuevos Sistemas

Editar `flashcards-app.js`:

```javascript
const systems = [
  'Todos', 'Cardiovascular', 'Respiratorio',
  'TuSistemaNuevo' // Agregar aquí
];

const icons = {
  'TuSistemaNuevo': '🔬' // Agregar icono
};
```

Editar `flashcards-medicas.html` en el select:

```html
<option value="TuSistemaNuevo">🔬 Tu Sistema Nuevo</option>
```

### Cambiar Colores

Editar CSS en `flashcards-medicas.html`:

```css
/* Cambiar tema principal */
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-primary {
  background: #667eea; /* Tu color */
}
```

---

## 🐛 Solución de Problemas

### No se guardan las flashcards

**Causa:** localStorage deshabilitado o lleno  
**Solución:**
- Verificar configuración del navegador
- Exportar flashcards y limpiar localStorage
- Usar modo normal (no incógnito)

### No funciona offline

**Causa:** Service Worker no registrado  
**Solución:**
- Usar HTTPS o localhost
- Abrir consola (F12) → Application → Service Workers
- Verificar que esté activo

### Flashcards importadas no aparecen

**Causa:** JSON inválido o flashcards con IDs duplicados  
**Solución:**
- Verificar sintaxis JSON
- Las flashcards con IDs duplicados se omiten
- Revisar consola (F12) para errores

### Las cards no se voltean

**Causa:** JavaScript deshabilitado  
**Solución:**
- Habilitar JavaScript en navegador
- Verificar consola para errores

---

## 📈 Próximas Mejoras (Roadmap)

- [ ] Sistema de revisión espaciada (algoritmo SM-2)
- [ ] Modo de estudio "Solo incorrectas"
- [ ] Estadísticas avanzadas (curva de aprendizaje)
- [ ] Compartir barajas vía QR/link
- [ ] Modo oscuro
- [ ] Sincronización en la nube (opcional)
- [ ] Importar desde Anki
- [ ] Audio/imágenes en flashcards
- [ ] Modo examen cronometrado

---

## 🤝 Contribuir

### Compartir tus Flashcards

1. Exporta tu baraja
2. Sube a GitHub Gist o Google Drive
3. Comparte link con compañeros

### Reportar Problemas

- Crea un Issue describiendo el problema
- Incluye:
  - Navegador y versión
  - Pasos para reproducir
  - Captura de pantalla (si aplica)
  - Mensajes de error en consola (F12)

---

## 📝 Licencia

Uso libre para fines educativos. Desarrollado para estudiantes de medicina.

---

## 👨‍⚕️ Desarrollado Para

- Estudiantes de Medicina (todos los años)
- Médicos en formación (residentes, internos)
- Médicos generales en actualización
- Personal de salud en general

---

## ⚕️ Disclaimer

Esta herramienta es para **estudio y repaso educativo**. La información médica debe ser siempre verificada con fuentes oficiales, guías clínicas actualizadas y supervisión apropiada. No sustituye la formación médica formal ni el juicio clínico.

---

## 📞 Contacto y Soporte

- **GitHub Issues:** Para reportar problemas
- **Sugerencias:** Abre un Issue con etiqueta "enhancement"
- **Preguntas:** Abre un Issue con etiqueta "question"

---

**Desarrollado con ❤️ para facilitar el estudio de medicina**

*Última actualización: Enero 2025*
*Versión: 1.0.0*
