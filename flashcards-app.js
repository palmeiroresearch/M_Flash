// ============================================
// FLASHCARDS MÉDICAS - Sistema de Estudio
// VERSIÓN 2.2 - FIX ESTADÍSTICAS POR SISTEMA
// ============================================

// Variables globales
let flashcards = [];
let currentTags = [];
let currentStudyCards = [];
let currentCardIndex = 0;
let sessionStats = {
    correct: 0,
    incorrect: 0,
    started: null,
    ended: null,
    system: ''
};
let studySessions = [];
let selectedSystems = new Set();
let optionCount = 4;

// NUEVAS VARIABLES PARA FEATURES
let examMode = false;
let examTimeLimit = 0;
let examStartTime = null;
let examTimerInterval = null;
let onlyFavorites = false;

// SISTEMA DE PUNTOS Y NIVELES
let userProfile = {
    xp: 0,
    level: 1,
    levelName: 'Novato',
    studyStreak: 0,
    lastStudyDate: null,
    totalStudyTime: 0,
    achievements: []
};

// Sistemas disponibles
const SYSTEMS = [
    { id: 'Cardiovascular', emoji: '❤️', name: 'Cardiovascular' },
    { id: 'Respiratorio', emoji: '🫁', name: 'Respiratorio' },
    { id: 'Neurológico', emoji: '🧠', name: 'Neurológico' },
    { id: 'Gastrointestinal', emoji: '🩺', name: 'Gastrointestinal' },
    { id: 'Renal', emoji: '🔬', name: 'Renal' },
    { id: 'Endocrino', emoji: '⚗️', name: 'Endocrino' },
    { id: 'Hematológico', emoji: '🩸', name: 'Hematológico' },
    { id: 'Inmunológico', emoji: '🛡️', name: 'Inmunológico' },
    { id: 'Infeccioso', emoji: '🦠', name: 'Infeccioso' },
    { id: 'Farmacología', emoji: '💊', name: 'Farmacología' },
    { id: 'Pediatría', emoji: '👶', name: 'Pediatría' },
    { id: 'Obstetricia', emoji: '🤰', name: 'Obstetricia' },
    { id: 'Cirugía', emoji: '🔪', name: 'Cirugía' },
    { id: 'Traumatología', emoji: '🦴', name: 'Traumatología' },
    { id: 'Psiquiatría', emoji: '🧘', name: 'Psiquiatría' },
    { id: 'Dermatología', emoji: '🧴', name: 'Dermatología' },
    { id: 'Oftalmología', emoji: '👁️', name: 'Oftalmología' },
    { id: 'ORL', emoji: '👂', name: 'ORL' },
    { id: 'Personalizado', emoji: '📝', name: 'Personalizado' }
];

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadDarkMode();
    renderSystemSelector();
    renderLibrary();
    updateTotalCards();
    populateSystemFilters();
    populateShareSystemFilter();
    renderStats();
    initializeOptionsContainer();
    
    // Actualizar display de nivel
    updateLevelDisplay();
    
    // Registrar Service Worker para modo offline
    registerServiceWorker();
    
    // Detectar cambios de conectividad
    setupConnectivityListener();
});

// ============================================
// MODO OSCURO
// ============================================

function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// ============================================
// CONFIGURACIÓN DE EXAMEN
// ============================================

function toggleExamConfig() {
    const examCheckbox = document.getElementById('examMode');
    const examConfig = document.getElementById('examConfig');
    
    if (examCheckbox.checked) {
        examConfig.style.display = 'block';
    } else {
        examConfig.style.display = 'none';
    }
}

// ============================================
// GESTIÓN DE DATOS (LocalStorage)
// ============================================

function loadData() {
    const stored = localStorage.getItem('medicalFlashcards');
    if (stored) {
        flashcards = JSON.parse(stored);
    }
    
    const storedSessions = localStorage.getItem('studySessions');
    if (storedSessions) {
        studySessions = JSON.parse(storedSessions);
    }
    
    // Cargar perfil de usuario
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
        userProfile = JSON.parse(storedProfile);
    }
}

function saveData() {
    localStorage.setItem('medicalFlashcards', JSON.stringify(flashcards));
    updateTotalCards();
    renderLibrary();
    populateSystemFilters();
}

function saveSessions() {
    if (studySessions.length > 20) {
        studySessions = studySessions.slice(-20);
    }
    localStorage.setItem('studySessions', JSON.stringify(studySessions));
}

function saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    updateLevelDisplay();
}

// ============================================
// TABS
// ============================================

function switchTab(tabName) {
    document.getElementById('studyTab').style.display = 'none';
    document.getElementById('libraryTab').style.display = 'none';
    document.getElementById('statsTab').style.display = 'none';
    document.getElementById('managementTab').style.display = 'none';
    
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    if (tabName === 'study') {
        document.getElementById('studyTab').style.display = 'block';
        document.querySelectorAll('.tab')[0].classList.add('active');
    } else if (tabName === 'library') {
        document.getElementById('libraryTab').style.display = 'block';
        document.querySelectorAll('.tab')[1].classList.add('active');
        renderLibrary();
    } else if (tabName === 'stats') {
        document.getElementById('statsTab').style.display = 'block';
        document.querySelectorAll('.tab')[2].classList.add('active');
        renderStats();
    } else if (tabName === 'management') {
        document.getElementById('managementTab').style.display = 'block';
        document.querySelectorAll('.tab')[3].classList.add('active');
        updateManagementTab();
    }
}

// ============================================
// SELECTOR DE SISTEMAS
// ============================================

