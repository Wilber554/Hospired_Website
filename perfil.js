
(function () {
    // Antes ambos roles compartian una sola clave ('hospiredProfile'), asi que subir
    // una foto como paciente sobreescribia la foto/datos de la institucion y viceversa.
    // Ahora cada rol tiene su propia clave; el contexto (carpeta de la pagina) decide cual usar.
    const LEGACY_PROFILE_KEY = 'hospiredProfile';
    const PATIENT_KEY = 'hospired_patient_profile';
    const INSTITUTION_KEY = 'hospired_institution_profile';
    const INSTITUTION_AFFILIATION_KEY = 'hospired_institution_affiliation';

    function isInstitutionContext() {
        return window.location.pathname.includes('/Panel.De.Instituciones/');
    }

    // Migracion unica: reubica el perfil legado en la clave que le corresponda
    // segun su propio campo role/institutionName, sin mezclarlo con el otro rol.
    function migrateLegacyProfile() {
        try {
            const legacyRaw = localStorage.getItem(LEGACY_PROFILE_KEY);
            if (!legacyRaw) return;
            const legacy = JSON.parse(legacyRaw);
            const isInst = legacy.role === 'institution' || Boolean(legacy.institutionName);
            const targetKey = isInst ? INSTITUTION_KEY : PATIENT_KEY;
            if (!localStorage.getItem(targetKey)) {
                localStorage.setItem(targetKey, legacyRaw);
            }
            localStorage.removeItem(LEGACY_PROFILE_KEY);
        } catch (error) {
            // datos legados corruptos: se ignoran, no se migran
        }
    }
    migrateLegacyProfile();

    function getPatientProfile() {
        try {
            return JSON.parse(localStorage.getItem(PATIENT_KEY) || 'null') || {};
        } catch (error) {
            return {};
        }
    }

    function getInstitutionProfile() {
        try {
            return JSON.parse(localStorage.getItem(INSTITUTION_KEY) || 'null') || {};
        } catch (error) {
            return {};
        }
    }

    function savePatientProfile(profile) {
        profile.role = 'patient';
        localStorage.setItem(PATIENT_KEY, JSON.stringify(profile));
        saveLegacyLoggedUser(profile);
        sessionStorage.setItem('hospired_active_role', 'patient');
    }

    function saveInstitutionProfile(profile) {
        profile.role = 'institution';
        localStorage.setItem(INSTITUTION_KEY, JSON.stringify(profile));
        saveLegacyLoggedUser(profile);
        sessionStorage.setItem('hospired_active_role', 'institution');
        const affiliation = JSON.parse(localStorage.getItem(INSTITUTION_AFFILIATION_KEY) || '{}');
        affiliation.name = profile.institutionName || profile.fullName;
        affiliation.email = profile.email;
        affiliation.phone = profile.phone;
        affiliation.type = profile.institutionType || affiliation.type || 'Hospital';
        localStorage.setItem(INSTITUTION_AFFILIATION_KEY, JSON.stringify(affiliation));
    }

    function saveLegacyLoggedUser(profile) {
        // Snapshot generico sin foto, solo para paginas que aun leen este formato simplificado.
        try {
            const currentUser = {
                nombre: profile.fullName || profile.name || profile.institutionName || 'Usuario',
                email: profile.email || '',
                telefono: profile.phone || '',
                role: profile.role || 'patient',
                edad: profile.age || profile.edad || ''
            };
            localStorage.setItem('hospired_logged_user', JSON.stringify(currentUser));
        } catch (error) {
            console.warn('Could not save logged user snapshot.', error);
        }
    }

    // getProfile()/saveProfile() resuelven segun el contexto de la pagina (paciente vs
    // institucion) en vez de compartir una sola clave; asi nunca se pisan entre roles.
    function getProfile() {
        return isInstitutionContext() ? getInstitutionProfile() : getPatientProfile();
    }

    function saveProfile(profile) {
        if (isInstitutionContext()) {
            saveInstitutionProfile(profile);
        } else {
            savePatientProfile(profile);
        }
    }

    window.HospiredStore = { getPatientProfile, getInstitutionProfile, savePatientProfile, saveInstitutionProfile };


    function getProfileName(profile) {
        return profile.fullName || profile.name || profile.nombre || profile.institutionName || 'Usuario';
    }

    function ensureAvatarUploadStyles() {
        if (document.getElementById('sharedProfileAvatarStyles')) return;
        const style = document.createElement('style');
        style.id = 'sharedProfileAvatarStyles';
        style.textContent = `
            .profile-avatar-wrap { position: relative; display: inline-block; flex-shrink: 0; }
            .profile-avatar-upload-btn { position: absolute; right: -4px; bottom: -4px; width: 26px; height: 26px; border-radius: 50%; background: #00A79D; color: #fff; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; line-height: 1; padding: 0; }
            #profileModal .profile-modal-avatar { background-size: cover; background-position: center; }
            html.global-dark-mode .profile-avatar-upload-btn { background: #0b1220; border-color: #00E5FF; box-shadow: 0 0 8px rgba(0, 229, 255, 0.6); }
            html.global-dark-mode #profileModal .profile-modal-close:focus-visible,
            html.global-dark-mode #profileModal .profile-action:focus-visible,
            html.global-dark-mode .profile-avatar-upload-btn:focus-visible {
                outline: 2px solid #00E5FF; outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    function ensureFontAwesome() {
        if (document.querySelector('link[data-shared-fa]') || document.querySelector('link[href*="font-awesome"]')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
        link.setAttribute('data-shared-fa', 'true');
        document.head.appendChild(link);
    }

    function ensurePhotoModalStyles() {
        if (document.getElementById('sharedPhotoModalStyles')) return;
        const style = document.createElement('style');
        style.id = 'sharedPhotoModalStyles';
        style.textContent = `
            .profile-photo-modal { position: fixed; inset: 0; z-index: 4000; display: flex; align-items: center; justify-content: center; }
            .profile-photo-modal-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.55); }
            .profile-photo-modal-panel { position: relative; z-index: 1; width: min(92vw, 380px); background: #fff; border-radius: 18px; padding: 24px; text-align: center; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3); }
            .profile-photo-preview { width: 180px; height: 180px; margin: 8px auto 20px; border-radius: 50%; background: linear-gradient(135deg, #00A79D, #007F78); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 3rem; font-weight: 800; }
            .profile-photo-modal-actions { display: flex; flex-direction: column; gap: 10px; }
            .profile-photo-modal-actions button { display: flex; align-items: center; justify-content: center; gap: 8px; }
            .profile-photo-modal-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
            html.global-dark-mode .profile-photo-modal-panel { background: #111827; color: #edf6ff; border: 1px solid #334155; }
            html.global-dark-mode .profile-photo-preview { background: linear-gradient(135deg, #0b1220, #00E5FF); box-shadow: 0 0 16px rgba(0, 229, 255, 0.4); }
            html.global-dark-mode .profile-photo-modal-actions .primary { background: linear-gradient(135deg, #39FF14, #0b1220) !important; color: #06131a !important; border: 1px solid #39FF14; }
            html.global-dark-mode .profile-photo-modal-actions .secondary { background: #1e293b !important; color: #edf6ff !important; border: 1px solid #334155; }
            html.global-dark-mode .profile-photo-modal .profile-modal-close { background: #1e293b; color: #edf6ff; }
            .profile-photo-modal button:focus-visible,
            .profile-photo-modal [data-close-photo]:focus-visible {
                outline: 2px solid #00E5FF; outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    function trapFocus(modal, triggerEl) {
        const focusable = () => Array.from(modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled);
        const items = focusable();
        (items[0] || modal).focus();

        function onKeydown(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                modal.dispatchEvent(new CustomEvent('a11y-close'));
                return;
            }
            if (event.key !== 'Tab') return;
            const list = focusable();
            if (!list.length) return;
            const first = list[0];
            const last = list[list.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        modal.addEventListener('keydown', onKeydown);
        // detach() solo quita el listener (usar en re-renders internos);
        // release() ademas devuelve el foco al elemento que abrio el modal (cierre final).
        const detach = () => modal.removeEventListener('keydown', onKeydown);
        const release = () => { detach(); triggerEl?.focus?.(); };
        return { detach, release };
    }

    window.openProfilePhotoModal = function (options) {
        const onClose = options && typeof options.onClose === 'function' ? options.onClose : null;
        const triggerEl = document.activeElement;
        ensureFontAwesome();
        ensurePhotoModalStyles();
        document.getElementById('profilePhotoModal')?.remove();

        const profile = getProfile();
        const name = getProfileName(profile);
        const initials = name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2).toUpperCase() || 'U';

        const modal = document.createElement('div');
        modal.id = 'profilePhotoModal';
        modal.className = 'profile-photo-modal';
        modal.setAttribute('aria-hidden', 'false');
        modal.innerHTML = `
            <div class="profile-photo-modal-backdrop" data-close-photo></div>
            <div class="profile-photo-modal-panel" role="dialog" aria-modal="true" aria-label="Foto de perfil">
                <button type="button" class="profile-modal-close" data-close-photo aria-label="Cerrar modal de foto de perfil" style="position:absolute; top:10px; right:10px;">&times;</button>
                <div class="profile-photo-preview" id="profilePhotoPreview" style="${profile.photo ? `background-image:url('${profile.photo}')` : ''}">${profile.photo ? '' : initials}</div>
                <div class="profile-photo-modal-actions">
                    <button type="button" class="profile-action secondary" id="deleteProfilePhotoBtn" aria-label="Eliminar foto de perfil" ${profile.photo ? '' : 'disabled'}><i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar foto</button>
                    <button type="button" class="profile-action primary" id="addProfilePhotoBtn" aria-label="Agregar nueva foto de perfil"><i class="fa-solid fa-camera" aria-hidden="true"></i> Agregar nueva foto de perfil</button>
                </div>
                <input type="file" id="profilePhotoModalInput" accept="image/*" hidden>
            </div>
        `;
        document.body.appendChild(modal);

        const focusTrap = trapFocus(modal, triggerEl);
        const close = () => {
            focusTrap.release();
            modal.remove();
            if (onClose) onClose();
        };
        modal.addEventListener('a11y-close', close);
        modal.querySelectorAll('[data-close-photo]').forEach(el => el.addEventListener('click', close));

        modal.querySelector('#addProfilePhotoBtn').addEventListener('click', () => {
            modal.querySelector('#profilePhotoModalInput')?.click();
        });

        modal.querySelector('#profilePhotoModalInput').addEventListener('change', (event) => {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const currentProf = getProfile();
                currentProf.photo = reader.result;
                saveProfile(currentProf);
                syncTopNavbarWidgets(currentProf);
                close();
            };
            reader.readAsDataURL(file);
        });

        modal.querySelector('#deleteProfilePhotoBtn').addEventListener('click', () => {
            const currentProf = getProfile();
            delete currentProf.photo;
            saveProfile(currentProf);
            syncTopNavbarWidgets(currentProf);
            close();
        });
    };

    document.addEventListener('click', (event) => {
        const avatarTrigger = event.target.closest('#profileAvatar, #sharedProfileAvatar, #userAvatar, .avatar');
        if (!avatarTrigger || avatarTrigger.closest('#profileModal, #profilePhotoModal')) return;
        event.stopPropagation();
        event.preventDefault();
        window.openProfilePhotoModal();
    }, true);

    function syncTopNavbarWidgets(profile) {
        const name = getProfileName(profile);
        const initials = name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2).toUpperCase() || 'U';

        ['sharedProfileAvatar', 'userAvatar', 'profileAvatar'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (profile.photo) {
                el.style.backgroundImage = `url('${profile.photo}')`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.textContent = '';
            } else {
                el.style.backgroundImage = '';
                el.textContent = initials;
            }
        });

        document.querySelectorAll('.avatar').forEach(el => {
            if (profile.photo) {
                el.style.backgroundImage = `url('${profile.photo}')`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.textContent = '';
            } else {
                el.style.backgroundImage = '';
                el.textContent = initials;
            }
        });

        ['sharedProfileName', 'userNameLabel', 'profileNameLabel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = name;
        });

        ['sharedProfileHint', 'userProfileHint', 'profileHintLabel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = 'Perfil';
        });
    }

    window.openSharedProfileModal = function () {
        const path = window.location.pathname;
        const isLoginFolder = path.includes('/login/');
        const isInstFolder = path.includes('/Panel.De.Instituciones/');

        const loginPath = isLoginFolder ? 'login (1).html' : (isInstFolder ? '../login/login (1).html' : 'login/login (1).html');
        const triggerEl = document.activeElement;

        document.getElementById('profileModal')?.remove();
        ensureFontAwesome();
        ensureAvatarUploadStyles();

        const modal = document.createElement('div');
        modal.id = 'profileModal';
        modal.className = 'profile-modal active';
        modal.setAttribute('aria-hidden', 'false');

        let isEditing = false;

        function renderModalContent() {
            const currentProf = getProfile();
            const isInstitution = currentProf.role === 'institution' || Boolean(currentProf.institutionName);
            const name = getProfileName(currentProf);
            const initials = name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2).toUpperCase() || 'U';
            const titleText = isInstitution ? 'Perfil de Institución Médica' : 'Perfil del Paciente';
            const kickerText = isInstitution ? 'Cuenta Institucional' : 'Mi cuenta';

            let fieldsHTML = '';
            if (isEditing) {
                if (isInstitution) {
                    fieldsHTML = `
                        <div class="profile-field">
                            <span>Nombre Institución</span>
                            <input type="text" id="editInstName" value="${currentProf.institutionName || currentProf.fullName || ''}">
                        </div>
                        <div class="profile-field">
                            <span>Email Institucional</span>
                            <input type="email" id="editInstEmail" value="${currentProf.email || currentProf.correo || ''}">
                        </div>
                        <div class="profile-field">
                            <span>Código Registro</span>
                            <input type="text" id="editInstCode" value="${currentProf.institutionCode || 'INST-101'}">
                        </div>
                        <div class="profile-field">
                            <span>Tipo de Centro</span>
                            <input type="text" id="editInstType" value="${currentProf.institutionType || 'Hospital / Clínica'}">
                        </div>
                        <div class="profile-field">
                            <span>Teléfono</span>
                            <input type="tel" id="editInstPhone" value="${currentProf.phone || currentProf.telefono || ''}">
                        </div>
                    `;
                } else {
                    fieldsHTML = `
                        <div class="profile-field">
                            <span>Nombre completo</span>
                            <input type="text" id="editPatientName" value="${currentProf.fullName || currentProf.name || ''}">
                        </div>
                        <div class="profile-field">
                            <span>Email</span>
                            <input type="email" id="editPatientEmail" value="${currentProf.email || currentProf.correo || ''}">
                        </div>
                        <div class="profile-field">
                            <span>Teléfono</span>
                            <input type="tel" id="editPatientPhone" value="${currentProf.phone || currentProf.telefono || ''}">
                        </div>
                        <div class="profile-field">
                            <span>Edad</span>
                            <input type="number" id="editPatientAge" value="${currentProf.age || currentProf.edad || ''}" placeholder="Ej. 28">
                        </div>
                        <div class="profile-field">
                            <span>Hospital anterior</span>
                            <input type="text" id="editPatientHospital" value="${currentProf.previousHospital || ''}">
                        </div>
                    `;
                }
            } else {
                if (isInstitution) {
                    fieldsHTML = `
                        <div class="profile-field">
                            <span>Nombre Institución</span>
                            <strong>${name}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Email Institucional</span>
                            <strong>${currentProf.email || currentProf.correo || 'No disponible'}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Código Registro</span>
                            <strong>${currentProf.institutionCode || 'INST-101'}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Tipo de Centro</span>
                            <strong>${currentProf.institutionType || 'Hospital / Clínica'}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Teléfono</span>
                            <strong>${currentProf.phone || currentProf.telefono || 'No disponible'}</strong>
                        </div>
                    `;
                } else {
                    const ageVal = currentProf.age || currentProf.edad;
                    fieldsHTML = `
                        <div class="profile-field">
                            <span>Nombre completo</span>
                            <strong>${name}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Email</span>
                            <strong>${currentProf.email || currentProf.correo || 'No disponible'}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Teléfono</span>
                            <strong>${currentProf.phone || currentProf.telefono || 'No disponible'}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Edad</span>
                            <strong>${ageVal ? ageVal + ' años' : 'No especificada'}</strong>
                        </div>
                        <div class="profile-field">
                            <span>Hospital anterior</span>
                            <strong>${currentProf.previousHospital || 'No disponible'}</strong>
                        </div>
                    `;
                }
            }

            let actionButtons = '';
            if (isEditing) {
                actionButtons = `
                    <button type="button" class="profile-action secondary" id="cancelEditProfileBtn">Cancelar</button>
                    <button type="button" class="profile-action primary" id="saveProfileBtn">Guardar cambios</button>
                `;
            } else {
                if (isInstitution) {
                    actionButtons = `
                        <button type="button" class="profile-action secondary" id="editSharedProfileBtn">Editar información</button>
                        <button type="button" class="profile-action secondary" id="logoutSharedProfileBtn">Cerrar sesión</button>
                    `;
                } else {
                    actionButtons = `
                        <button type="button" class="profile-action secondary" id="editSharedProfileBtn">Editar información</button>
                        <button type="button" class="profile-action secondary" id="logoutSharedProfileBtn">Cerrar sesión</button>
                        <button type="button" class="profile-action primary" id="continueSharedProfileBtn">Continuar</button>
                    `;
                }
            }

            modal.innerHTML = `
                <div class="profile-modal-backdrop" data-close="profile"></div>
                <div class="profile-modal-panel" role="dialog" aria-modal="true" aria-labelledby="profileModalTitle">
                    <button type="button" class="profile-modal-close" aria-label="Cerrar perfil">&times;</button>
                    <div class="profile-modal-header">
                        <div class="profile-avatar-wrap">
                            <div class="profile-modal-avatar" id="sharedProfileModalAvatar" style="${currentProf.photo ? `background-image:url('${currentProf.photo}')` : ''}">${currentProf.photo ? '' : initials}</div>
                            <button type="button" class="profile-avatar-upload-btn" id="sharedProfileAvatarUploadBtn" aria-label="Cambiar foto de perfil" title="Cambiar foto de perfil"><i class="fa-solid fa-camera" aria-hidden="true"></i></button>
                            <input type="file" id="sharedProfileAvatarInput" accept="image/*" hidden>
                        </div>
                        <div>
                            <p class="profile-modal-kicker">${kickerText}</p>
                            <h3 id="profileModalTitle">${titleText}</h3>
                        </div>
                    </div>
                    <div class="profile-card-body">
                        ${fieldsHTML}
                    </div>
                    <div class="profile-modal-footer" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; margin-top:20px;">
                        ${actionButtons}
                    </div>
                </div>
            `;

            bindModalEvents(isInstitution);
        }

        let focusTrap = null;

        function bindModalEvents(isInstitution) {
            focusTrap?.detach();
            const closeModal = () => {
                focusTrap?.release();
                modal.remove();
            };
            modal.addEventListener('a11y-close', closeModal);
            modal.querySelector('.profile-modal-close')?.addEventListener('click', closeModal);
            modal.querySelector('[data-close="profile"]')?.addEventListener('click', closeModal);
            focusTrap = trapFocus(modal, triggerEl);

            modal.querySelector('#continueSharedProfileBtn')?.addEventListener('click', closeModal);

            modal.querySelector('#sharedProfileAvatarUploadBtn')?.addEventListener('click', () => {
                modal.querySelector('#sharedProfileAvatarInput')?.click();
            });

            modal.querySelector('#sharedProfileAvatarInput')?.addEventListener('change', (event) => {
                const file = event.target.files && event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    const currentProf = getProfile();
                    currentProf.photo = reader.result;
                    saveProfile(currentProf);
                    syncTopNavbarWidgets(currentProf);
                    renderModalContent();
                };
                reader.readAsDataURL(file);
            });

            modal.querySelector('#editSharedProfileBtn')?.addEventListener('click', () => {
                isEditing = true;
                renderModalContent();
            });

            modal.querySelector('#cancelEditProfileBtn')?.addEventListener('click', () => {
                isEditing = false;
                renderModalContent();
            });

            modal.querySelector('#saveProfileBtn')?.addEventListener('click', () => {
                const currentProf = getProfile();
                if (isInstitution) {
                    const instName = document.getElementById('editInstName')?.value.trim() || currentProf.institutionName || currentProf.fullName;
                    const instEmail = document.getElementById('editInstEmail')?.value.trim() || currentProf.email;
                    const instCode = document.getElementById('editInstCode')?.value.trim() || currentProf.institutionCode;
                    const instType = document.getElementById('editInstType')?.value.trim() || currentProf.institutionType;
                    const instPhone = document.getElementById('editInstPhone')?.value.trim() || currentProf.phone;

                    currentProf.institutionName = instName;
                    currentProf.fullName = instName;
                    currentProf.name = instName;
                    currentProf.email = instEmail;
                    currentProf.institutionCode = instCode;
                    currentProf.institutionType = instType;
                    currentProf.phone = instPhone;
                } else {
                    const name = document.getElementById('editPatientName')?.value.trim() || currentProf.fullName;
                    const email = document.getElementById('editPatientEmail')?.value.trim() || currentProf.email;
                    const phone = document.getElementById('editPatientPhone')?.value.trim() || currentProf.phone;
                    const age = document.getElementById('editPatientAge')?.value.trim();
                    const hospital = document.getElementById('editPatientHospital')?.value.trim() || currentProf.previousHospital;

                    currentProf.fullName = name;
                    currentProf.name = name;
                    currentProf.email = email;
                    currentProf.phone = phone;
                    currentProf.age = age;
                    currentProf.edad = age;
                    currentProf.previousHospital = hospital;
                }

                saveProfile(currentProf);
                syncTopNavbarWidgets(currentProf);
                isEditing = false;
                renderModalContent();
            });

            modal.querySelector('#logoutSharedProfileBtn')?.addEventListener('click', () => {
                // Solo borra la clave del rol activo; la sesion del otro rol (si existe en el mismo navegador) no se toca.
                localStorage.removeItem(isInstitution ? INSTITUTION_KEY : PATIENT_KEY);
                localStorage.removeItem('hospired_logged_user');
                if (isInstitution) localStorage.removeItem(INSTITUTION_AFFILIATION_KEY);
                sessionStorage.removeItem('hospired_active_role');
                closeModal();
                window.location.href = loginPath;
            });
        }

        renderModalContent();
        document.body.appendChild(modal);
    };

    // Sincroniza el avatar/nombre del header apenas carga la pagina (antes solo se
    // actualizaba de forma reactiva tras abrir el modal o subir una foto).
    function initHeaderSync() {
        syncTopNavbarWidgets(getProfile());
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderSync);
    } else {
        initHeaderSync();
    }
})();
