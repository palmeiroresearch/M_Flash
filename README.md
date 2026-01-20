# 📚 Flashcards Médicas - Sistema de Estudio Inteligente

> Aplicación web completa para estudiantes de medicina con spaced repetition, modo examen, estadísticas avanzadas y más.

![Versión](https://img.shields.io/badge/versión-2.2-blue)
![Estado](https://img.shields.io/badge/estado-producción-brightgreen)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

---

## 🚀 Características Principales

### ✨ Sistema de Flashcards
- **Dos tipos de tarjetas:**
  - 📝 **Simples:** Pregunta → Respuesta
  - ☑️ **Múltiple Opción:** 4 opciones con validación
- **19 Sistemas Médicos** predefinidos
- **Dificultad:** Fácil, Medio, Difícil
- **Tags personalizados** para organización
- **Sistema de favoritos** ⭐ con feedback visual

### 🎯 Modo de Estudio
- **Selección múltiple** de sistemas
- **Filtro de favoritas** para repaso rápido
- **Navegación fluida** entre tarjetas
- **Contador de progreso** en tiempo real
- **Marcado correcto/incorrecto** instantáneo

### ⏱️ Modo Examen
- **Timer visual** con countdown
- **Colores dinámicos:**
  - 🟢 Verde: Tiempo normal
  - 🟡 Amarillo: <5 minutos
  - 🔴 Rojo parpadeante: <1 minuto
- **Configuración flexible:**
  - Cantidad de preguntas
  - Tiempo límite
- **Finalización automática** o manual

### 🧠 Spaced Repetition (Sistema Leitner/SM-2)
- **Algoritmo inteligente** tipo Anki
- **Intervalos adaptativos** según rendimiento
- **Factor de facilidad** personalizado por tarjeta
- **Fechas de revisión** automáticas
- **Repaso optimizado** para máxima retención

### 📊 Estadísticas Avanzadas
- **Tracking preciso por sistema:**
  - Cardiovascular: 57% precisión
  - Neurológico: 85% precisión
  - Respiratorio: 42% precisión
- **Historial de sesiones** (últimas 20)
- **Análisis de rendimiento:**
  - Gráficos de progreso
  - Tendencias temporales
  - Identificación de áreas débiles
- **Sistema de niveles:**
  - 🟢 Novato (0-49%)
  - 🟡 Intermedio (50-69%)
  - 🟠 Experto (70-89%)
  - 🏆 Maestro (90-100%)

### 🔗 Compartir Baterías
**5 métodos de compartir:**
1. 📱 **WhatsApp** - Web Share API nativo
2. ✈️ **Telegram** - Descarga + mensaje
3. 📧 **Email** - Cliente de correo
4. 🔗 **Copiar Link** - Data URL base64
5. 💾 **Descargar JSON** - Archivo directo

**Filtros al compartir:**
- Por sistema específico
- Solo favoritas
- Todas las flashcards

### 🌙 Modo Oscuro
- **Paleta completa** optimizada para estudio nocturno
- **Todos los elementos** con contraste apropiado
- **Transición suave** entre modos
- **Persistencia** automática en LocalStorage

### 📥 Importación/Exportación
**4 modos de importación:**
- 🔄 **Combinar:** Preserva existentes + nuevas
- ➕ **Solo Agregar:** Solo flashcards nuevas
- 🔁 **Reemplazar:** Elimina existentes
- 🆕 **Solo Nuevas IDs:** Evita duplicados

**Exportación completa:**
- JSON estructurado con metadatos
- Compatible entre dispositivos
- Backup automático disponible

### 📱 PWA (Progressive Web App)
- ✅ **Instalable** en móvil y escritorio
- ✅ **Funciona offline** después de primera carga
- ✅ **Sin conexión requerida** para estudiar
- ✅ **LocalStorage** persistente
- ✅ **Actualizaciones automáticas**

---

## 📦 Instalación

### Opción 1: Uso Directo
1. Descarga los 3 archivos:
   - `flashcards-medicas.html`
   - `flashcards-app.js`
   - `flashcards-features.js`

2. Colócalos en la **misma carpeta**

3. Abre `flashcards-medicas.html` en tu navegador

¡Listo! ✅

### Opción 2: Servidor Local
```bash
# Usando Python
python -m http.server 8000

# O usando Node.js
npx http-server
```

Luego abre: `http://localhost:8000/flashcards-medicas.html`

### Opción 3: PWA Instalable
1. Abre la app en Chrome/Edge/Safari
2. Click en el ícono de instalación en la barra de direcciones
3. "Añadir a pantalla de inicio"
4. Usa como app nativa

---

## 🎓 Guía de Uso

### Primer Uso

#### 1. Importar Datos de Ejemplo
```
Tab "⚙️ Gestión" → "Importar Flashcards" 
→ Selecciona JSON de ejemplo
→ Modo: "Combinar"
→ Importar
```

#### 2. Crear tu Primera Flashcard
```
Click "➕ Nueva Flashcard"
→ Tipo: Simple o Múltiple Opción
→ Sistema: Cardiovascular
→ Dificultad: Medio
→ Pregunta: "¿Cuál es el manejo del IMA con elevación del ST?"
→ Respuesta: "Reperfusión urgente..."
→ Tags: "cardiologia, urgencias"
→ Guardar
```

### Sesión de Estudio Normal

```
1. Tab "📚 Estudiar"
2. Selecciona sistemas (click en cards)
3. [Opcional] Activa "Solo favoritas"
4. Click "🎯 Comenzar Estudio"
5. Lee pregunta → "Ver Respuesta"
6. Marca ✅ Correcta o ❌ Incorrecta
7. Click estrella ⭐ para favoritos
8. Navega con ← →
9. "Terminar Sesión"
```

### Modo Examen (Simulacro)

```
1. Tab "📚 Estudiar"
2. Selecciona sistemas
3. ✅ Activa "⏱️ Modo Examen"
4. Configura:
   - Tiempo: 30 minutos
   - Preguntas: 50
5. "🎯 Comenzar Estudio"
6. Timer aparece arriba derecha
7. Responde bajo presión
8. Finaliza automáticamente
```

### Compartir Batería con Compañeros

```
1. Tab "⚙️ Gestión"
2. Sección "Compartir Baterías"
3. Filtrar:
   - Sistema: Cardiovascular
   - ✅ Solo favoritas (las mejores)
4. Click método:
   - WhatsApp / Telegram / Email
5. Comparte archivo JSON
6. Compañero importa con "Combinar"
```

### Ver Progreso

```
Tab "📊 Estadísticas"
→ Ver precisión general
→ Análisis por sistema
→ Identificar sistemas débiles
→ Revisar historial de sesiones
→ Ver niveles alcanzados
```

---

## 🗂️ Estructura de Archivos

```
📁 flashcards-medicas/
├── 📄 flashcards-medicas.html      # HTML principal (1,800 líneas)
├── 📄 flashcards-app.js            # Core funcionalidad (1,400 líneas)
├── 📄 flashcards-features.js       # Features avanzadas (474 líneas)
├── 📄 README.md                    # Este archivo
├── 📁 ejemplos/
│   └── flashcards-medicina-interna.json
└── 📁 docs/
    ├── ENTREGA-FINAL-v2.2.md
    ├── CORRECCIONES-FINALES-v2.2.md
    └── test-compartir.html
```

---

## 💾 Estructura de Datos

### Flashcard Object
```javascript
{
  id: "1737392400000",               // Timestamp único
  type: "simple" | "multiple",       // Tipo de tarjeta
  question: "¿Pregunta?",            // Texto de pregunta
  answer: "Respuesta" | null,        // Para tipo simple
  options: ["A","B","C","D"] | null, // Para múltiple opción
  correctIndex: 1 | null,            // Índice respuesta correcta
  system: "Cardiovascular",          // Sistema médico
  difficulty: "facil|medio|dificil", // Nivel de dificultad
  tags: ["cardiologia", "urgencias"],// Tags personalizados
  createdAt: "2025-01-20T10:00:00Z", // Fecha de creación
  
  // Spaced Repetition
  reviewCount: 0,                    // Veces revisada
  lastReviewed: null,                // Última revisión
  nextReview: "2025-01-21T10:00:00Z",// Próxima revisión
  easeFactor: 2.5,                   // Factor de facilidad
  interval: 0,                       // Intervalo en días
  
  // Favoritos
  isFavorite: false                  // Marcada como favorita
}
```

### Session Stats
```javascript
{
  correct: 13,                       // Respuestas correctas
  incorrect: 7,                      // Respuestas incorrectas
  total: 20,                         // Total de preguntas
  accuracy: 65,                      // % de precisión
  started: "2025-01-20T10:00:00Z",   // Inicio
  ended: "2025-01-20T10:30:00Z",     // Fin
  system: "Cardiovascular, Neuro",   // Sistemas estudiados
  isExam: true,                      // Fue modo examen
  isFavoritesOnly: false,            // Solo favoritas
  
  // Tracking por sistema (v2.2+)
  systemStats: {
    "Cardiovascular": { 
      correct: 8, 
      incorrect: 2, 
      total: 10 
    },
    "Neurológico": { 
      correct: 5, 
      incorrect: 5, 
      total: 10 
    }
  }
}
```

---

## 🎨 Sistemas Médicos Incluidos

| Sistema | Emoji | Ejemplo de Temas |
|---------|-------|------------------|
| Cardiovascular | ❤️ | IMA, ICC, Arritmias, HTA |
| Respiratorio | 🫁 | Asma, EPOC, Neumonía, TEP |
| Neurológico | 🧠 | ACV, Epilepsia, Cefaleas |
| Gastrointestinal | 🔬 | HDA, Hepatitis, Pancreatitis |
| Endocrino | ⚗️ | Diabetes, Tiroides, Suprarrenales |
| Nefrológico | 🩺 | IRA, ERC, Electrolitos |
| Hematológico | 🩸 | Anemias, Leucemias, Coagulopatías |
| Inmunológico | 🛡️ | Lupus, AR, Vasculitis |
| Infeccioso | 🦠 | Sepsis, Meningitis, VIH |
| Reumatológico | 🦴 | Artritis, Osteoporosis |
| Dermatológico | 👤 | Dermatitis, Psoriasis |
| Oftalmológico | 👁️ | Glaucoma, Cataratas |
| Otorrinolaringológico | 👂 | Otitis, Sinusitis |
| Psiquiátrico | 🧘 | Depresión, Ansiedad, Psicosis |
| Obstétrico | 🤰 | Embarazo, Preeclampsia |
| Ginecológico | 🌸 | Ciclo menstrual, Anticonceptivos |
| Pediátrico | 👶 | Vacunas, Crecimiento |
| Geriátrico | 👴 | Demencias, Síndromes geriátricos |
| Personalizado | 📝 | Tus propios temas |

---

## 🔧 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes
- **JavaScript ES6+** - Lógica de aplicación
- **LocalStorage API** - Persistencia de datos
- **Web Share API** - Compartir nativo
- **Clipboard API** - Copiar al portapapeles
- **Service Worker** (opcional) - PWA capabilities

**Sin dependencias externas** - Todo vanilla JavaScript

---

## 📊 Compatibilidad

### Navegadores Desktop
- ✅ Chrome 90+ (Completo)
- ✅ Firefox 88+ (Completo)
- ✅ Edge 90+ (Completo)
- ✅ Safari 14+ (Completo)
- ✅ Opera 76+ (Completo)

### Navegadores Móvil
- ✅ Chrome Android (Completo)
- ✅ Safari iOS 14+ (Web Share limitado)
- ✅ Firefox Android (Completo)
- ✅ Samsung Internet (Completo)

### Features por Navegador
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| Web Share API | ✅ | ❌ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ✅ |
| PWA Install | ✅ | ✅ | ⚠️ | ✅ |
| Modo Oscuro | ✅ | ✅ | ✅ | ✅ |

⚠️ = Soporte parcial

---

## 🐛 Troubleshooting

### No se guardan los datos
**Problema:** Las flashcards desaparecen al cerrar el navegador  
**Solución:** 
- Verifica que el navegador permita LocalStorage
- No uses modo incógnito (borra datos al cerrar)
- Revisa permisos del sitio en configuración

### Modo examen no inicia
**Problema:** Timer no aparece al activar modo examen  
**Solución:**
- Verifica que `flashcards-features.js` esté cargado
- Revisa consola (F12) en busca de errores
- Configura tiempo >0 y preguntas >0

### Estadísticas incorrectas
**Problema:** Todos los sistemas muestran el mismo %  
**Solución:**
- Completa una NUEVA sesión (las antiguas usan cálculo antiguo)
- Las sesiones nuevas usan `systemStats` preciso
- Sesiones antiguas son compatibles pero menos precisas

### Favoritos no se marcan
**Problema:** Click en estrella no hace nada  
**Solución:**
- ✅ YA CORREGIDO en v2.2
- Actualiza a última versión del archivo

### Modo oscuro incompleto
**Problema:** Algunos elementos no se ven bien en modo oscuro  
**Solución:**
- ✅ YA CORREGIDO en v2.2
- Actualiza `flashcards-medicas.html`

### Error al compartir
**Problema:** No funciona compartir por WhatsApp/Telegram  
**Solución:**
- ✅ YA CORREGIDO en v2.2
- En PC: Descarga JSON manualmente y comparte
- En móvil: Usa Web Share API nativo

---

## 🚀 Roadmap Futuro

### Versión 2.3 (Corto Plazo)
- [ ] Filtro "Revisar hoy" usando spaced repetition
- [ ] Notificaciones de flashcards vencidas
- [ ] Gráfico de progreso temporal
- [ ] Exportar estadísticas a CSV
- [ ] Modo de estudio con imágenes
- [ ] Audio para pronunciación médica

### Versión 3.0 (Mediano Plazo)
- [ ] Sincronización en la nube (Firebase/Supabase)
- [ ] Colaboración en tiempo real
- [ ] Flashcards con diagramas médicos
- [ ] Generación de reportes PDF
- [ ] Sistema de logros y badges
- [ ] Racha de estudio diario

### Versión 4.0 (Largo Plazo)
- [ ] IA para generar flashcards automáticamente
- [ ] Reconocimiento de texto médico (OCR)
- [ ] Modo competitivo multijugador
- [ ] App nativa (React Native / Flutter)
- [ ] Integración con bases de datos médicas
- [ ] Marketplace de baterías compartidas

---

## 🤝 Contribuciones

¿Quieres mejorar la app? ¡Excelente!

### Cómo Contribuir
1. Fork este repositorio
2. Crea una rama (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Agregar nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

### Áreas que Necesitan Ayuda
- 📝 Más flashcards de ejemplo
- 🎨 Mejoras en UI/UX
- 🐛 Reportar bugs
- 📚 Documentación
- 🌍 Traducciones
- ♿ Accesibilidad

---

## 📄 Licencia

MIT License - Uso libre para fines educativos y personales

```
Copyright (c) 2025 Flashcards Médicas

Se permite el uso, copia, modificación y distribución
para fines educativos y personales.
```

---

## 📞 Soporte y Contacto

### ¿Encontraste un bug?
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Copia el mensaje de error
4. Reporta con contexto (qué estabas haciendo)

### ¿Tienes una idea?
- Abre un Issue describiendo la feature
- Explica el caso de uso
- Propón una implementación

### Recursos Útiles
- 📖 [Documentación completa](docs/ENTREGA-FINAL-v2.2.md)
- 🔧 [Guía de correcciones](docs/CORRECCIONES-FINALES-v2.2.md)
- 🧪 [Test de compartir](docs/test-compartir.html)

---

## 🏆 Créditos

**Desarrollado para estudiantes de Medicina**

Especialmente útil para:
- 👨‍⚕️ Estudiantes de 6to año en práctica preprofesional
- 🏥 Médicos internos y residentes
- 📚 Preparación de exámenes (ENARM, USMLE, etc.)
- 🔄 Repaso continuo durante rotaciones
- 🎓 Formación médica continua

**Metodología basada en:**
- Sistema Leitner (spaced repetition)
- Algoritmo SuperMemo SM-2
- Curva de olvido de Ebbinghaus
- Técnicas de repaso espaciado

---

## 📈 Estadísticas del Proyecto

- **Líneas de código:** 3,674+
- **Funciones:** 80+
- **Features:** 15+
- **Sistemas médicos:** 19
- **Versión actual:** 2.2
- **Estado:** ✅ Producción estable

---

## ⭐ Si te Gusta este Proyecto

- Dale una ⭐ en GitHub
- Compártelo con tus compañeros de medicina
- Contribuye con más flashcards
- Reporta bugs para mejorar
- Sugiere nuevas features

---

## 🎉 Agradecimientos

A todos los estudiantes de medicina que luchan día a día en sus rotaciones y prácticas preprofesionales. Esta herramienta está hecha para facilitarles el camino.

**¡Éxito en tus estudios! 📚💪**

---

**Hecho con ❤️ para la comunidad médica**




