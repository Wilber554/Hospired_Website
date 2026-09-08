(function () {
    const STORAGE_KEY = 'hospired_accessibility_preferences';
    const defaults = {
        highContrast: false,
        darkMode: false,
        spacing: false,
        dyslexia: false,
        colorblindMode: 'none',
        largeCursor: false,
        oneHand: false,
        screenReader: false,
        monochrome: false,
        textScale: 0,
        language: 'es'
    };

    const prefClassMap = {
        highContrast: 'global-high-contrast',
        darkMode: 'global-dark-mode',
        spacing: 'global-spacing',
        dyslexia: 'global-dyslexia',
        largeCursor: 'global-large-cursor',
        oneHand: 'global-one-hand',
        monochrome: 'global-monochrome'
    };

    const translationDictionary = {
        'inicio': 'Home', 'mis citas': 'My appointments', 'laboratorios': 'Laboratories', 'hospitales': 'Hospitals',
        'notificaciones': 'Notifications', 'soporte y ayuda': 'Help and support', 'sobre nosotros': 'About us',
        'perfil': 'Profile', 'mi cuenta': 'My account', 'buscar': 'Search', 'buscar servicios...': 'Search services...',
        'ver información completa': 'View full information', 'reservar cita': 'Book appointment', 'cerrar': 'Close',
        'continuar': 'Continue', 'editar información': 'Edit information', 'cerrar sesión': 'Log out', 'dirección': 'Address',
        'teléfono de contacto': 'Contact phone', 'horarios de atención': 'Opening hours', 'servicios y especialidades': 'Services and specialties',
        'ajustes de accesibilidad': 'Accessibility settings', 'preferencias': 'Preferences',
        'activa las opciones que mejoran la lectura y el uso del sitio.': 'Enable options that improve reading and site use.',
        'contraste alto': 'High contrast', 'aumentar texto': 'Increase text', 'disminuir texto': 'Decrease text',
        'espaciado': 'Spacing', 'fuente dislexia': 'Dyslexia font', 'daltonismo': 'Color blindness', 'cursor grande': 'Large cursor',
        'modo a una mano': 'One-hand mode', 'lector de pantalla': 'Screen reader', 'modo oscuro': 'Dark mode',
        'monocromático': 'Monochrome', 'cambiar idioma': 'Change language', 'restablecer ajustes': 'Reset settings',
        'nombre completo': 'Full name', 'email': 'Email', 'teléfono': 'Phone', 'edad': 'Age', 'seguro': 'Insurance', 'hospital anterior': 'Previous hospital',
        'centro de notificaciones e historial de citas': 'Notifications and appointment history', 'historial y gestión de citas': 'Appointment history and management',
        'todas las citas': 'All appointments', 'próximas': 'Upcoming', 'canceladas': 'Cancelled', 'antiguas / historial': 'Past / history',
        'no hay registros de citas en esta categoría.': 'There are no appointments in this category.',
        'agendamiento único de citas médicas y exámenes': 'Unified medical appointment and laboratory booking',
        'datos del paciente': 'Patient information', 'detalles de la cita': 'Appointment details', 'fecha deseada': 'Preferred date',
        'horario disponible': 'Available time', 'motivo de consulta o indicaciones especiales': 'Reason for visit or special instructions',
        'enviar comentario': 'Submit review', 'no disponible': 'Not available', 'abrir opciones de accesibilidad': 'Open accessibility options',
        'buscar servicios médicos': 'Search medical services', 'no se encontraron resultados': 'No results found', '¿listo para agendar tu cita médica?': 'Ready to schedule your medical appointment?',
        'si te cuesta navegar por menús tradicionales, prueba nuestro asistente interactivo guiado paso a paso.': 'If you have trouble navigating traditional menus, try our interactive guided assistant step by step.',
        '¿te ayudamos a encontrar tu cita? (ruta guiada)': 'Can we help you find your appointment? (guided path)',
        'paso': 'Step', 'de': 'of', 'cerrado': 'Closed',
        'nosotros': 'About Us', '¿quiénes somos?': 'Who are we?', 'nuestra misión': 'Our Mission', 'nuestra visión': 'Our Vision',
        'cómo funciona': 'How it works', 'ayuda y legal': 'Help & Legal', 'soporte técnico': 'Technical support',
        'ayuda urgente': 'Urgent help', 'términos y condiciones': 'Terms & conditions', 'política de privacidad': 'Privacy policy',
        'contáctanos': 'Contact us', '© 2026 hospired. todos los derechos reservados. diseñado con enfoque en accesibilidad universal.': '© 2026 Hospired. All rights reserved. Designed with a focus on universal accessibility.',
        'búsqueda': 'Search', 'reserva': 'Booking', 'atención': 'Care', 'paso 2': 'Step 2', 'paso 3': 'Step 3', 'paso 4': 'Step 4',
        'explorar': 'Explore', 'reservar': 'Book',
        // Panel terms
        'central dashboard': 'Central Dashboard', 'hospital profile': 'Hospital Profile', 'patient control': 'Patient Control',
        'agenda & consultations': 'Agenda & Consultations', 'patient history': 'Patient History',
        'management menu': 'Management Menu', 'technical support': 'Technical Support',
        'inclusive management': 'Inclusive Management', 'barrier-free healthcare for el salvador': 'Barrier-Free Healthcare for El Salvador',
        'register new record': 'Register New Record', 'patients treated': 'Patients Treated',
        'active consultations': 'Active Consultations', 'pending procedures': 'Pending Procedures',
        'weekly inclusive care flow': 'Weekly Inclusive Care Flow', 'comparative intake of patients with accessibility requirements.': 'Comparative intake of patients with accessibility requirements.',
        'general record directory': 'General Record Directory', 'patient registry': 'Patient Registry',
        'hospital institutional profile': 'Hospital Institutional Profile', 'manage operational parameters and public protocols of your medical center.': 'Manage operational parameters and public protocols of your medical center.',
        'affiliation code': 'Affiliation Code', 'director / medical officer': 'Director / Medical Officer',
        'emergency phone': 'Emergency Phone', 'center type': 'Center Type', 'location': 'Location',
        'active accessibility protocols': 'Active Accessibility Protocols', 'save institutional changes': 'Save Institutional Changes',
        'search record, doctor or patient...': 'Search record, doctor or patient...'
    };

    const keyedDictionary = {
        flujo_atencion: { es: 'Flujo de atención', en: 'Care flow' },
        proceso_titulo: { es: '¿Cómo funciona nuestra plataforma?', en: 'How does our platform work?' },
        proceso_resumen: { es: 'Conecta tu bienestar con una experiencia clara, rápida y pensada para cada paciente.', en: 'Connect your wellbeing with a clear, fast experience designed for every patient.' },
        paso1_tag: { es: 'Paso 1', en: 'Step 1' },
        paso1_titulo: { es: 'Registro', en: 'Sign up' },
        paso1_desc: { es: 'Regístrate en la plataforma completando tus datos personales básicos de manera rápida y segura.', en: 'Sign up on the platform by filling in your basic personal details quickly and securely.' },
        paso1_cta: { es: 'Comenzar', en: 'Start' },
        paso1_aria: { es: 'Paso 1: Registro. Regístrate en la plataforma completando tus datos personales básicos de manera segura.', en: 'Step 1: Sign up. Sign up on the platform by filling in your basic personal details securely.' }
    };

    let preferences = loadPreferences();
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();
    let isTranslating = false;
    let translateQueued = false;

    function loadPreferences() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            if (saved.colorblind && !saved.colorblindMode) saved.colorblindMode = 'protanopia';
            return { ...defaults, ...saved };
        } catch (error) {
            return { ...defaults };
        }
    }

    function savePreferences() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }

    function applyTextScaleClasses() {
        const root = document.documentElement;
        const scaleClasses = ['global-text-plus-1', 'global-text-plus-2', 'global-text-minus-1', 'global-text-minus-2'];
        scaleClasses.forEach(className => root.classList.remove(className));

        if (preferences.textScale > 0) {
            root.classList.add(`global-text-plus-${preferences.textScale}`);
        } else if (preferences.textScale < 0) {
            root.classList.add(`global-text-minus-${Math.abs(preferences.textScale)}`);
        }

        if (preferences.textScale === 0) {
            root.style.fontSize = '';
            document.body.style.fontSize = '';
        } else {
            const percentage = 100 + (preferences.textScale * 10);
            root.style.fontSize = `${percentage}%`;
            document.body.style.fontSize = `${percentage}%`;
        }
    }

    function applyPreferences() {
        const root = document.documentElement;
        Object.entries(prefClassMap).forEach(([key, className]) => {
            root.classList.toggle(className, Boolean(preferences[key]));
        });

        root.classList.remove('global-protanopia', 'global-deuteranopia', 'global-tritanopia');
        if (preferences.colorblindMode && preferences.colorblindMode !== 'none') {
            root.classList.add(`global-${preferences.colorblindMode}`);
        }

        // Clases alias solicitadas explícitamente para compatibilidad externa
        root.classList.toggle('font-dislexia', Boolean(preferences.dyslexia));
        root.classList.toggle('alto-contraste', Boolean(preferences.highContrast));
        root.classList.toggle('modo-daltonismo', preferences.colorblindMode !== 'none');

        applyTextScaleClasses();
        root.lang = preferences.language || 'es';
        syncControls();
        translateInterface();
    }

    function syncControls() {
        const controlMap = {
            'opt-contrast': preferences.highContrast,
            'opt-spacing': preferences.spacing,
            'opt-dyslexia': preferences.dyslexia,
            'opt-colorblind': preferences.colorblindMode !== 'none',
            'opt-cursor': preferences.largeCursor,
            'opt-onehand': preferences.oneHand,
            'opt-screenreader': preferences.screenReader,
            'opt-darkmode': preferences.darkMode,
            'opt-monochrome': preferences.monochrome,
            'global-opt-contrast': preferences.highContrast,
            'global-opt-spacing': preferences.spacing,
            'global-opt-dyslexia': preferences.dyslexia,
            'global-opt-colorblind': preferences.colorblindMode !== 'none',
            'global-opt-cursor': preferences.largeCursor,
            'global-opt-onehand': preferences.oneHand,
            'global-opt-screenreader': preferences.screenReader,
            'global-opt-darkmode': preferences.darkMode,
            'global-opt-monochrome': preferences.monochrome
        };

        Object.entries(controlMap).forEach(([id, active]) => {
            const button = document.getElementById(id);
            if (!button) return;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });

        const textPlus = document.getElementById('opt-text-plus') || document.getElementById('global-opt-text-plus');
        const textMinus = document.getElementById('opt-text-minus') || document.getElementById('global-opt-text-minus');
        textPlus?.setAttribute('aria-pressed', String(preferences.textScale > 0));
        textMinus?.setAttribute('aria-pressed', String(preferences.textScale < 0));
    }

    function normalizeTranslationKey(value) {
        return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function translateTextValue(value) {
        const normalized = normalizeTranslationKey(value);
        return translationDictionary[normalized] || value;
    }

    function translateInterface() {
        if (isTranslating || !document.body) return;
        isTranslating = true;

        try {
            const isEnglish = preferences.language === 'en';
            
            // Translate elements with data-en and data-es attributes
            document.querySelectorAll('[data-en][data-es]').forEach(element => {
                const targetText = isEnglish ? element.dataset.en : element.dataset.es;
                if (targetText && element.textContent !== targetText) element.textContent = targetText;
            });

            // Translate i18n elements
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const entry = keyedDictionary[key];
                const fallback = element.getAttribute('data-default') || element.textContent;
                const targetText = entry ? (isEnglish ? entry.en : entry.es) : fallback;
                if (targetText && element.textContent !== targetText) element.textContent = targetText;
            });

            // Translate i18n attributes
            document.querySelectorAll('[data-i18n-attr]').forEach(element => {
                element.getAttribute('data-i18n-attr').split(',').forEach(pair => {
                    const [attribute, key] = pair.split(':').map(part => part.trim());
                    if (!attribute || !key) return;
                    const entry = keyedDictionary[key];
                    if (!entry) return;
                    const targetValue = isEnglish ? entry.en : entry.es;
                    if (targetValue && element.getAttribute(attribute) !== targetValue) {
                        element.setAttribute(attribute, targetValue);
                    }
                });
            });

            // Recursively translate all text nodes in all containers
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);

            nodes.forEach(node => {
                if (!node || !node.nodeValue || !node.parentElement) return;
                if (node.parentElement.closest('script, style, textarea, input, noscript, svg')) return;
                const currentTrimmed = node.nodeValue.trim();
                if (!currentTrimmed) return;
                const base = originalText.get(node) || currentTrimmed;
                originalText.set(node, base);
                const translated = isEnglish ? translateTextValue(base) : base;
                const targetText = node.nodeValue.replace(currentTrimmed, translated);
                if (targetText !== node.nodeValue) node.nodeValue = targetText;
            });

            // Translate all placeholder, aria-label, title, alt attributes recursively
            document.querySelectorAll('[placeholder], [aria-label], [title], [alt], [data-label]').forEach(element => {
                ['placeholder', 'aria-label', 'title', 'alt', 'data-label'].forEach(attribute => {
                    const value = element.getAttribute(attribute);
                    if (!value) return;
                    const values = originalAttributes.get(element) || {};
                    const base = values[attribute] || value;
                    values[attribute] = base;
                    originalAttributes.set(element, values);
                    const translated = isEnglish ? translateTextValue(base) : base;
                    if (translated !== value) element.setAttribute(attribute, translated);
                });
            });

            // Specific search input handling
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                const placeholders = {
                    es: 'Buscar servicios...',
                    en: 'Search services...'
                };
                const label = {
                    es: 'Buscar servicios médicos',
                    en: 'Search medical services'
                };
                const targetPlaceholder = placeholders[preferences.language] || placeholders.es;
                const targetLabel = label[preferences.language] || label.es;
                if (searchInput.placeholder !== targetPlaceholder) searchInput.placeholder = targetPlaceholder;
                if (searchInput.getAttribute('aria-label') !== targetLabel) searchInput.setAttribute('aria-label', targetLabel);
            }

            // Specific global search input handling for panel
            const globalSearchInput = document.getElementById('globalSearchInput');
            if (globalSearchInput) {
                const placeholders = {
                    es: 'Buscar registro, doctor o paciente...',
                    en: 'Search record, doctor or patient...'
                };
                const targetPlaceholder = placeholders[preferences.language] || placeholders.es;
                if (globalSearchInput.placeholder !== targetPlaceholder) globalSearchInput.placeholder = targetPlaceholder;
            }

            // Accessibility button label
            const trigger = document.getElementById('accessibilityBtn');
            if (trigger) {
                const targetLabel = preferences.language === 'en' ? 'Open accessibility options' : 'Abrir opciones de accesibilidad';
                if (trigger.getAttribute('aria-label') !== targetLabel) trigger.setAttribute('aria-label', targetLabel);
            }
        } finally {
            isTranslating = false;
        }
    }

    function togglePreference(key) {
        if (key === 'highContrast' && !preferences.highContrast) {
            preferences.darkMode = false;
        }
        if (key === 'darkMode' && !preferences.darkMode) {
            preferences.highContrast = false;
        }

        preferences[key] = !preferences[key];
        savePreferences();
        applyPreferences();
        announce(preferences[key] ? 'Opción activada' : 'Opción desactivada');
    }

    function cycleColorblind() {
        const modes = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];
        const index = modes.indexOf(preferences.colorblindMode);
        preferences.colorblindMode = modes[(index + 1) % modes.length];
        savePreferences();
        applyPreferences();
        announce(preferences.colorblindMode === 'none' ? 'Daltonismo desactivado' : `Filtro ${preferences.colorblindMode} activado`);
    }

    function adjustText(direction) {
        preferences.textScale = Math.max(-2, Math.min(2, preferences.textScale + direction));
        savePreferences();
        applyPreferences();
    }

    function togglePanel(event) {
        event?.stopPropagation();
        const panel = document.getElementById('accessibilityMenu');
        const trigger = document.getElementById('accessibilityBtn');
        if (!panel) return;
        const open = panel.classList.toggle('show');
        trigger?.setAttribute('aria-expanded', String(open));
    }

    function changeLanguage() {
        preferences.language = preferences.language === 'es' ? 'en' : 'es';
        savePreferences();
        applyPreferences();
        window.dispatchEvent(new CustomEvent('hospired-language-change', { detail: { language: preferences.language } }));
        announce(preferences.language === 'en' ? 'Language changed to English' : 'Idioma cambiado a español');
    }

    function cambiarIdioma(lang) {
        if (lang !== 'es' && lang !== 'en') return;
        preferences.language = lang;
        savePreferences();
        applyPreferences();
        window.dispatchEvent(new CustomEvent('hospired-language-change', { detail: { language: preferences.language } }));
        announce(lang === 'en' ? 'Language changed to English' : 'Idioma cambiado a español');
    }

    function activateScreenReader() {
        togglePreference('screenReader');
        if (!preferences.screenReader && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            return;
        }
        if (preferences.screenReader && 'speechSynthesis' in window) {
            const message = preferences.language === 'en' ? 'Screen reader enabled' : 'Lector de pantalla activado';
            const utterance = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }

    function bindScreenReader() {
        document.addEventListener('focusin', event => {
            if (!preferences.screenReader || !('speechSynthesis' in window)) return;
            const target = event.target;
            
            // Try multiple sources for text content in order of priority
            let text = target.getAttribute('aria-label') || 
                      target.getAttribute('title') || 
                      target.getAttribute('data-label') ||
                      target.value || 
                      target.getAttribute('placeholder') ||
                      target.textContent ||
                      '';
            
            // Get text from all descendant nodes if element has no direct label
            if (!text || !text.trim()) {
                const walker = document.createTreeWalker(
                    target, 
                    NodeFilter.SHOW_TEXT, 
                    null
                );
                let node;
                const texts = [];
                while (node = walker.nextNode()) {
                    const trimmedText = node.textContent.trim();
                    if (trimmedText) texts.push(trimmedText);
                }
                text = texts.join(' ');
            }
            
            if (!text || typeof text !== 'string' || !text.trim()) return;
            
            const utterance = new SpeechSynthesisUtterance(text.trim());
            utterance.lang = preferences.language === 'en' ? 'en-US' : 'es-ES';
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        });
    }

    function resetAccessibility() {
        preferences = { ...defaults };
        savePreferences();
        applyPreferences();
        announce('Ajustes restablecidos');
    }

    function announce(message) {
        const region = document.getElementById('accessibilityLiveRegion');
        if (region) region.textContent = message;
    }

    function bindDraggablePanel() {
        const panel = document.getElementById('accessibilityMenu');
        const handle = panel?.querySelector('.accessibility-header');
        if (!panel || !handle || handle.dataset.dragBound) return;

        handle.dataset.dragBound = 'true';
        let startX = 0;
        let startY = 0;
        let panelX = 0;
        let panelY = 0;

        const movePanel = event => {
            const maxX = Math.max(0, window.innerWidth - panel.offsetWidth);
            const maxY = Math.max(0, window.innerHeight - panel.offsetHeight);
            const nextX = Math.min(maxX, Math.max(0, panelX + event.clientX - startX));
            const nextY = Math.min(maxY, Math.max(0, panelY + event.clientY - startY));
            panel.style.left = `${nextX}px`;
            panel.style.top = `${nextY}px`;
        };

        const stopDragging = () => {
            document.removeEventListener('pointermove', movePanel);
            document.removeEventListener('pointerup', stopDragging);
            document.removeEventListener('pointercancel', stopDragging);
        };

        handle.addEventListener('pointerdown', event => {
            if (event.button !== 0) return;
            const bounds = panel.getBoundingClientRect();
            startX = event.clientX;
            startY = event.clientY;
            panelX = bounds.left;
            panelY = bounds.top;
            panel.style.left = `${panelX}px`;
            panel.style.top = `${panelY}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            handle.setPointerCapture?.(event.pointerId);
            document.addEventListener('pointermove', movePanel);
            document.addEventListener('pointerup', stopDragging);
            document.addEventListener('pointercancel', stopDragging);
        });
    }

    function createPanel() {
        if (document.querySelector('.accessibility-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'accessibility-wrapper';
        wrapper.id = 'globalAccessibilityWrapper';
        wrapper.innerHTML = `
            <button id="accessibilityBtn" class="accessibility-trigger-btn" type="button" aria-label="Abrir opciones de accesibilidad" aria-haspopup="true" aria-expanded="false" aria-controls="accessibilityMenu">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="26" height="26" fill="currentColor" aria-hidden="true">
                    <path d="M256,0C114.6,0,0,114.6,0,256s114.6,256,256,256s256-114.6,256-256S397.4,0,256,0z M256,472c-119.1,0-216-96.9-216-216S136.9,40,256,40s216,96.9,216,216S375.1,472,256,472z M256,72c19.9,0,36,16.1,36,36s-16.1,36-36,36s-36-16.1-36-36S236.1,72,256,72z M392,184c0,13.2-10.8,24-24,24h-64v208c0,13.2-10.8,24-24,24h-16c-13.2,0-24-10.8-24-24V288h-16v128c0,13.2-10.8,24-24,24h-16c-13.2,0-24-10.8-24-24V208h-64c-13.2,0-24-10.8-24-24v-16c0-13.2,10.8-24,24-24h216c13.2,0,24,10.8,24,24V184z"/>
                </svg>
            </button>
            <div id="accessibilityMenu" class="accessibility-panel" role="region" aria-label="Herramientas de accesibilidad">
                <div class="accessibility-header">
                    <p class="accessibility-kicker">Preferencias</p>
                    <h3>Ajustes de accesibilidad</h3>
                    <p class="accessibility-subtitle">Activa las opciones que mejoran la lectura y el uso del sitio.</p>
                </div>
                <div class="accessibility-grid">
                    <button type="button" id="global-opt-contrast" class="access-option-btn" data-pref="highContrast"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"></path></svg></span><span>Contraste alto</span></button>
                    <button type="button" id="global-opt-text-plus" class="access-option-btn" data-text="1"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span><span>Aumentar texto</span></button>
                    <button type="button" id="global-opt-text-minus" class="access-option-btn" data-text="-1"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg></span><span>Disminuir texto</span></button>
                    <button type="button" id="global-opt-spacing" class="access-option-btn" data-pref="spacing"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 8 21 12 17 16"></polyline><polyline points="7 8 3 12 7 16"></polyline><line x1="3" y1="12" x2="21" y2="12"></line></svg></span><span>Espaciado</span></button>
                    <button type="button" id="global-opt-dyslexia" class="access-option-btn" data-pref="dyslexia"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span><span>Fuente dislexia</span></button>
                    <button type="button" id="global-opt-colorblind" class="access-option-btn" data-colorblind="true"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span><span>Daltonismo</span></button>
                    <button type="button" id="global-opt-cursor" class="access-option-btn" data-pref="largeCursor"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7 18 3-7 7-3L3 3z"></path></svg></span><span>Cursor grande</span></button>
                    <button type="button" id="global-opt-onehand" class="access-option-btn" data-pref="oneHand"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v6"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v9"></path><path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-16 0v-2"></path></svg></span><span>Modo a una mano</span></button>
                    <button type="button" id="global-opt-screenreader" class="access-option-btn" data-screenreader="true"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span><span>Lector de pantalla</span></button>
                    <button type="button" id="global-opt-darkmode" class="access-option-btn" data-pref="darkMode"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></span><span>Modo oscuro</span></button>
                    <button type="button" id="global-opt-monochrome" class="access-option-btn" data-pref="monochrome"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg></span><span>Monocromático</span></button>
                    <button type="button" id="global-opt-language" class="access-option-btn" data-language="true"><span class="access-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span><span>Cambiar idioma</span></button>
                </div>
                <div class="accessibility-footer">
                    <button type="button" id="globalAccessibilityReset" class="access-option-btn">Restablecer ajustes</button>
                </div>
            </div>
        `;

        document.body.appendChild(wrapper);
        wrapper.querySelector('#accessibilityBtn').addEventListener('click', togglePanel);
        wrapper.querySelectorAll('[data-pref]').forEach(button => button.addEventListener('click', () => togglePreference(button.dataset.pref)));
        wrapper.querySelectorAll('[data-text]').forEach(button => button.addEventListener('click', () => adjustText(Number(button.dataset.text))));
        wrapper.querySelector('[data-screenreader]').addEventListener('click', activateScreenReader);
        wrapper.querySelector('[data-colorblind]').addEventListener('click', cycleColorblind);
        wrapper.querySelector('[data-language]').addEventListener('click', changeLanguage);
        wrapper.querySelector('#globalAccessibilityReset').addEventListener('click', resetAccessibility);
    }

    function exposeLegacyFunctions() {
        window.toggleAccessibility = className => {
            const map = {
                'high-contrast': 'highContrast',
                'spacing-active': 'spacing',
                'dyslexia-font': 'dyslexia',
                'cursor-plus': 'largeCursor',
                'onehand-active': 'oneHand',
                'dark-mode': 'darkMode',
                'monochrome-active': 'monochrome',
                'colorblind-mode': 'colorblindMode'
            };
            if (map[className]) togglePreference(map[className]);
        };
        window.adjustText = adjustText;
        window.activateColorblind = cycleColorblind;
        window.activateScreenreader = activateScreenReader;
        window.changeLanguage = changeLanguage;
        window.cambiarIdioma = cambiarIdioma;
        window.resetAccessibility = resetAccessibility;
    }

    // Menu hamburguesa para el sidebar vertical compartido (index.css: .sidebar/.vertical-menu).
    // No aplica a panel-hospital, que tiene su propio menu movil independiente.
    function initSidebarMobileNav() {
        const sidebar = document.querySelector('.sidebar');
        const menu = sidebar?.querySelector('.vertical-menu');
        if (!sidebar || !menu || document.getElementById('sidebarMobileToggle')) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.id = 'sidebarMobileToggle';
        toggle.className = 'sidebar-mobile-toggle';
        toggle.setAttribute('aria-label', 'Abrir menu de navegacion');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'sidebarVerticalMenu');
        toggle.innerHTML = '<svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        document.body.appendChild(toggle);
        menu.id = menu.id || 'sidebarVerticalMenu';

        function closeSidebar() {
            sidebar.classList.remove('sidebar-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
        function toggleSidebar() {
            const isOpen = sidebar.classList.toggle('sidebar-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        }

        toggle.addEventListener('click', toggleSidebar);
        menu.querySelectorAll('.menu-item').forEach(item => item.addEventListener('click', closeSidebar));
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeSidebar();
        });
        document.addEventListener('click', event => {
            // event.target puede ser el <svg>/<line> interno del boton, nunca el <button> mismo;
            // comparar con !== toggle cerraba el menu en el mismo click que lo abria.
            if (sidebar.classList.contains('sidebar-open') && !sidebar.contains(event.target) && !toggle.contains(event.target)) {
                closeSidebar();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        createPanel();
        bindDraggablePanel();
        exposeLegacyFunctions();
        applyPreferences();
        bindScreenReader();
        initSidebarMobileNav();

        const scheduleTranslate = () => {
            if (translateQueued || isTranslating) return;
            translateQueued = true;
            requestAnimationFrame(() => {
                translateQueued = false;
                translateInterface();
            });
        };

        const observer = new MutationObserver(mutations => {
            if (isTranslating) return;
            const shouldTranslate = mutations.some(mutation => {
                if (mutation.type !== 'childList') return false;
                return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
            });
            if (shouldTranslate) scheduleTranslate();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        document.addEventListener('click', event => {
            const menu = document.getElementById('accessibilityMenu');
            if (menu && !event.target.closest('.accessibility-wrapper')) {
                menu.classList.remove('show');
                const btn = document.getElementById('accessibilityBtn');
                btn?.setAttribute('aria-expanded', 'false');
            }
        });
    });
})();
