// Variables globales
let flashcards = [];
let currentSession = {
    active: false,
    cards: [],
    currentIndex: 0,
    selectedSystem: '',
    correctCount: 0,
    incorrectCount: 0
};
let currentTags = [];
let optionCount = 4;

// Inicializar aplicación
function init() {
    loadFlashcards();
    renderLibrary();
    renderSystemSelector();
    updateStats();
    populateFilterSelects();
}

// Cargar flashcards del localStorage
function loadFlashcards() {
    const stored = localStorage.getItem('medical_flashcards');
    if (stored) {
        flashcards = JSON.parse(stored);
    }
}

// Guardar flashcards en localStorage
function saveFlashcards() {
    localStorage.setItem('medical_flashcards', JSON.stringify(flashcards));
}

// Cambiar tab
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('studyTab').style.display = tab === 'study' ? 'block' : 'none';
    document.getElementById('libraryTab').style.display = tab === 'library' ? 'block' : 'none';
    document.getElementById('statsTab').style.display = tab === 'stats' ? 'block' : 'none';

    if (tab === 'library') {
        renderLibrary();
    } else if (tab === 'stats') {
        renderStats();
    } else if (tab === 'study') {
        resetStudy();
    }
}

// Renderizar selector de sistemas para estudio
function renderSystemSelector() {
    const systems = ['Todos', 'Cardiovascular', 'Respiratorio', 'Neurológico', 'Gastrointestinal', 
                     'Renal', 'Endocrino', 'Hematológico', 'Inmunológico', 'Infeccioso', 
                     'Farmacología', 'Pediatría', 'Obstetricia'];
    
    const icons = {
        'Todos': '🎯',
        'Cardiovascular': '❤️',
        'Respiratorio': '🫁',
        'Neurológico': '🧠',
        'Gastrointestinal': '🩺',
        'Renal': '🔬',
        'Endocrino': '⚗️',
        'Hematológico': '🩸',
        'Inmunológico': '🛡️',
        'Infeccioso': '🦠',
        'Farmacología': '💊',
        'Pediatría': '👶',
        'Obstetricia': '🤰'
    };

    const selector = document.getElementById('systemSelector');
    selector.innerHTML = systems.map(system => {
        const count = system === 'Todos' 
            ? flashcards.length 
            : flashcards.filter(c => c.system === system).length;
        
        return `
            <div class="system-option" onclick="selectSystem('${system}')">
                <div style="font-size: 32px; margin-bottom: 10px;">${icons[system]}</div>
                <div style="font-weight: 600;">${system}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">${count} cards</div>
            </div>
        `;
    }).join('');
}

