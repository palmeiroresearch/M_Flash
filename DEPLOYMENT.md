# 🚀 Guía de Deployment en GitHub Pages

## ✅ Pasos para Publicar tu App

### **Opción 1: Repositorio Nuevo**

#### 1. Crear repositorio en GitHub
```bash
# En tu terminal
cd tu-carpeta-flashcards
git init
git add .
git commit -m "Initial commit - Flashcards Médicas v2.2"
```

#### 2. Conectar con GitHub
```bash
# Crea el repo en GitHub primero, luego:
git remote add origin https://github.com/TU-USUARIO/flashcards-medicas.git
git branch -M main
git push -u origin main
```

#### 3. Activar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. Scroll hasta **Pages** (en el menú lateral)
4. En **Source** selecciona: `main` branch, `/ (root)`
5. Click **Save**
6. ✅ Tu app estará en: `https://TU-USUARIO.github.io/flashcards-medicas/`

---

### **Opción 2: Repositorio Existente**

Si ya tienes un repo y quieres agregar la app:

#### Estructura recomendada:
```
tu-repo/
├── docs/           ← Carpeta para GitHub Pages
│   ├── index.html
│   ├── m_flash.html
│   ├── sw.js
│   ├── manifest-flashcards.json
│   ├── flashcards-app.js
│   ├── flashcards-features.js
│   └── flashcards-styles.css
```

#### Configuración:
1. Settings → Pages
2. Source: `main` branch, `/docs` folder
3. Save

---

## 🔧 Configuración del Service Worker

### **IMPORTANTE: Ajuste de Rutas**

El Service Worker actual ya está configurado para detectar automáticamente la ruta base, funcionará en:

✅ `https://usuario.github.io/` (raíz del dominio)
✅ `https://usuario.github.io/flashcards-medicas/` (subdirectorio)
✅ `https://usuario.github.io/repo/docs/` (carpeta docs)

### **Si tienes problemas**, verifica:

**En `flashcards-app.js`, línea de registro:**
```javascript
navigator.serviceWorker.register('./sw.js')
```

**Para subdirectorios específicos:**
```javascript
navigator.serviceWorker.register('/nombre-repo/sw.js', { scope: '/nombre-repo/' })
```

---

## 📱 Verificar que funciona

### **Checklist después de deployment:**

1. ✅ Abre la URL de GitHub Pages
2. ✅ Abre DevTools (F12) → Tab "Application"
3. ✅ Service Workers → Debe aparecer como "activated and running"
4. ✅ Manifest → Debe mostrar el manifest-flashcards.json
5. ✅ Cache Storage → Debe mostrar archivos cacheados
6. ✅ Prueba offline: Network tab → "Offline" → recarga → debe funcionar

---

## 🐛 Problemas Comunes

### **Service Worker no se registra**

**Problema:** Console muestra error de registro
**Solución:**
```javascript
// Opción 1: Ruta absoluta
navigator.serviceWorker.register('/sw.js')

// Opción 2: Con scope específico
navigator.serviceWorker.register('./sw.js', { 
    scope: './' 
})
```

### **404 en archivos**

**Problema:** Archivos no se encuentran
**Solución:** 
- Verifica que todos los archivos estén en la raíz o en `/docs`
- Revisa que los nombres coincidan EXACTAMENTE (case-sensitive)

### **No funciona offline**

**Problema:** Sin conexión no carga
**Solución:**
1. Limpia cache del navegador
2. Desregistra SW antiguo: DevTools → Application → Service Workers → Unregister
3. Recarga con Ctrl+Shift+R (hard reload)
4. Registra SW de nuevo

### **Cambios no se ven**

**Problema:** Código actualizado pero sigue mostrando versión antigua
**Solución:**
1. Cambia el `CACHE_NAME` en `sw.js`:
   ```javascript
   const CACHE_NAME = 'flashcards-medicas-v2.3'; // Incrementa versión
   ```
2. Commit y push
3. GitHub Pages actualizará en 1-5 minutos

---

## 🔄 Actualizar la App

### **Cada vez que hagas cambios:**

```bash
# 1. Incrementa versión en sw.js
# En sw.js, línea 7:
const CACHE_NAME = 'flashcards-medicas-v2.3';

# 2. Commit y push
git add .
git commit -m "Update: descripción de cambios"
git push

# 3. Espera 1-5 minutos
# 4. Los usuarios verán banner de actualización
```

---

## 🎯 URLs Finales

Dependiendo de tu configuración:

**Raíz del dominio:**
- URL: `https://TU-USUARIO.github.io/`
- Service Worker scope: `/`

**Subdirectorio:**
- URL: `https://TU-USUARIO.github.io/flashcards-medicas/`
- Service Worker scope: `/flashcards-medicas/`

**Carpeta docs:**
- URL: `https://TU-USUARIO.github.io/REPO/`
- Service Worker scope: `/REPO/`

---

## ✅ Ventajas de GitHub Pages

1. ✅ **HTTPS gratis** - Necesario para Service Workers
2. ✅ **CDN global** - Rápido en todo el mundo
3. ✅ **100% gratis** - Sin límites para proyectos públicos
4. ✅ **Actualizaciones automáticas** - Push = Deploy
5. ✅ **Dominio custom** - Puedes usar tu propio dominio

---

## 📦 Estructura Final Recomendada

```
flashcards-medicas/          ← Repositorio GitHub
├── index.html               ← Redirección
├── m_flash.html             ← App principal
├── sw.js                    ← Service Worker
├── manifest-flashcards.json ← PWA Manifest
├── flashcards-app.js        ← Lógica principal
├── flashcards-features.js   ← Features
├── flashcards-styles.css    ← Estilos
├── README.md                ← Documentación
└── DEPLOYMENT.md            ← Esta guía
```

---

## 🎉 ¡Listo!

Tu app ahora está:
- ✅ Publicada en internet
- ✅ Funciona offline
- ✅ Es instalable (PWA)
- ✅ Se actualiza automáticamente

**URL de ejemplo:**
`https://tu-usuario.github.io/flashcards-medicas/`

---

## 🆘 Soporte

**Si tienes problemas:**
1. Revisa la consola del navegador (F12)
2. Verifica que todos los archivos estén en el repo
3. Espera 5 minutos después de hacer push
4. Limpia cache y recarga (Ctrl+Shift+R)

**Recursos útiles:**
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Service Worker Cookbook](https://serviceworke.rs/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