function renderSystemSelector() {
    const container = document.getElementById('systemSelector');
    let html = '';
    
    const systemsWithCards = new Set(flashcards.map(c => c.system));
    
    SYSTEMS.forEach(system => {
        const count = flashcards.filter(c => c.system === system.id).length;
        if (count > 0) {
            html += `
                <div class="system-option" data-system-id="${system.id}" onclick="toggleSystem('${system.id}')">
                    <div style="font-size: 24px; margin-bottom: 5px;">${system.emoji}</div>
                    <div style="font-size: 14px; font-weight: 600;">${system.name}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">${count} cards</div>
                </div>
            `;
        }
    });
    
    if (html === '') {
        html = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #9ca3af;">
                <div style="font-size: 48px; margin-bottom: 15px;">📚</div>
                <p>No hay flashcards creadas aún</p>
                <p style="font-size: 14px; margin-top: 10px;">Crea tu primera flashcard para comenzar</p>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function toggleSystem(systemId) {
    if (selectedSystems.has(systemId)) {
        selectedSystems.delete(systemId);
    } else {
        selectedSystems.add(systemId);
    }
    
    document.querySelectorAll('.system-option').forEach(elem => {
        const elemSystemId = elem.getAttribute('data-system-id');
        
        if (elemSystemId && selectedSystems.has(elemSystemId)) {
            elem.classList.add('selected');
        } else {
            elem.classList.remove('selected');
        }
    });
}

// ============================================
// SESIÓN DE ESTUDIO
// ============================================

function startStudySession() {
    if (selectedSystems.size === 0) {
        alert('Por favor selecciona al menos un sistema para estudiar');
        return;
    }
    
    currentStudyCards = flashcards.filter(card => selectedSystems.has(card.system));
    
    onlyFavorites = document.getElementById('onlyFavorites').checked;
    if (onlyFavorites) {
        currentStudyCards = currentStudyCards.filter(card => card.isFavorite);
        if (currentStudyCards.length === 0) {
            alert('No hay flashcards favoritas en los sistemas seleccionados');
            return;
        }
    }
    
    // NUEVO: Filtro "Revisar hoy" (Spaced Repetition)
    const onlyDueToday = document.getElementById('onlyDueToday').checked;
    if (onlyDueToday) {
        const now = new Date();
        currentStudyCards = currentStudyCards.filter(card => {
            if (!card.repetition || !card.repetition.nextReview) return true; // Sin historial = incluir
            const nextReview = new Date(card.repetition.nextReview);
            return nextReview <= now;
        });
        
        if (currentStudyCards.length === 0) {
            alert('🎉 ¡No hay flashcards para revisar hoy!\n\nTodas están al día.');
            return;
        }
    }
    
    currentStudyCards = shuffle(currentStudyCards);
    
    const examCheckbox = document.getElementById('examMode');
    if (examCheckbox && examCheckbox.checked) {
        const questionCount = parseInt(document.getElementById('examQuestionCount').value);
        if (questionCount && questionCount > 0) {
            currentStudyCards = currentStudyCards.slice(0, questionCount);
        }
        
        if (typeof startExamMode === 'function') {
            startExamMode();
        }
    }
    
    if (currentStudyCards.length === 0) {
        alert('No hay flashcards en los sistemas seleccionados');
        return;
    }
    
    currentCardIndex = 0;
    sessionStats = {
        correct: 0,
        incorrect: 0,
        started: new Date().toISOString(),
        ended: null,
        system: Array.from(selectedSystems).join(', '),
        isExam: examCheckbox && examCheckbox.checked,
        isFavoritesOnly: onlyFavorites,
        systemStats: {}
    };
    
    selectedSystems.forEach(sys => {
        sessionStats.systemStats[sys] = {
            correct: 0,
            incorrect: 0,
            total: 0
        };
    });
    
    document.getElementById('studySelection').style.display = 'none';
    document.getElementById('studySession').style.display = 'block';
    
    document.getElementById('totalSessionCards').textContent = currentStudyCards.length;
    document.getElementById('sessionSystem').textContent = sessionStats.system;
    
    showCurrentCard();
}

function showCurrentCard() {
    const card = currentStudyCards[currentCardIndex];
    const container = document.getElementById('flashcardContainer');
    
    document.getElementById('currentCard').textContent = currentCardIndex + 1;
    const progress = ((currentCardIndex) / currentStudyCards.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
    
    document.getElementById('correctCount').textContent = sessionStats.correct;
    document.getElementById('incorrectCount').textContent = sessionStats.incorrect;
    
    if (card.type === 'simple') {
        container.innerHTML = renderSimpleFlashcard(card);
    } else {
        container.innerHTML = renderMultipleChoiceCard(card);
    }
}

function renderSimpleFlashcard(card) {
    const system = SYSTEMS.find(s => s.id === card.system);
    const favoriteIcon = card.isFavorite ? '⭐' : '☆';
    
    return `
        <div class="flashcard" id="currentFlashcard">
            <button class="favorite-btn ${card.isFavorite ? 'active' : ''}" 
                    onclick="toggleFavoriteInSession()" 
                    title="${card.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                ${favoriteIcon}
            </button>
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <span class="flashcard-system-badge">${system ? system.emoji : ''} ${card.system}</span>
                    <div class="flashcard-question">${card.question}</div>
                    <button class="btn btn-primary" onclick="flipCard()">
                        Ver Respuesta
                    </button>
                </div>
                <div class="flashcard-back">
                    <div class="flashcard-answer">${card.answer}</div>
                    <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                        <button class="btn btn-danger" onclick="markIncorrect()">
                            ❌ Incorrecta
                        </button>
                        <button class="btn btn-success" onclick="markCorrect()">
                            ✅ Correcta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderMultipleChoiceCard(card) {
    const system = SYSTEMS.find(s => s.id === card.system);
    const favoriteIcon = card.isFavorite ? '⭐' : '☆';
    
    let html = `
        <div class="multiple-choice-container">
            <button class="favorite-btn ${card.isFavorite ? 'active' : ''}" 
                    onclick="toggleFavoriteInSession()" 
                    title="${card.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                ${favoriteIcon}
            </button>
            <span class="flashcard-system-badge">${system ? system.emoji : ''} ${card.system}</span>
            <div class="choice-question">${card.question}</div>
            <div class="choices" id="choicesContainer">
    `;
    
    card.options.forEach((option, index) => {
        html += `
            <div class="choice-option" onclick="selectChoice(${index})">
                ${String.fromCharCode(65 + index)}. ${option}
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="choice-feedback" id="choiceFeedback"></div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" id="nextQuestionBtn" style="display: none; font-size: 16px; padding: 12px 30px;" onclick="nextCard()">
                    Siguiente Pregunta →
                </button>
            </div>
        </div>
    `;
    
    return html;
}

function flipCard() {
    document.getElementById('currentFlashcard').classList.toggle('flipped');
}

// FIX CRÍTICO: selectChoice ahora actualiza systemStats
function selectChoice(selectedIndex) {
    const card = currentStudyCards[currentCardIndex];
    const options = document.querySelectorAll('.choice-option');
    const feedback = document.getElementById('choiceFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    options.forEach(opt => opt.classList.add('disabled'));
    
    const isCorrect = selectedIndex === card.correctIndex;
    
    if (isCorrect) {
        options[selectedIndex].classList.add('correct');
        sessionStats.correct++;
        
        // FIX: Actualizar systemStats
        if (card && sessionStats.systemStats && sessionStats.systemStats[card.system]) {
            sessionStats.systemStats[card.system].correct++;
            sessionStats.systemStats[card.system].total++;
        }
        
        // SPACED REPETITION: Actualizar revisión (calidad 4 = buena)
        if (typeof updateSpacedRepetition === 'function') {
            const originalCard = flashcards.find(c => c.id === card.id);
            if (originalCard) {
                updateSpacedRepetition(originalCard, 4);
            }
        }
        
        feedback.className = 'choice-feedback correct show';
        feedback.innerHTML = `
            <strong>✅ ¡Correcto!</strong><br>
            ${card.explanation || 'Respuesta correcta'}
        `;
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[card.correctIndex].classList.add('correct');
        sessionStats.incorrect++;
        
        // FIX: Actualizar systemStats
        if (card && sessionStats.systemStats && sessionStats.systemStats[card.system]) {
            sessionStats.systemStats[card.system].incorrect++;
            sessionStats.systemStats[card.system].total++;
        }
        
        // SPACED REPETITION: Actualizar revisión (calidad 1 = olvidada)
        if (typeof updateSpacedRepetition === 'function') {
            const originalCard = flashcards.find(c => c.id === card.id);
            if (originalCard) {
                updateSpacedRepetition(originalCard, 1);
            }
        }
        
        feedback.className = 'choice-feedback incorrect show';
        feedback.innerHTML = `
            <strong>❌ Incorrecto</strong><br>
            La respuesta correcta es: <strong>${String.fromCharCode(65 + card.correctIndex)}</strong><br>
            ${card.explanation || ''}
        `;
    }
    
    document.getElementById('correctCount').textContent = sessionStats.correct;
    document.getElementById('incorrectCount').textContent = sessionStats.incorrect;
    
    nextBtn.style.display = 'block';
}

function markCorrect() {
    sessionStats.correct++;
    
    const card = currentStudyCards[currentCardIndex];
    if (card && sessionStats.systemStats && sessionStats.systemStats[card.system]) {
        sessionStats.systemStats[card.system].correct++;
        sessionStats.systemStats[card.system].total++;
    }
    
    // SPACED REPETITION: Actualizar revisión (calidad 4 = buena)
    if (typeof updateSpacedRepetition === 'function') {
        const originalCard = flashcards.find(c => c.id === card.id);
        if (originalCard) {
            updateSpacedRepetition(originalCard, 4);
        }
    }
    
    nextCard();
}

function markIncorrect() {
    sessionStats.incorrect++;
    
    const card = currentStudyCards[currentCardIndex];
    if (card && sessionStats.systemStats && sessionStats.systemStats[card.system]) {
        sessionStats.systemStats[card.system].incorrect++;
        sessionStats.systemStats[card.system].total++;
    }
    
    // SPACED REPETITION: Actualizar revisión (calidad 1 = olvidada)
    if (typeof updateSpacedRepetition === 'function') {
        const originalCard = flashcards.find(c => c.id === card.id);
        if (originalCard) {
            updateSpacedRepetition(originalCard, 1);
        }
    }
    
    nextCard();
}

function nextCard() {
    currentCardIndex++;
    
    if (currentCardIndex >= currentStudyCards.length) {
        endStudySession();
    } else {
        showCurrentCard();
    }
}

function endStudySession() {
    sessionStats.ended = new Date().toISOString();
    
    if (examMode) {
        stopExamMode();
    }
    
    const total = sessionStats.correct + sessionStats.incorrect;
    const accuracy = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;
    
    // SISTEMA XP: Calcular puntos ganados
    const baseXP = sessionStats.correct * 10; // 10 XP por correcta
    const bonusXP = sessionStats.incorrect * 2; // 2 XP por intentar
    const accuracyBonus = accuracy >= 80 ? 50 : accuracy >= 60 ? 25 : 0;
    const totalXP = baseXP + bonusXP + accuracyBonus;
    
    addXP(totalXP, `Sesión: ${sessionStats.correct} correctas`);
    updateStudyStreak();
    
    studySessions.push({
        ...sessionStats,
        total: total,
        accuracy: accuracy,
        xpEarned: totalXP
    });
    saveSessions();
    
    document.getElementById('studySession').style.display = 'none';
    document.getElementById('studyResults').style.display = 'block';
    
    document.getElementById('resultCorrect').textContent = sessionStats.correct;
    document.getElementById('resultIncorrect').textContent = sessionStats.incorrect;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    
    // Mostrar XP ganada
    const xpDisplay = document.getElementById('resultXP');
    if (xpDisplay) {
        xpDisplay.textContent = `+${totalXP} XP`;
    }
}

function resetStudy() {
    document.getElementById('studyResults').style.display = 'none';
    document.getElementById('studySelection').style.display = 'block';
    selectedSystems.clear();
    renderSystemSelector();
}

// ============================================
// BIBLIOTECA DE FLASHCARDS
// ============================================

function renderLibrary() {
    const grid = document.getElementById('libraryGrid');
    const empty = document.getElementById('libraryEmpty');
    
    const filteredCards = getFilteredCards();
    
    if (filteredCards.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    let html = '';
    filteredCards.forEach((card, index) => {
        const system = SYSTEMS.find(s => s.id === card.system);
        
        // Verificar si toca revisar hoy
        let reviewBadge = '';
        if (card.repetition && card.repetition.nextReview) {
            const nextReview = new Date(card.repetition.nextReview);
            const now = new Date();
            const daysUntil = Math.ceil((nextReview - now) / (1000 * 60 * 60 * 24));
            
            if (daysUntil <= 0) {
                reviewBadge = '<span class="tag" style="background: #ef4444; color: white;">📅 Revisar hoy</span>';
            } else if (daysUntil <= 3) {
                reviewBadge = `<span class="tag" style="background: #f59e0b; color: white;">📅 En ${daysUntil} día${daysUntil > 1 ? 's' : ''}</span>`;
            }
        }
        
        html += `
            <div class="flashcard-card">
                <div class="card-header">
                    <span class="card-type ${card.type}">${card.type === 'simple' ? 'Simple' : 'Opción Múltiple'}</span>
                </div>
                <div class="card-question-preview">${card.question}</div>
                <div class="card-meta">
                    <span class="card-meta-item">${system ? system.emoji : ''} ${card.system}</span>
                    <span class="card-meta-item">${getDifficultyEmoji(card.difficulty)} ${card.difficulty}</span>
                </div>
                <div class="card-tags">
                    ${reviewBadge}
                    ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-small" onclick="editCard(${index})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteCard(${index})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

function getFilteredCards() {
    let filtered = [...flashcards];
    
    const systemFilter = document.getElementById('filterSystem')?.value;
    const typeFilter = document.getElementById('filterType')?.value;
    const searchQuery = document.getElementById('searchQuery')?.value.toLowerCase();
    
    if (systemFilter) {
        filtered = filtered.filter(c => c.system === systemFilter);
    }
    
    if (typeFilter) {
        filtered = filtered.filter(c => c.type === typeFilter);
    }
    
    if (searchQuery) {
        filtered = filtered.filter(c => 
            c.question.toLowerCase().includes(searchQuery) ||
            c.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }
    
    return filtered;
}

function filterLibrary() {
    renderLibrary();
}

function populateSystemFilters() {
    const select = document.getElementById('filterSystem');
    const systemsWithCards = new Set(flashcards.map(c => c.system));
    
    let html = '<option value="">Todos</option>';
    SYSTEMS.forEach(system => {
        if (systemsWithCards.has(system.id)) {
            html += `<option value="${system.id}">${system.emoji} ${system.name}</option>`;
        }
    });
    
    select.innerHTML = html;
}

// ============================================
// MODAL: CREAR/EDITAR FLASHCARD
// ============================================

function openNewCardModal() {
    document.getElementById('cardModalTitle').textContent = 'Nueva Flashcard';
    document.getElementById('editCardId').value = '';
    document.getElementById('cardForm').reset();
    currentTags = [];
    renderTagsContainer();
    toggleCardType();
    initializeOptionsContainer();
    
    document.getElementById('cardModal').classList.add('show');
}

function editCard(index) {
    const card = flashcards[index];
    
    document.getElementById('cardModalTitle').textContent = 'Editar Flashcard';
    document.getElementById('editCardId').value = index;
    
    document.getElementById('cardQuestion').value = card.question;
    document.getElementById('cardSystem').value = card.system;
    document.getElementById('cardDifficulty').value = card.difficulty;
    
    if (card.type === 'simple') {
        document.getElementById('typeSimple').checked = true;
        document.getElementById('cardAnswer').value = card.answer;
    } else {
        document.getElementById('typeMultiple').checked = true;
        document.getElementById('cardExplanation').value = card.explanation || '';
        
        initializeOptionsContainer();
        card.options.forEach((opt, idx) => {
            const input = document.getElementById(`option${idx}`);
            if (input) {
                input.value = opt;
            }
            if (idx === card.correctIndex) {
                document.getElementById(`correct${idx}`).checked = true;
            }
        });
    }
    
    currentTags = [...card.tags];
    renderTagsContainer();
    toggleCardType();
    
    document.getElementById('cardModal').classList.add('show');
}

function deleteCard(index) {
    if (confirm('¿Estás seguro de eliminar esta flashcard?')) {
        flashcards.splice(index, 1);
        saveData();
        renderLibrary();
        renderSystemSelector();
    }
}

function toggleCardType() {
    const type = document.querySelector('input[name="cardType"]:checked').value;
    
    if (type === 'simple') {
        document.getElementById('simpleAnswerContainer').style.display = 'block';
        document.getElementById('multipleChoiceContainer').style.display = 'none';
    } else {
        document.getElementById('simpleAnswerContainer').style.display = 'none';
        document.getElementById('multipleChoiceContainer').style.display = 'block';
    }
}

function initializeOptionsContainer() {
    const container = document.getElementById('optionsListContainer');
    optionCount = 4;
    
    let html = '';
    for (let i = 0; i < 4; i++) {
        html += createOptionHTML(i);
    }
    container.innerHTML = html;
}

function createOptionHTML(index) {
    return `
        <div class="option-item" id="optionItem${index}">
            <input type="radio" name="correctOption" value="${index}" id="correct${index}">
            <input type="text" id="option${index}" placeholder="Opción ${String.fromCharCode(65 + index)}">
            <button type="button" class="btn btn-danger btn-small" onclick="removeOption(${index})" style="${index < 2 ? 'visibility: hidden;' : ''}">
                🗑️
            </button>
        </div>
    `;
}

function addOption() {
    if (optionCount >= 6) {
        alert('Máximo 6 opciones permitidas');
        return;
    }
    
    const container = document.getElementById('optionsListContainer');
    const newHTML = createOptionHTML(optionCount);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newHTML;
    container.appendChild(tempDiv.firstElementChild);
    
    optionCount++;
}

function removeOption(index) {
    if (optionCount <= 2) {
        alert('Debe haber al menos 2 opciones');
        return;
    }
    
    const item = document.getElementById(`optionItem${index}`);
    if (item) {
        item.remove();
        optionCount--;
    }
}

function saveCard(event) {
    event.preventDefault();
    
    const type = document.querySelector('input[name="cardType"]:checked').value;
    const editId = document.getElementById('editCardId').value;
    
    const cardData = {
        id: editId !== '' ? flashcards[editId].id : Date.now(),
        type: type,
        question: document.getElementById('cardQuestion').value,
        system: document.getElementById('cardSystem').value,
        difficulty: document.getElementById('cardDifficulty').value,
        tags: currentTags,
        createdAt: editId !== '' ? flashcards[editId].createdAt : new Date().toISOString(),
        reviewCount: editId !== '' ? (flashcards[editId].reviewCount || 0) : 0,
        lastReviewed: editId !== '' ? flashcards[editId].lastReviewed : null,
        nextReview: editId !== '' ? (flashcards[editId].nextReview || new Date().toISOString()) : new Date().toISOString(),
        easeFactor: editId !== '' ? (flashcards[editId].easeFactor || 2.5) : 2.5,
        interval: editId !== '' ? (flashcards[editId].interval || 0) : 0,
        isFavorite: editId !== '' ? (flashcards[editId].isFavorite || false) : false
    };
    
    if (type === 'simple') {
        cardData.answer = document.getElementById('cardAnswer').value;
    } else {
        const options = [];
        let correctIndex = 0;
        
        for (let i = 0; i < optionCount; i++) {
            const optionInput = document.getElementById(`option${i}`);
            if (optionInput && optionInput.value.trim() !== '') {
                options.push(optionInput.value.trim());
                
                const correctRadio = document.getElementById(`correct${i}`);
                if (correctRadio && correctRadio.checked) {
                    correctIndex = options.length - 1;
                }
            }
        }
        
        if (options.length < 2) {
            alert('Debe haber al menos 2 opciones');
            return;
        }
        
        cardData.options = options;
        cardData.correctIndex = correctIndex;
        cardData.explanation = document.getElementById('cardExplanation').value;
    }
    
    if (editId !== '') {
        flashcards[editId] = cardData;
    } else {
        flashcards.push(cardData);
    }
    
    saveData();
    closeModal('cardModal');
    renderSystemSelector();
}

// ============================================
// TAGS
// ============================================

function focusTagInput() {
    document.getElementById('tagInput').focus();
}

function handleTagInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const tag = input.value.trim();
        
        if (tag && !currentTags.includes(tag)) {
            currentTags.push(tag);
            renderTagsContainer();
        }
        
        input.value = '';
    }
}

function removeTag(index) {
    currentTags.splice(index, 1);
    renderTagsContainer();
}

function renderTagsContainer() {
    const container = document.getElementById('tagsContainer');
    let html = '';
    
    currentTags.forEach((tag, index) => {
        html += `
            <span class="tag-item">
                ${tag}
                <span class="tag-remove" onclick="removeTag(${index})">×</span>
            </span>
        `;
    });
    
    html += `<input type="text" class="tag-input" id="tagInput" placeholder="Escribe y presiona Enter..." onkeydown="handleTagInput(event)">`;
    
    container.innerHTML = html;
}

// ============================================
// SISTEMA DE PUNTOS XP Y NIVELES
// ============================================

const LEVELS = [
    { level: 1, name: 'Novato', minXP: 0, maxXP: 100, emoji: '🌱' },
    { level: 2, name: 'Estudiante', minXP: 100, maxXP: 300, emoji: '📚' },
    { level: 3, name: 'Practicante', minXP: 300, maxXP: 600, emoji: '👨‍⚕️' },
    { level: 4, name: 'Residente', minXP: 600, maxXP: 1000, emoji: '🩺' },
    { level: 5, name: 'Especialista', minXP: 1000, maxXP: 1500, emoji: '⚕️' },
    { level: 6, name: 'Experto', minXP: 1500, maxXP: 2200, emoji: '🎓' },
    { level: 7, name: 'Maestro', minXP: 2200, maxXP: 3000, emoji: '👑' },
    { level: 8, name: 'Leyenda', minXP: 3000, maxXP: 5000, emoji: '🏆' },
    { level: 9, name: 'Gurú Médico', minXP: 5000, maxXP: 10000, emoji: '🌟' },
    { level: 10, name: 'Dios de la Medicina', minXP: 10000, maxXP: Infinity, emoji: '⚡' }
];

function addXP(points, reason = '') {
    userProfile.xp += points;
    
    const previousLevel = userProfile.level;
    updateLevel();
    
    if (userProfile.level > previousLevel) {
        showLevelUpNotification(userProfile.level);
    }
    
    saveProfile();
    
    if (reason) {
        console.log(`+${points} XP: ${reason}`);
    }
}

function updateLevel() {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (userProfile.xp >= LEVELS[i].minXP) {
            userProfile.level = LEVELS[i].level;
            userProfile.levelName = LEVELS[i].name;
            userProfile.emoji = LEVELS[i].emoji;
            return;
        }
    }
}

function getCurrentLevelInfo() {
    const currentLevelData = LEVELS.find(l => l.level === userProfile.level);
    const nextLevelData = LEVELS.find(l => l.level === userProfile.level + 1);
    
    if (!currentLevelData) return null;
    
    const progressInLevel = userProfile.xp - currentLevelData.minXP;
    const totalNeededForLevel = currentLevelData.maxXP - currentLevelData.minXP;
    const progressPercent = (progressInLevel / totalNeededForLevel) * 100;
    
    return {
        current: currentLevelData,
        next: nextLevelData,
        progressInLevel,
        totalNeededForLevel,
        progressPercent: Math.min(progressPercent, 100),
        xpToNextLevel: nextLevelData ? (nextLevelData.minXP - userProfile.xp) : 0
    };
}

function updateLevelDisplay() {
    const levelInfo = getCurrentLevelInfo();
    if (!levelInfo) return;
    
    const levelBadge = document.getElementById('userLevelBadge');
    if (levelBadge) {
        levelBadge.innerHTML = `
            ${levelInfo.current.emoji} Nivel ${userProfile.level}: ${userProfile.levelName}
            <span style="font-size: 11px; opacity: 0.8; margin-left: 5px;">${userProfile.xp} XP</span>
        `;
    }
}

function showLevelUpNotification(newLevel) {
    const levelData = LEVELS.find(l => l.level === newLevel);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: white;
        padding: 40px 60px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10002;
        text-align: center;
        animation: levelUpPulse 0.6s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 15px;">${levelData.emoji}</div>
        <div>¡NIVEL ${newLevel}!</div>
        <div style="font-size: 18px; margin-top: 10px; opacity: 0.9;">${levelData.name}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function updateStudyStreak() {
    const today = new Date().toDateString();
    const lastStudy = userProfile.lastStudyDate ? new Date(userProfile.lastStudyDate).toDateString() : null;
    
    if (lastStudy === today) {
        return; // Ya estudió hoy
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastStudy === yesterdayStr) {
        // Continúa la racha
        userProfile.studyStreak++;
        if (userProfile.studyStreak % 7 === 0) {
            addXP(50, `🔥 ¡${userProfile.studyStreak} días de racha!`);
        }
    } else if (lastStudy !== today) {
        // Se rompió la racha
        userProfile.studyStreak = 1;
    }
    
    userProfile.lastStudyDate = new Date().toISOString();
    saveProfile();
}

// ============================================
// GRÁFICO DE PROGRESO TEMPORAL
// ============================================

function renderProgressChart(days = 7) {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const today = new Date();
    const dataPoints = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const daySessions = studySessions.filter(s => {
            const sessionDate = new Date(s.started);
            return sessionDate >= date && sessionDate < nextDate;
        });
        
        const totalQuestions = daySessions.reduce((sum, s) => sum + s.total, 0);
        const totalCorrect = daySessions.reduce((sum, s) => sum + s.correct, 0);
        const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : null;
        
        dataPoints.push({
            date: date,
            dateStr: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            accuracy: accuracy,
            sessions: daySessions.length,
            questions: totalQuestions
        });
    }
    
    if (dataPoints.every(d => d.accuracy === null)) {
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-tertiary') || '#9ca3af';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos en este período', width / 2, height / 2);
        document.getElementById('chartLegend').innerHTML = '<em>Completa sesiones de estudio para ver tu progreso</em>';
        return;
    }
    
    const padding = 50;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const maxY = 100;
    
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color') || '#e5e7eb';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
        const y = height - padding - (graphHeight * i / 5);
        const value = (maxY * i / 5).toFixed(0);
        ctx.fillText(value + '%', padding - 10, y + 4);
        
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--bg-tertiary') || '#f3f4f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--primary') || '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    dataPoints.forEach((point, index) => {
        if (point.accuracy !== null) {
            const x = padding + (graphWidth * index / (dataPoints.length - 1));
            const y = height - padding - (graphHeight * point.accuracy / maxY);
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
    });
    ctx.stroke();
    
    ctx.textAlign = 'center';
    dataPoints.forEach((point, index) => {
        const x = padding + (graphWidth * index / (dataPoints.length - 1));
        
        if (days <= 7 || index % Math.ceil(days / 7) === 0 || index === dataPoints.length - 1) {
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#6b7280';
            ctx.fillText(point.dateStr, x, height - padding + 20);
        }
        
        if (point.accuracy !== null) {
            const y = height - padding - (graphHeight * point.accuracy / maxY);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary') || '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary') || '#1f2937';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(point.accuracy.toFixed(0) + '%', x, y - 10);
        }
    });
    
    const totalSessions = dataPoints.reduce((sum, d) => sum + d.sessions, 0);
    const totalQuestions = dataPoints.reduce((sum, d) => sum + d.questions, 0);
    const avgAccuracy = dataPoints.filter(d => d.accuracy !== null).reduce((sum, d, _, arr) => sum + d.accuracy / arr.length, 0);
    
    document.getElementById('chartLegend').innerHTML = `
        <strong>Resumen ${days} días:</strong> 
        ${totalSessions} sesiones • 
        ${totalQuestions} preguntas • 
        Promedio: ${avgAccuracy.toFixed(1)}%
    `;
}

// ============================================
// ESTADÍSTICAS - FIX CRÍTICO
// ============================================

function renderStats() {
    const content = document.getElementById('statsContent');
    
    // Renderizar gráfico de progreso (últimos 7 días por defecto)
    renderProgressChart(7);
    
    // Renderizar heatmap de estudio
    renderStudyHeatmap();
    
    // Actualizar display de XP y niveles
    updateXPDisplay();
    
    if (studySessions.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <h3>No hay sesiones de estudio registradas</h3>
                <p>Completa una sesión de estudio para ver tus estadísticas</p>
            </div>
        `;
        return;
    }
    
    const totalSessions = studySessions.length;
    const totalQuestions = studySessions.reduce((sum, s) => sum + s.total, 0);
    const totalCorrect = studySessions.reduce((sum, s) => sum + s.correct, 0);
    const avgAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
    
    const systemErrors = {};
    studySessions.forEach(session => {
        const systems = session.system.split(', ');
        systems.forEach(sys => {
            if (!systemErrors[sys]) {
                systemErrors[sys] = 0;
            }
            systemErrors[sys] += session.incorrect;
        });
    });
    
    const worstSystem = Object.keys(systemErrors).reduce((a, b) => 
        systemErrors[a] > systemErrors[b] ? a : b
    );
    
    let html = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totalSessions}</div>
                <div class="stat-label">Sesiones Completadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalQuestions}</div>
                <div class="stat-label">Preguntas Respondidas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgAccuracy}%</div>
                <div class="stat-label">Precisión Promedio</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left-color: #ef4444;">
                <div class="stat-value" style="color: #991b1b;">${worstSystem}</div>
                <div class="stat-label">Sistema con Más Errores</div>
            </div>
        </div>
        
        <h3 style="margin: 30px 0 15px 0;">Historial de Sesiones (Últimas 20)</h3>
        <div class="session-history">
    `;
    
    const recentSessions = [...studySessions].reverse();
    recentSessions.forEach(session => {
        const date = new Date(session.started);
        const accuracyClass = session.accuracy >= 80 ? 'good' : session.accuracy >= 60 ? 'medium' : 'poor';
        
        html += `
            <div class="session-item">
                <div class="session-header">
                    <div>
                        <strong>${session.system}</strong>
                        <div class="session-date">${date.toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</div>
                    </div>
                    <div class="session-accuracy ${accuracyClass}">${session.accuracy}%</div>
                </div>
                <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">
                    ✅ ${session.correct} correctas | ❌ ${session.incorrect} incorrectas | Total: ${session.total}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // FIX: Análisis por sistema usando systemStats
    html += `
        <h3 style="margin: 30px 0 15px 0;">Análisis por Sistema</h3>
        <div class="stats-grid">
    `;
    
    Object.keys(systemErrors).forEach(system => {
        let systemCorrect = 0;
        let systemIncorrect = 0;
        
        studySessions.forEach(session => {
            // PRIORIZAR systemStats si existe (nuevo formato)
            if (session.systemStats && session.systemStats[system]) {
                systemCorrect += session.systemStats[system].correct;
                systemIncorrect += session.systemStats[system].incorrect;
            } 
            // Fallback al método antiguo SOLO si no hay systemStats
            else if (session.system.includes(system)) {
                const systems = session.system.split(', ');
                const proportion = 1 / systems.length;
                systemCorrect += Math.round(session.correct * proportion);
                systemIncorrect += Math.round(session.incorrect * proportion);
            }
        });
        
        const systemTotal = systemCorrect + systemIncorrect;
        const systemAccuracy = systemTotal > 0 ? Math.round((systemCorrect / systemTotal) * 100) : 0;
        
        const sysInfo = SYSTEMS.find(s => s.id === system);
        
        html += `
            <div class="stat-card">
                <div style="font-size: 24px; margin-bottom: 5px;">${sysInfo ? sysInfo.emoji : '📚'}</div>
                <div style="font-weight: 600; margin-bottom: 8px;">${system}</div>
                <div class="stat-value" style="font-size: 24px;">${systemAccuracy}%</div>
                <div class="stat-label">${systemTotal} preguntas | ❌ ${systemIncorrect} errores</div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    content.innerHTML = html;
    
    renderSystemLevels();
}

// ============================================
// UTILIDADES
// ============================================

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getDifficultyEmoji(difficulty) {
    const emojis = {
        facil: '😊',
        medio: '😐',
        dificil: '😰'
    };
    return emojis[difficulty] || '😐';
}

function updateTotalCards() {
    document.getElementById('totalCards').textContent = flashcards.length;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// ============================================
// TAB GESTIÓN
// ============================================

function updateManagementTab() {
    document.getElementById('exportTotalCards').textContent = flashcards.length;
    document.getElementById('exportTotalSessions').textContent = studySessions.length;
    
    const flashcardsSize = new Blob([JSON.stringify(flashcards)]).size;
    const sessionsSize = new Blob([JSON.stringify(studySessions)]).size;
    const totalSize = flashcardsSize + sessionsSize;
    
    const sizeKB = (totalSize / 1024).toFixed(2);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    document.getElementById('storageUsed').textContent = 
        totalSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
    
    if (flashcards.length > 0) {
        const lastCard = flashcards.reduce((latest, card) => {
            const cardDate = new Date(card.createdAt);
            const latestDate = new Date(latest.createdAt);
            return cardDate > latestDate ? card : latest;
        });
        
        const lastDate = new Date(lastCard.createdAt);
        document.getElementById('lastUpdate').textContent = lastDate.toLocaleString('es-ES');
    } else {
        document.getElementById('lastUpdate').textContent = 'Sin datos';
    }
    
    // Verificar estado de Service Worker
    checkServiceWorkerStatus();
}

function checkServiceWorkerStatus() {
    const offlineStatusEl = document.getElementById('offlineStatus');
    const swStatusEl = document.getElementById('swStatus');
    
    if (!offlineStatusEl || !swStatusEl) return;
    
    // Estado de conectividad
    if (navigator.onLine) {
        offlineStatusEl.innerHTML = '✅ Online';
        offlineStatusEl.style.color = '#10b981';
    } else {
        offlineStatusEl.innerHTML = '📵 Offline (Funcional)';
        offlineStatusEl.style.color = '#ef4444';
    }
    
    // Estado de Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration()
            .then((registration) => {
                if (registration) {
                    if (registration.active) {
                        swStatusEl.innerHTML = '✅ Activo y funcionando';
                        swStatusEl.style.color = '#10b981';
                        
                        // Obtener tamaño del cache
                        const messageChannel = new MessageChannel();
                        messageChannel.port1.onmessage = (event) => {
                            if (event.data.cacheSize) {
                                swStatusEl.innerHTML = `✅ Activo (${event.data.cacheSize} archivos cacheados)`;
                            }
                        };
                        registration.active.postMessage(
                            { type: 'GET_CACHE_SIZE' },
                            [messageChannel.port2]
                        );
                    } else if (registration.installing) {
                        swStatusEl.innerHTML = '⏳ Instalando...';
                        swStatusEl.style.color = '#f59e0b';
                    } else {
                        swStatusEl.innerHTML = '⚠️ Registrado pero inactivo';
                        swStatusEl.style.color = '#f59e0b';
                    }
                } else {
                    swStatusEl.innerHTML = '❌ No registrado';
                    swStatusEl.style.color = '#ef4444';
                }
            })
            .catch((error) => {
                swStatusEl.innerHTML = '❌ Error al verificar';
                swStatusEl.style.color = '#ef4444';
                console.error('Error checking SW:', error);
            });
    } else {
        swStatusEl.innerHTML = '❌ No soportado';
        swStatusEl.style.color = '#ef4444';
    }
}

function clearServiceWorkerCache() {
    if (!confirm('¿Limpiar el cache del Service Worker?\n\nEsto eliminará los archivos offline temporales pero NO tus flashcards.')) {
        return;
    }
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration()
            .then((registration) => {
                if (registration && registration.active) {
                    const messageChannel = new MessageChannel();
                    messageChannel.port1.onmessage = (event) => {
                        if (event.data.success) {
                            alert('✅ Cache limpiado correctamente\n\nLa app volverá a cachear archivos automáticamente.');
                            checkServiceWorkerStatus();
                        }
                    };
                    
                    registration.active.postMessage(
                        { type: 'CLEAR_CACHE' },
                        [messageChannel.port2]
                    );
                } else {
                    alert('❌ Service Worker no está activo');
                }
            })
            .catch((error) => {
                alert('❌ Error al limpiar cache:\n\n' + error.message);
                console.error('Error clearing cache:', error);
            });
    } else {
        alert('❌ Service Worker no soportado en este navegador');
    }
}

// ============================================
// IMPORTAR/EXPORTAR
// ============================================

function executeImport() {
    const fileInput = document.getElementById('importFileManagement');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor selecciona un archivo JSON');
        return;
    }
    
    const mode = document.querySelector('input[name="importMode"]:checked').value;
    const includeSessions = document.getElementById('importSessions').checked;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.flashcards || !Array.isArray(data.flashcards)) {
                alert('Archivo JSON inválido: no contiene flashcards');
                return;
            }
            
            const importCount = data.flashcards.length;
            const currentCount = flashcards.length;
            
            let confirmMessage = '';
            
            switch(mode) {
                case 'merge':
                    confirmMessage = `¿Combinar ${importCount} flashcards con las ${currentCount} existentes?\n\nLas flashcards con el mismo ID se actualizarán.`;
                    break;
                case 'add':
                    confirmMessage = `¿Agregar ${importCount} flashcards nuevas a las ${currentCount} existentes?\n\nTotal final: ${currentCount + importCount} flashcards`;
                    break;
                case 'replace':
                    confirmMessage = `⚠️ ADVERTENCIA ⚠️\n\n¿Eliminar las ${currentCount} flashcards actuales y reemplazarlas con ${importCount} nuevas?\n\nEsta acción NO se puede deshacer.`;
                    break;
                case 'keep':
                    const newCards = data.flashcards.filter(newCard => 
                        !flashcards.some(existing => existing.id === newCard.id)
                    );
                    confirmMessage = `¿Importar ${newCards.length} flashcards nuevas (de ${importCount} en el archivo)?\n\nSe ignorarán ${importCount - newCards.length} duplicados.`;
                    break;
            }
            
            if (!confirm(confirmMessage)) {
                return;
            }
            
            switch(mode) {
                case 'merge':
                    data.flashcards.forEach(newCard => {
                        const existingIndex = flashcards.findIndex(c => c.id === newCard.id);
                        if (existingIndex >= 0) {
                            flashcards[existingIndex] = newCard;
                        } else {
                            flashcards.push(newCard);
                        }
                    });
                    break;
                    
                case 'add':
                    flashcards.push(...data.flashcards);
                    break;
                    
                case 'replace':
                    flashcards = [...data.flashcards];
                    break;
                    
                case 'keep':
                    data.flashcards.forEach(newCard => {
                        if (!flashcards.some(existing => existing.id === newCard.id)) {
                            flashcards.push(newCard);
                        }
                    });
                    break;
            }
            
            if (includeSessions && data.sessions && Array.isArray(data.sessions)) {
                if (mode === 'replace') {
                    studySessions = [...data.sessions];
                } else {
                    studySessions.push(...data.sessions);
                    if (studySessions.length > 20) {
                        studySessions = studySessions.slice(-20);
                    }
                }
                saveSessions();
            }
            
            saveData();
            updateManagementTab();
            renderSystemSelector();
            renderStats();
            
            fileInput.value = '';
            
            alert(`✅ Importación exitosa!\n\n${flashcards.length} flashcards totales en el sistema`);
            
        } catch (error) {
            alert('❌ Error al importar:\n\n' + error.message);
            console.error('Error de importación:', error);
        }
    };
    
    reader.readAsText(file);
}