// Seleccionar sistema para estudiar
function selectSystem(system) {
    document.querySelectorAll('.system-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    currentSession.selectedSystem = system;
}

// Iniciar sesión de estudio
function startStudySession() {
    if (!currentSession.selectedSystem) {
        alert('Por favor selecciona un sistema para estudiar');
        return;
    }

    // Filtrar flashcards según sistema
    let cardsToStudy = currentSession.selectedSystem === 'Todos' 
        ? [...flashcards] 
        : flashcards.filter(c => c.system === currentSession.selectedSystem);

    if (cardsToStudy.length === 0) {
        alert('No hay flashcards en este sistema');
        return;
    }

    // Mezclar aleatoriamente
    cardsToStudy = cardsToStudy.sort(() => Math.random() - 0.5);

    // Inicializar sesión
    currentSession.active = true;
    currentSession.cards = cardsToStudy;
    currentSession.currentIndex = 0;
    currentSession.correctCount = 0;
    currentSession.incorrectCount = 0;

    document.getElementById('studySelection').style.display = 'none';
    document.getElementById('studySession').style.display = 'block';
    document.getElementById('sessionSystem').textContent = currentSession.selectedSystem;

    loadCurrentCard();
}

// Cargar flashcard actual
function loadCurrentCard() {
    const card = currentSession.cards[currentSession.currentIndex];
    const container = document.getElementById('flashcardContainer');
    
    document.getElementById('currentCard').textContent = currentSession.currentIndex + 1;
    document.getElementById('totalSessionCards').textContent = currentSession.cards.length;
    document.getElementById('correctCount').textContent = currentSession.correctCount;
    document.getElementById('incorrectCount').textContent = currentSession.incorrectCount;
    
    const progress = ((currentSession.currentIndex + 1) / currentSession.cards.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';

    if (card.type === 'simple') {
        container.innerHTML = renderSimpleCard(card);
    } else {
        container.innerHTML = renderMultipleChoiceCard(card);
    }
}

// Renderizar flashcard simple
function renderSimpleCard(card) {
    return `
        <div class="flashcard" id="currentFlashcard" onclick="flipCard()">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <span class="flashcard-system-badge">${card.system}</span>
                    <div class="flashcard-question">${card.question}</div>
                    <div style="margin-top: 20px; color: #9ca3af; font-size: 14px;">
                        Haz clic para ver la respuesta
                    </div>
                    <div class="flashcard-tags">
                        ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="flashcard-back">
                    <div class="flashcard-answer">${card.answer}</div>
                    <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                        <button class="btn btn-danger" onclick="event.stopPropagation(); answerSimpleCard(false)">
                            ❌ No sabía
                        </button>
                        <button class="btn btn-success" onclick="event.stopPropagation(); answerSimpleCard(true)">
                            ✅ La sabía
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderizar flashcard de opción múltiple
function renderMultipleChoiceCard(card) {
    return `
        <div class="multiple-choice-container">
            <span class="flashcard-system-badge">${card.system}</span>
            <div class="choice-question">${card.question}</div>
            <div class="choices">
                ${card.options.map((option, index) => `
                    <div class="choice-option" onclick="selectChoice(${index})">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </div>
                `).join('')}
            </div>
            <div class="choice-feedback" id="choiceFeedback"></div>
            <div class="flashcard-tags" style="margin-top: 20px;">
                ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
}

// Voltear flashcard simple
function flipCard() {
    document.getElementById('currentFlashcard').classList.toggle('flipped');
}

// Responder flashcard simple
function answerSimpleCard(correct) {
    if (correct) {
        currentSession.correctCount++;
    } else {
        currentSession.incorrectCount++;
    }
    
    nextCard();
}

// Seleccionar opción en flashcard de opción múltiple
function selectChoice(index) {
    const card = currentSession.cards[currentSession.currentIndex];
    const options = document.querySelectorAll('.choice-option');
    const feedback = document.getElementById('choiceFeedback');
    
    // Deshabilitar todas las opciones
    options.forEach(opt => opt.classList.add('disabled'));
    
    // Marcar la seleccionada
    options[index].classList.add('selected');
    
    const isCorrect = index === card.correctOption;
    
    if (isCorrect) {
        options[index].classList.add('correct');
        currentSession.correctCount++;
        feedback.className = 'choice-feedback show correct';
        feedback.innerHTML = `
            <strong>✅ ¡Correcto!</strong><br>
            ${card.explanation ? card.explanation : ''}
        `;
    } else {
        options[index].classList.add('incorrect');
        options[card.correctOption].classList.add('correct');
        currentSession.incorrectCount++;
        feedback.className = 'choice-feedback show incorrect';
        feedback.innerHTML = `
            <strong>❌ Incorrecto</strong><br>
            La respuesta correcta es: <strong>${String.fromCharCode(65 + card.correctOption)}. ${card.options[card.correctOption]}</strong><br>
            ${card.explanation ? `<br>${card.explanation}` : ''}
        `;
    }
    
    // Actualizar contadores
    document.getElementById('correctCount').textContent = currentSession.correctCount;
    document.getElementById('incorrectCount').textContent = currentSession.incorrectCount;
    
    // Avanzar después de 3 segundos
    setTimeout(nextCard, 3000);
}

// Avanzar a siguiente flashcard
function nextCard() {
    currentSession.currentIndex++;
    
    if (currentSession.currentIndex >= currentSession.cards.length) {
        showResults();
    } else {
        loadCurrentCard();
    }
}

// Mostrar resultados de la sesión
function showResults() {
    document.getElementById('studySession').style.display = 'none';
    document.getElementById('studyResults').style.display = 'block';
    
    const total = currentSession.correctCount + currentSession.incorrectCount;
    const accuracy = total > 0 ? Math.round((currentSession.correctCount / total) * 100) : 0;
    
    document.getElementById('resultCorrect').textContent = currentSession.correctCount;
    document.getElementById('resultIncorrect').textContent = currentSession.incorrectCount;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
}

// Terminar sesión de estudio
function endStudySession() {
    if (confirm('¿Estás seguro de terminar la sesión?')) {
        showResults();
    }
}

// Resetear estudio
function resetStudy() {
    currentSession.active = false;
    currentSession.selectedSystem = '';
    document.getElementById('studySelection').style.display = 'block';
    document.getElementById('studySession').style.display = 'none';
    document.getElementById('studyResults').style.display = 'none';
    document.querySelectorAll('.system-option').forEach(opt => opt.classList.remove('selected'));
    renderSystemSelector();
}

// Abrir modal de nueva flashcard
function openNewCardModal() {
    document.getElementById('cardModalTitle').textContent = 'Nueva Flashcard';
    document.getElementById('editCardId').value = '';
    document.getElementById('cardForm').reset();
    currentTags = [];
    renderTags();
    toggleCardType();
    optionCount = 4;
    document.getElementById('cardModal').classList.add('show');
}

// Editar flashcard
function editCard(cardId) {
    const card = flashcards.find(c => c.id === cardId);
    if (!card) return;

    document.getElementById('cardModalTitle').textContent = 'Editar Flashcard';
    document.getElementById('editCardId').value = cardId;
    
    document.getElementById(card.type === 'simple' ? 'typeSimple' : 'typeMultiple').checked = true;
    document.getElementById('cardQuestion').value = card.question;
    
    if (card.type === 'simple') {
        document.getElementById('cardAnswer').value = card.answer;
    } else {
        card.options.forEach((opt, index) => {
            if (document.getElementById(`option${index}`)) {
                document.getElementById(`option${index}`).value = opt;
            }
        });
        document.getElementById(`correct${card.correctOption}`).checked = true;
        document.getElementById('cardExplanation').value = card.explanation || '';
    }
    
    document.getElementById('cardSystem').value = card.system;
    document.getElementById('cardDifficulty').value = card.difficulty;
    
    currentTags = [...card.tags];
    renderTags();
    
    toggleCardType();
    document.getElementById('cardModal').classList.add('show');
}

// Alternar tipo de flashcard
function toggleCardType() {
    const isSimple = document.getElementById('typeSimple').checked;
    
    document.getElementById('simpleAnswerContainer').style.display = isSimple ? 'block' : 'none';
    document.getElementById('multipleChoiceContainer').style.display = isSimple ? 'none' : 'block';
    
    if (isSimple) {
        document.getElementById('cardAnswer').required = true;
    } else {
        document.getElementById('cardAnswer').required = false;
    }
}

// Agregar opción en opción múltiple
function addOption() {
    if (optionCount >= 6) {
        alert('Máximo 6 opciones');
        return;
    }
    
    const container = document.querySelector('.options-container');
    const addBtn = document.getElementById('addOptionBtn');
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-item';
    optionDiv.innerHTML = `
        <input type="radio" name="correctOption" value="${optionCount}" id="correct${optionCount}">
        <input type="text" id="option${optionCount}" placeholder="Opción ${String.fromCharCode(65 + optionCount)}">
        <button type="button" class="btn btn-danger btn-small" onclick="removeOption(${optionCount})">🗑️</button>
    `;
    
    container.insertBefore(optionDiv, addBtn);
    optionCount++;
}

// Manejar entrada de etiquetas
function handleTagInput(event) {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        const input = event.target;
        const value = input.value.trim();
        
        if (value && !currentTags.includes(value)) {
            currentTags.push(value);
            renderTags();
        }
        
        input.value = '';
    }
}

// Renderizar etiquetas
function renderTags() {
    const container = document.getElementById('tagsContainer');
    const input = document.getElementById('tagInput');
    
    const tagsHTML = currentTags.map(tag => `
        <span class="tag-item">
            ${tag}
            <span class="tag-remove" onclick="removeTag('${tag}')">×</span>
        </span>
    `).join('');
    
    container.innerHTML = tagsHTML;
    container.appendChild(input);
}

// Remover etiqueta
function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderTags();
}

