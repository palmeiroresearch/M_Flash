// ============================================
// SERVICE WORKER - FLASHCARDS MÉDICAS
// Modo Offline Robusto
// Compatible con GitHub Pages
// ============================================

const CACHE_NAME = 'flashcards-medicas-v2.2';

// Detectar la ruta base (para GitHub Pages con subdirectorio)
const BASE_PATH = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);

const ASSETS_TO_CACHE = [
    `${BASE_PATH}`,
    `${BASE_PATH}index.html`,
    `${BASE_PATH}m_flash.html`,
    `${BASE_PATH}flashcards-styles.css`,
    `${BASE_PATH}flashcards-app.js`,
    `${BASE_PATH}flashcards-features.js`,
    `${BASE_PATH}manifest-flashcards.json`
].filter((url, index, self) => self.indexOf(url) === index); // Eliminar duplicados

// ============================================
// INSTALACIÓN - Cachear recursos
// ============================================

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando archivos de la app');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Instalación completa');
                return self.skipWaiting(); // Activar inmediatamente
            })
            .catch((error) => {
                console.error('[Service Worker] Error al cachear:', error);
            })
    );
});

// ============================================
// ACTIVACIÓN - Limpiar caches antiguos
// ============================================

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activación completa');
                return self.clients.claim(); // Tomar control inmediato
            })
    );
});

// ============================================
// FETCH - Estrategia Cache-First
// ============================================

self.addEventListener('fetch', (event) => {
    // Solo cachear requests GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Ignorar requests no-HTTP (chrome-extension://, etc)
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Si está en cache, devolverlo
                if (cachedResponse) {
                    console.log('[Service Worker] Sirviendo desde cache:', event.request.url);
                    
                    // Actualizar cache en background (stale-while-revalidate)
                    fetch(event.request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, networkResponse.clone());
                                    });
                            }
                        })
                        .catch(() => {
                            // Sin conexión, seguir usando cache
                        });
                    
                    return cachedResponse;
                }
                
                // Si no está en cache, obtener de red
                console.log('[Service Worker] Obteniendo de red:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Cachear respuesta válida
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Error de red:', error);
                        
                        // Si falla y es una navegación, mostrar página offline
                        if (event.request.mode === 'navigate') {
                            return caches.match('./m_flash.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

// ============================================
// SINCRONIZACIÓN EN BACKGROUND
// ============================================

self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Sincronización background:', event.tag);
    
    if (event.tag === 'sync-flashcards') {
        event.waitUntil(
            // Aquí podrías sincronizar con servidor si tuvieras backend
            Promise.resolve()
                .then(() => {
                    console.log('[Service Worker] Sincronización completada');
                    // Notificar a la app
                    return self.clients.matchAll();
                })
                .then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({
                            type: 'SYNC_COMPLETE',
                            message: 'Datos sincronizados exitosamente'
                        });
                    });
                })
        );
    }
});

// ============================================
// MENSAJES DESDE LA APP
// ============================================

self.addEventListener('message', (event) => {
    console.log('[Service Worker] Mensaje recibido:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys()
                .then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => caches.delete(cacheName))
                    );
                })
                .then(() => {
                    console.log('[Service Worker] Cache limpiado');
                    event.ports[0].postMessage({ success: true });
                })
        );
    }
    
    if (event.data.type === 'GET_CACHE_SIZE') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => cache.keys())
                .then((keys) => {
                    event.ports[0].postMessage({ 
                        cacheSize: keys.length,
                        cacheName: CACHE_NAME 
                    });
                })
        );
    }
});

// ============================================
// NOTIFICACIONES (FUTURO)
// ============================================

self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Click en notificación');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('./m_flash.html')
    );
});
