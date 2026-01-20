// ============================================
// NUEVAS FEATURES - PARTE 2
// ============================================

// ============================================
// FAVORITOS
// ============================================

function toggleFavorite(cardId) {
    const card = flashcards.find(c => c.id === cardId);
    if (card) {
        card.favorite = !card.favorite;
        saveData();
        renderLibrary();
    }
}

function getFavoriteIcon(isFavorite) {
    return isFavorite ? '⭐' : '☆';
}

// ============================================
// SPACED REPETITION (Sistema de Niveles)
// ============================================

function calculateSpacedRepetition(card) {
    // Inicializar si no existe
    if (!card.repetition) {
        card.repetition = {
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReview: new Date().toISOString(),
            lastReviewed: null
        };
    }
    return card.repetition;
}

function updateSpacedRepetition(card, quality) {
    // quality: 0-5 (0=olvido total, 5=perfecto)
    const rep = calculateSpacedRepetition(card);
    
    if (quality >= 3) {
        // Respuesta correcta
        if (rep.repetitions === 0) {
            rep.interval = 1;
        } else if (rep.repetitions === 1) {
            rep.interval = 6;
        } else {
            rep.interval = Math.round(rep.interval * rep.easeFactor);
        }
        rep.repetitions++;
    } else {
        // Respuesta incorrecta - reiniciar
        rep.repetitions = 0;
        rep.interval = 1;
    }
    
    // Actualizar ease factor
    rep.easeFactor = rep.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (rep.easeFactor < 1.3) rep.easeFactor = 1.3;
    
    // Calcular próxima revisión
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + rep.interval);
    rep.nextReview = nextDate.toISOString();
    rep.lastReviewed = new Date().toISOString();
    
    saveData();
}

function getDueCards() {
    const now = new Date();
    return flashcards.filter(card => {
        if (!card.repetition) return true;
        const nextReview = new Date(card.repetition.nextReview);
        return nextReview <= now;
    });
}

// ============================================
// NIVELES POR SISTEMA
// ============================================

function calculateSystemLevel(systemName) {
    const systemCards = flashcards.filter(c => c.system === systemName);
    const systemSessions = studySessions.filter(s => s.system.includes(systemName));
    
    if (systemCards.length === 0) {
        return {
            level: 'novato',
            levelName: 'Novato',
            progress: 0,
            questionsAnswered: 0,
            accuracy: 0,
            emoji: '🌱'
        };
    }
    
    const totalQuestions = systemSessions.reduce((sum, s) => sum + s.total, 0);
    const totalCorrect = systemSessions.reduce((sum, s) => sum + s.correct, 0);
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    // Criterios de nivel
    let level, levelName, emoji, nextLevelQuestions;
    
    if (totalQuestions < 20 || accuracy < 50) {
        level = 'novato';
        levelName = 'Novato';
        emoji = '🌱';
        nextLevelQuestions = 20;
    } else if (totalQuestions < 50 || accuracy < 70) {
        level = 'intermedio';
        levelName = 'Intermedio';
        emoji = '📘';
        nextLevelQuestions = 50;
    } else if (totalQuestions < 100 || accuracy < 85) {
        level = 'experto';
        levelName = 'Experto';
        emoji = '🎓';
        nextLevelQuestions = 100;
    } else {
        level = 'maestro';
        levelName = 'Maestro';
        emoji = '👑';
        nextLevelQuestions = null;
    }
    
    // Calcular progreso al siguiente nivel
    let progress = 0;
    if (nextLevelQuestions) {
        progress = (totalQuestions / nextLevelQuestions) * 100;
        if (progress > 100) progress = 100;
    } else {
        progress = 100; // Maestro
    }
    
    return {
        level,
        levelName,
        progress: Math.round(progress),
        questionsAnswered: totalQuestions,
        accuracy: Math.round(accuracy),
        emoji,
        nextLevelQuestions
    };
}