// Focus en input de etiquetas
function focusTagInput() {
    document.getElementById('tagInput').focus();
}

// Cerrar modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Guardar flashcard
function saveCard(event) {
    event.preventDefault();
    
    const type = document.getElementById('typeSimple').checked ? 'simple' : 'multiple';
    const editId = document.getElementById('editCardId').value;
    
    const cardData = {
        question: document.getElementById('cardQuestion').value,
        system: document.getElementById('cardSystem').value,
        difficulty: document.getElementById('cardDifficulty').value,
        type: type,
        tags: currentTags
    };
    
    if (type === 'simple') {
        cardData.answer = document.getElementById('cardAnswer').value;
    } else {
        // Recolectar opciones no vacías
        const options = [];
        for (let i = 0; i < optionCount; i++) {
            const optInput = document.getElementById(`option${i}`);
            if (optInput && optInput.value.trim()) {
                options.push(optInput.value.trim());
            }
        }
        
        if (options.length < 2) {
            alert('Debes tener al menos 2 opciones');
            return;
        }
        
        const correctRadio = document.querySelector('input[name="correctOption"]:checked');
        if (!correctRadio) {
            alert('Debes marcar la opción correcta');
            return;
        }
        
        cardData.options = options;
        cardData.correctOption = parseInt(correctRadio.value);
        cardData.explanation = document.getElementById('cardExplanation').value;
    }
    
    if (editId) {
        // Actualizar flashcard existente
        const index = flashcards.findIndex(c => c.id === editId);
        flashcards[index] = { ...flashcards[index], ...cardData };
    } else {
        // Nueva flashcard
        const newCard = {
            ...cardData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            reviewCount: 0,
            lastReviewed: null
        };
        flashcards.push(newCard);
    }
    
    saveFlashcards();
    renderLibrary();
    renderSystemSelector();
    updateStats();
    populateFilterSelects();
    
    closeModal('cardModal');
    alert('✅ Flashcard guardada exitosamente');
}