function executeExport() {
    const includeS = document.getElementById('exportWithSessions').checked;
    const includeStats = document.getElementById('exportWithStats').checked;
    
    const exportData = {
        version: '2.2',
        exportDate: new Date().toISOString(),
        totalCards: flashcards.length,
        source: 'Flashcards Médicas - Exportación Completa',
        flashcards: flashcards
    };
    
    if (includeS) {
        exportData.sessions = studySessions;
    }
    
    if (includeStats) {
        const totalQuestions = studySessions.reduce((sum, s) => sum + s.total, 0);
        const totalCorrect = studySessions.reduce((sum, s) => sum + s.correct, 0);
        
        exportData.statistics = {
            totalSessions: studySessions.length,
            totalQuestionsAnswered: totalQuestions,
            totalCorrect: totalCorrect,
            totalIncorrect: totalQuestions - totalCorrect,
            averageAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
            systemsCount: new Set(flashcards.map(c => c.system)).size,
            createdAt: new Date().toISOString()
        };
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const timestamp = new Date().toISOString().split('T')[0];
    a.download = `flashcards-completo-${timestamp}.json`;
    
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ Exportación exitosa!\n\n📦 Incluye:\n- ${flashcards.length} flashcards\n${includeS ? `- ${studySessions.length} sesiones` : ''}\n${includeStats ? '- Estadísticas globales' : ''}`);
}

// ============================================
// LIMPIAR DATOS
// ============================================

function clearSessions() {
    if (confirm(`¿Eliminar todas las ${studySessions.length} sesiones de estudio?\n\nLas flashcards se mantendrán intactas.`)) {
        studySessions = [];
        saveSessions();
        renderStats();
        updateManagementTab();
        alert('✅ Sesiones eliminadas correctamente');
    }
}

function clearOldSessions() {
    const currentCount = studySessions.length;
    
    if (currentCount <= 10) {
        alert('Tienes 10 o menos sesiones. No hay sesiones antiguas para eliminar.');
        return;
    }
    
    if (confirm(`¿Mantener solo las últimas 10 sesiones?\n\nSe eliminarán ${currentCount - 10} sesiones antiguas.`)) {
        studySessions = studySessions.slice(-10);
        saveSessions();
        renderStats();
        updateManagementTab();
        alert(`✅ ${currentCount - 10} sesiones antiguas eliminadas\n\nSe mantuvieron las últimas 10`);
    }
}

function clearAllData() {
    const totalCards = flashcards.length;
    const totalSessions = studySessions.length;
    
    const confirmation = prompt(
        `⚠️⚠️⚠️ ADVERTENCIA CRÍTICA ⚠️⚠️⚠️\n\n` +
        `Estás a punto de ELIMINAR:\n` +
        `- ${totalCards} flashcards\n` +
        `- ${totalSessions} sesiones de estudio\n` +
        `- TODO tu progreso\n\n` +
        `Esta acción es IRREVERSIBLE.\n\n` +
        `Escribe "ELIMINAR TODO" para confirmar:`
    );
    
    if (confirmation === 'ELIMINAR TODO') {
        flashcards = [];
        studySessions = [];
        
        saveData();
        saveSessions();
        
        renderLibrary();
        renderStats();
        renderSystemSelector();
        updateManagementTab();
        updateTotalCards();
        
        alert('✅ Todos los datos han sido eliminados');
    } else if (confirmation !== null) {
        alert('❌ Texto incorrecto. Cancelado por seguridad.');
    }
}

function exportData() {
    executeExport();
}

function showImportModal() {
    switchTab('management');
}

function importData() {
    executeImport();
}

// ============================================
// TOGGLE FAVORITE EN SESIÓN
// ============================================

function toggleFavoriteInSession() {
    const card = currentStudyCards[currentCardIndex];
    if (!card) return;
    
    const originalCard = flashcards.find(c => c.id === card.id);
    if (originalCard) {
        originalCard.isFavorite = !originalCard.isFavorite;
        card.isFavorite = originalCard.isFavorite;
        saveData();
        showCurrentCard();
    }
}

// ============================================
// MODO EXAMEN (FALLBACK)
// ============================================

if (typeof startExamMode === 'undefined') {
    function startExamMode() {
        const timeLimit = parseInt(document.getElementById('examTimeLimit').value);
        if (!timeLimit || timeLimit <= 0) return;
        
        examMode = true;
        examTimeLimit = timeLimit * 60;
        examStartTime = Date.now();
        
        const timerDiv = document.createElement('div');
        timerDiv.id = 'examTimer';
        timerDiv.className = 'exam-timer';
        timerDiv.textContent = formatTime(examTimeLimit);
        document.body.appendChild(timerDiv);
        
        examTimerInterval = setInterval(updateExamTimer, 1000);
    }
    
    function updateExamTimer() {
        const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
        const remaining = examTimeLimit - elapsed;
        
        const timerDiv = document.getElementById('examTimer');
        if (!timerDiv) return;
        
        if (remaining <= 0) {
            stopExamMode();
            endStudySession();
            return;
        }
        
        timerDiv.textContent = formatTime(remaining);
        
        timerDiv.style.background = remaining > 300 ? '#10b981' : 
                                     remaining > 60 ? '#f59e0b' : '#ef4444';
        
        if (remaining <= 60) {
            timerDiv.classList.add('pulse');
        }
    }
    
    function stopExamMode() {
        if (examTimerInterval) {
            clearInterval(examTimerInterval);
            examTimerInterval = null;
        }
        
        const timerDiv = document.getElementById('examTimer');
        if (timerDiv) {
            timerDiv.remove();
        }
        
        examMode = false;
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// ============================================
// SERVICE WORKER Y MODO OFFLINE
// ============================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registrado:', registration.scope);
                
                // Escuchar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Hay una nueva versión disponible
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Error al registrar Service Worker:', error);
            });
        
        // Escuchar mensajes del Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'SYNC_COMPLETE') {
                showNotification('✅ Datos sincronizados', 'success');
            }
        });
    }
}

function setupConnectivityListener() {
    // Crear indicador de estado
    const indicator = document.createElement('div');
    indicator.id = 'connectivity-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transition: all 0.3s ease;
        display: none;
    `;
    document.body.appendChild(indicator);
    
    function updateConnectivityStatus() {
        const isOnline = navigator.onLine;
        
        if (isOnline) {
            indicator.style.background = '#10b981';
            indicator.style.color = 'white';
            indicator.textContent = '🌐 Online';
            indicator.style.display = 'block';
            
            // Ocultar después de 3 segundos
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 3000);
            
            // Intentar sincronizar
            if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
                navigator.serviceWorker.ready.then((registration) => {
                    return registration.sync.register('sync-flashcards');
                }).catch((error) => {
                    console.log('Background sync no disponible:', error);
                });
            }
        } else {
            indicator.style.background = '#ef4444';
            indicator.style.color = 'white';
            indicator.textContent = '📵 Modo Offline';
            indicator.style.display = 'block';
        }
    }
    
    // Mostrar estado inicial si está offline
    if (!navigator.onLine) {
        updateConnectivityStatus();
    }
    
    // Escuchar cambios de conectividad
    window.addEventListener('online', updateConnectivityStatus);
    window.addEventListener('offline', updateConnectivityStatus);
}