function renderSystemLevels() {
    const container = document.getElementById('systemLevels');
    if (!container) return;
    
    const systemsWithCards = [...new Set(flashcards.map(c => c.system))];
    
    if (systemsWithCards.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #9ca3af;">No hay sistemas para mostrar</p>';
        return;
    }
    
    let html = '<div style="display: grid; gap: 20px;">';
    
    systemsWithCards.forEach(systemName => {
        const levelInfo = calculateSystemLevel(systemName);
        const system = SYSTEMS.find(s => s.id === systemName);
        const emoji = system ? system.emoji : '📚';
        
        html += `
            <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border-left: 4px solid #667eea;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin: 0; font-size: 16px;">${emoji} ${systemName}</h4>
                        <p style="font-size: 12px; color: #6b7280; margin: 5px 0 0 0;">
                            ${levelInfo.questionsAnswered} preguntas respondidas • ${levelInfo.accuracy}% precisión
                        </p>
                    </div>
                    <span class="level-badge ${levelInfo.level}">
                        ${levelInfo.emoji} ${levelInfo.levelName}
                    </span>
                </div>
                
                ${levelInfo.nextLevelQuestions ? `
                <div class="level-progress">
                    <div class="level-progress-bar">
                        <div class="level-progress-fill" style="width: ${levelInfo.progress}%"></div>
                    </div>
                    <div class="level-info">
                        <span>${levelInfo.progress}% al siguiente nivel</span>
                        <span>${levelInfo.questionsAnswered}/${levelInfo.nextLevelQuestions} preguntas</span>
                    </div>
                </div>
                ` : `
                <p style="text-align: center; color: #059669; font-weight: 600; margin-top: 10px;">
                    🎉 ¡Has alcanzado el nivel máximo!
                </p>
                `}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ============================================
// MODO EXAMEN
// ============================================

function startExamMode() {
    examMode = true;
    const timeInMinutes = parseInt(document.getElementById('examTimeLimit').value);
    examTimeLimit = timeInMinutes * 60; // Convertir a segundos
    examStartTime = Date.now();
    
    // Mostrar timer
    const timerDiv = document.createElement('div');
    timerDiv.id = 'examTimerDisplay';
    timerDiv.className = 'exam-timer';
    timerDiv.innerHTML = `
        <div class="exam-timer-display" id="timerDisplay">${formatTime(examTimeLimit)}</div>
        <div class="exam-timer-label">Tiempo Restante</div>
    `;
    document.body.appendChild(timerDiv);
    
    // Iniciar countdown
    examTimerInterval = setInterval(updateExamTimer, 1000);
}

function updateExamTimer() {
    const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
    const remaining = examTimeLimit - elapsed;
    
    const display = document.getElementById('timerDisplay');
    if (!display) return;
    
    if (remaining <= 0) {
        // Tiempo agotado
        clearInterval(examTimerInterval);
        endStudySession();
        alert('⏰ Tiempo agotado!\n\nEl examen ha terminado.');
        return;
    }
    
    display.textContent = formatTime(remaining);
    
    // Cambiar color según tiempo
    display.className = 'exam-timer-display';
    if (remaining < 60) {
        display.classList.add('danger');
    } else if (remaining < 300) {
        display.classList.add('warning');
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function stopExamMode() {
    examMode = false;
    if (examTimerInterval) {
        clearInterval(examTimerInterval);
        examTimerInterval = null;
    }
    
    const timerDiv = document.getElementById('examTimerDisplay');
    if (timerDiv) {
        timerDiv.remove();
    }
}

// ============================================
// COMPARTIR
// ============================================

function getCardsToShare() {
    const systemFilter = document.getElementById('shareSystem').value;
    const onlyFavs = document.getElementById('shareOnlyFavorites').checked;
    
    let cardsToShare = [...flashcards];
    
    if (systemFilter) {
        cardsToShare = cardsToShare.filter(c => c.system === systemFilter);
    }
    
    if (onlyFavs) {
        cardsToShare = cardsToShare.filter(c => c.isFavorite);
    }
    
    return cardsToShare;
}

function createShareData() {
    const cards = getCardsToShare();
    
    if (cards.length === 0) {
        alert('No hay flashcards para compartir con los filtros seleccionados');
        return null;
    }
    
    const systemFilter = document.getElementById('shareSystem').value;
    const systemName = systemFilter || 'Múltiples Sistemas';
    
    return {
        version: '2.0',
        exportDate: new Date().toISOString(),
        totalCards: cards.length,
        source: `Batería Compartida - ${systemName}`,
        sharedBy: 'Flashcards Médicas',
        flashcards: cards
    };
}

function shareViaWhatsApp() {
    const shareData = createShareData();
    if (!shareData) return;
    
    const jsonString = JSON.stringify(shareData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], `flashcards-${shareData.source}.json`, { type: 'application/json' });
    
    // Para móvil con Web Share API
    if (navigator.share && navigator.canShare({ files: [file] })) {
        navigator.share({
            title: `Flashcards - ${shareData.source}`,
            text: `📚 Te comparto ${shareData.totalCards} flashcards de ${shareData.source}`,
            files: [file]
        }).then(() => {
            console.log('Compartido exitosamente');
        }).catch((error) => {
            console.log('Error al compartir:', error);
            fallbackShareWhatsApp(shareData);
        });
    } else {
        fallbackShareWhatsApp(shareData);
    }
}

function fallbackShareWhatsApp(shareData) {
    // Crear link de descarga temporal
    const jsonString = JSON.stringify(shareData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const message = `📚 *Flashcards Médicas*\n\n` +
        `Sistema: ${shareData.source}\n` +
        `Flashcards: ${shareData.totalCards}\n\n` +
        `Descarga el archivo JSON y luego impórtalo en la app de Flashcards Médicas.\n\n` +
        `Link de descarga temporal disponible en el navegador.`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // También descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards-${shareData.source.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Archivo descargado!\n\nComparte el archivo JSON descargado por WhatsApp.');
}

function shareViaTelegram() {
    const shareData = createShareData();
    if (!shareData) return;
    
    const message = `📚 *Flashcards Médicas*\n\n` +
        `Sistema: ${shareData.source}\n` +
        `Flashcards: ${shareData.totalCards}\n\n` +
        `Descarga el archivo JSON adjunto e impórtalo en la app.`;
    
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    
    // También descargar el archivo
    downloadShareFile();
}

function shareViaEmail() {
    const shareData = createShareData();
    if (!shareData) return;
    
    const subject = `Flashcards Médicas - ${shareData.source}`;
    const body = `Hola,\n\n` +
        `Te comparto ${shareData.totalCards} flashcards de ${shareData.source}.\n\n` +
        `Para usarlas:\n` +
        `1. Descarga el archivo JSON adjunto\n` +
        `2. Abre la app de Flashcards Médicas\n` +
        `3. Ve a Gestión → Importar\n` +
        `4. Selecciona el archivo JSON\n\n` +
        `¡Éxito en tus estudios! 📚`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    
    // También descargar el archivo
    downloadShareFile();
    
    alert('📧 Cliente de email abierto!\n\nNo olvides adjuntar el archivo JSON descargado.');
}

function copyShareLink() {
    const shareData = createShareData();
    if (!shareData) return;
    
    // Crear un data URL del JSON
    const jsonString = JSON.stringify(shareData);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    const dataUrl = `data:application/json;base64,${base64}`;
    
    // Copiar al portapapeles
    const tempInput = document.createElement('input');
    tempInput.value = dataUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Mostrar resultado
    document.getElementById('shareLinkResult').style.display = 'block';
    document.getElementById('shareLinkText').value = dataUrl;
    
    alert('🔗 Link copiado al portapapeles!\n\nNota: Este link contiene los datos completos en base64.');
}

function downloadShareFile() {
    const shareData = createShareData();
    if (!shareData) return;
    
    const jsonString = JSON.stringify(shareData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const filename = `compartir-${shareData.source.replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    
    alert(`✅ Archivo descargado: ${filename}\n\nComparte este archivo con tus compañeros.`);
}

function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    alert('📋 Copiado al portapapeles!');
}

function populateShareSystemFilter() {
    const select = document.getElementById('shareSystem');
    if (!select) return;
    
    const systemsWithCards = [...new Set(flashcards.map(c => c.system))];
    
    let html = '<option value="">Todos los sistemas</option>';
    systemsWithCards.forEach(systemName => {
        const system = SYSTEMS.find(s => s.id === systemName);
        const count = flashcards.filter(c => c.system === systemName).length;
        html += `<option value="${systemName}">${system ? system.emoji : '📚'} ${systemName} (${count})</option>`;
    });
    
    select.innerHTML = html;
}