// Renderizar biblioteca
function renderLibrary() {
    const grid = document.getElementById('libraryGrid');
    const empty = document.getElementById('libraryEmpty');
    
    if (flashcards.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    const filtered = filterFlashcards();
    
    grid.innerHTML = filtered.map(card => `
        <div class="flashcard-card">
            <div class="card-header">
                <span class="card-type ${card.type}">${card.type === 'simple' ? 'Simple' : 'Opción Múltiple'}</span>
            </div>
            <div class="card-question-preview">${card.question}</div>
            <div class="card-meta">
                <span class="card-meta-item">📚 ${card.system}</span>
                <span class="card-meta-item">🎯 ${getDifficultyText(card.difficulty)}</span>
            </div>
            <div class="card-tags">
                ${card.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                ${card.tags.length > 3 ? `<span class="tag">+${card.tags.length - 3}</span>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-primary btn-small" onclick="studySingleCard('${card.id}')">
                    📖 Estudiar
                </button>
                <button class="btn btn-secondary btn-small" onclick="editCard('${card.id}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteCard('${card.id}')">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrar flashcards en biblioteca
function filterFlashcards() {
    const systemFilter = document.getElementById('filterSystem')?.value || '';
    const typeFilter = document.getElementById('filterType')?.value || '';
    const searchQuery = document.getElementById('searchQuery')?.value.toLowerCase() || '';
    
    return flashcards.filter(card => {
        const matchesSystem = !systemFilter || card.system === systemFilter;
        const matchesType = !typeFilter || card.type === typeFilter;
        const matchesSearch = !searchQuery || 
            card.question.toLowerCase().includes(searchQuery) ||
            card.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        
        return matchesSystem && matchesType && matchesSearch;
    });
}

// Aplicar filtros
function filterLibrary() {
    renderLibrary();
}

// Poblar selects de filtros
function populateFilterSelects() {
    const systems = [...new Set(flashcards.map(c => c.system))];
    const systemSelect = document.getElementById('filterSystem');
    
    if (systemSelect) {
        const currentValue = systemSelect.value;
        systemSelect.innerHTML = '<option value="">Todos</option>' + 
            systems.map(s => `<option value="${s}">${s}</option>`).join('');
        systemSelect.value = currentValue;
    }
}

// Obtener texto de dificultad
function getDifficultyText(difficulty) {
    const texts = {
        'facil': '😊 Fácil',
        'medio': '😐 Medio',
        'dificil': '😰 Difícil'
    };
    return texts[difficulty] || difficulty;
}

// Estudiar una sola flashcard
function studySingleCard(cardId) {
    const card = flashcards.find(c => c.id === cardId);
    if (!card) return;
    
    // Crear sesión de estudio con una sola card
    currentSession.active = true;
    currentSession.cards = [card];
    currentSession.currentIndex = 0;
    currentSession.correctCount = 0;
    currentSession.incorrectCount = 0;
    currentSession.selectedSystem = card.system;
    
    // Cambiar a tab de estudio
    switchTab('study');
    document.querySelectorAll('.tab')[0].click();
    
    document.getElementById('studySelection').style.display = 'none';
    document.getElementById('studySession').style.display = 'block';
    document.getElementById('sessionSystem').textContent = card.system;
    
    loadCurrentCard();
}

// Eliminar flashcard
function deleteCard(cardId) {
    if (!confirm('¿Estás seguro de eliminar esta flashcard?')) {
        return;
    }
    
    flashcards = flashcards.filter(c => c.id !== cardId);
    saveFlashcards();
    renderLibrary();
    renderSystemSelector();
    updateStats();
}

// Actualizar estadísticas
function updateStats() {
    document.getElementById('totalCards').textContent = flashcards.length;
}

// Renderizar estadísticas
function renderStats() {
    const statsContent = document.getElementById('statsContent');
    
    if (flashcards.length === 0) {
        statsContent.innerHTML = '<p style="text-align: center; color: #9ca3af;">No hay datos suficientes</p>';
        return;
    }
    
    const systemCounts = {};
    const typeCounts = { simple: 0, multiple: 0 };
    const difficultyCounts = { facil: 0, medio: 0, dificil: 0 };
    
    flashcards.forEach(card => {
        systemCounts[card.system] = (systemCounts[card.system] || 0) + 1;
        typeCounts[card.type]++;
        difficultyCounts[card.difficulty]++;
    });
    
    statsContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${flashcards.length}</div>
                <div class="stat-label">Total de Flashcards</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${typeCounts.simple}</div>
                <div class="stat-label">Simples</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${typeCounts.multiple}</div>
                <div class="stat-label">Opción Múltiple</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Object.keys(systemCounts).length}</div>
                <div class="stat-label">Sistemas Cubiertos</div>
            </div>
        </div>
        
        <h3 style="margin: 30px 0 20px 0;">Por Sistema</h3>
        <div class="stats-grid">
            ${Object.entries(systemCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([system, count]) => `
                    <div class="stat-card">
                        <div class="stat-value">${count}</div>
                        <div class="stat-label">${system}</div>
                    </div>
                `).join('')}
        </div>
        
        <h3 style="margin: 30px 0 20px 0;">Por Dificultad</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${difficultyCounts.facil}</div>
                <div class="stat-label">😊 Fácil</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${difficultyCounts.medio}</div>
                <div class="stat-label">😐 Medio</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${difficultyCounts.dificil}</div>
                <div class="stat-label">😰 Difícil</div>
            </div>
        </div>
    `;
}

// Exportar datos
function exportData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalCards: flashcards.length,
        flashcards: flashcards
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Flashcards_Medicas_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Flashcards exportadas exitosamente');
}

// Mostrar modal de importación
function showImportModal() {
    document.getElementById('importModal').classList.add('show');
}

// Importar datos
function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor selecciona un archivo');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (!importedData.flashcards || !Array.isArray(importedData.flashcards)) {
                throw new Error('Formato de archivo inválido');
            }
            
            // Agregar flashcards importadas (sin reemplazar las existentes)
            const newCards = importedData.flashcards.filter(imported => 
                !flashcards.some(existing => existing.id === imported.id)
            );
            
            flashcards.push(...newCards);
            saveFlashcards();
            renderLibrary();
            renderSystemSelector();
            updateStats();
            populateFilterSelects();
            
            closeModal('importModal');
            alert(`✅ ${newCards.length} flashcard(s) importadas exitosamente`);
        } catch (error) {
            alert(`❌ Error al importar:\n${error.message}`);
        }
    };
    
    reader.readAsText(file);
}

// Inicializar aplicación al cargar
window.addEventListener('DOMContentLoaded', init);

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker-flashcards.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Error:', err));
    });
}