function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    updateBanner.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <span>🎉 <strong>Nueva versión disponible!</strong> Actualiza para obtener las últimas mejoras.</span>
            <div style="display: flex; gap: 10px;">
                <button onclick="updateApp()" style="background: white; color: #667eea; border: none; padding: 8px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Actualizar Ahora
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer;">
                    Más Tarde
                </button>
            </div>
        </div>
    `;
    
    document.body.insertBefore(updateBanner, document.body.firstChild);
}

function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    
    const colors = {
        success: { bg: '#10b981', text: 'white' },
        error: { bg: '#ef4444', text: 'white' },
        info: { bg: '#3b82f6', text: 'white' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.background = color.bg;
    notification.style.color = color.text;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar animaciones
if (!document.getElementById('notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// HEATMAP DE ESTUDIO
// ============================================

function renderStudyHeatmap() {
    const container = document.getElementById('studyHeatmap');
    if (!container) return;
    
    const days = 90;
    const cellSize = 12;
    const cellGap = 3;
    const today = new Date();
    
    // Preparar datos
    const heatmapData = {};
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const daySessions = studySessions.filter(s => {
            const sessionDate = new Date(s.started).toISOString().split('T')[0];
            return sessionDate === dateStr;
        });
        
        const total = daySessions.reduce((sum, s) => sum + s.total, 0);
        heatmapData[dateStr] = total;
    }
    
    // Determinar intensidad
    const maxQuestions = Math.max(...Object.values(heatmapData), 1);
    
    // Generar HTML del heatmap
    let html = '<div style="display: flex; gap: 3px;">';
    
    // Agrupar por semanas
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);
    
    let currentWeek = [];
    let weekHtml = '';
    
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const count = heatmapData[dateStr] || 0;
        
        const intensity = count === 0 ? 0 : Math.ceil((count / maxQuestions) * 4);
        const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
        const color = colors[intensity];
        
        const dayOfWeek = date.getDay();
        
        currentWeek.push(`
            <div style="width: ${cellSize}px; height: ${cellSize}px; background: ${color}; border-radius: 2px;" 
                 title="${date.toLocaleDateString('es-ES')}: ${count} preguntas">
            </div>
        `);
        
        if (dayOfWeek === 6 || i === days - 1) {
            weekHtml += `<div style="display: flex; flex-direction: column; gap: ${cellGap}px;">${currentWeek.join('')}</div>`;
            currentWeek = [];
        }
    }
    
    html += weekHtml + '</div>';
    container.innerHTML = html;
}

function updateXPDisplay() {
    const levelInfo = getCurrentLevelInfo();
    if (!levelInfo) return;
    
    document.getElementById('levelEmoji').textContent = levelInfo.current.emoji;
    document.getElementById('levelNumber').textContent = `Nivel ${userProfile.level}`;
    document.getElementById('levelTitle').textContent = userProfile.levelName;
    document.getElementById('currentXP').textContent = `${userProfile.xp} XP`;
    document.getElementById('nextLevelXP').textContent = levelInfo.next ? `${levelInfo.next.minXP} XP` : 'MAX';
    document.getElementById('xpProgressBar').style.width = `${levelInfo.progressPercent}%`;
    document.getElementById('streakCount').textContent = userProfile.studyStreak;
    document.getElementById('totalXP').textContent = userProfile.xp;
}
