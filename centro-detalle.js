const HOSPired_CENTERS = [
    {
        name: 'Hospital Internacional San Jude',
        type: 'Hospital General',
        icon: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path><line x1="10" y1="9" x2="14" y2="9"></line><line x1="12" y1="7" x2="12" y2="11"></line></svg>',
        address: 'Final Boulevard de los Héroes, San Salvador',
        phone: '2222-1111',
        hours: '24 horas / Emergencias habilitadas',
        services: 'Medicina General, Pediatría, Cardiología, Cirugía General'
    },
    {
        name: 'Hospital Metropolitano del Norte',
        type: 'Centro Médico Especializado',
        icon: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path><line x1="10" y1="9" x2="14" y2="9"></line><line x1="12" y1="7" x2="12" y2="11"></line></svg>',
        address: 'Carretera Troncal del Norte, Apopa, San Salvador',
        phone: '2233-4455',
        hours: 'Lunes a Domingo: 6:00 AM - 10:00 PM',
        services: 'Ginecología, Traumatología, Medicina Interna, Laboratorio'
    },
    {
        name: 'Laboratorios Clínicos Biolab',
        type: 'Laboratorio Clínico',
        icon: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.75 18.1A2 2 0 0 0 6.47 21h11.06a2 2 0 0 0 1.72-2.9L14 9.31V2"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line></svg>',
        address: 'Alameda Juan Pablo II, San Salvador',
        phone: '2266-7788',
        hours: 'Lunes a Sábado: 6:00 AM - 4:00 PM',
        services: 'Hemograma Completo, Perfil Lipídico, Exámenes de Orina y Glucosa'
    },
    {
        name: 'Laboratorios Diagnóstica Express',
        type: 'Laboratorio Clínico',
        icon: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.75 18.1A2 2 0 0 0 6.47 21h11.06a2 2 0 0 0 1.72-2.9L14 9.31V2"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line></svg>',
        address: 'Colonia Médica, San Salvador',
        phone: '2277-8899',
        hours: 'Lunes a Sábado: 7:00 AM - 5:00 PM',
        services: 'Química Sanguínea, Pruebas PCR, Exámenes Generales'
    }
];

function openSharedCenterModal(center) {
    document.querySelector('.shared-center-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'profile-modal active shared-center-modal';
    modal.setAttribute('aria-hidden', 'false');
    modal.innerHTML = `
        <div class="profile-modal-backdrop" data-close="shared-center"></div>
        <div class="profile-modal-panel" role="dialog" aria-modal="true" aria-labelledby="sharedCenterTitle">
            <button type="button" class="profile-modal-close" aria-label="Cerrar detalles">×</button>
            <div class="profile-modal-header">
                <div class="profile-modal-avatar">${center.icon}</div>
                <div>
                    <p class="profile-modal-kicker">${center.type}</p>
                    <h3 id="sharedCenterTitle">${center.name}</h3>
                </div>
            </div>
            <div class="profile-card-body">
                <div class="catalog-map">
                    <iframe title="Mapa de ubicación de ${center.name}" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(center.address)}&z=15&output=embed" allowfullscreen></iframe>
                </div>
                <button type="button" class="profile-action primary shared-center-reserve">Reservar Cita</button>
                <div class="profile-field"><span>Dirección</span><strong>${center.address}</strong></div>
                <div class="profile-field"><span>Teléfono de Contacto</span><strong>${center.phone}</strong></div>
                <div class="profile-field"><span>Horarios de Atención</span><strong>${center.hours}</strong></div>
                <div class="profile-field"><span>Servicios y Especialidades</span><strong>${center.services}</strong></div>
            </div>
            <div class="profile-modal-footer">
                <button type="button" class="profile-action secondary" data-close="shared-center">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.profile-modal-close').addEventListener('click', close);
    modal.querySelector('[data-close="shared-center"]').addEventListener('click', close);
    modal.addEventListener('click', event => {
        if (event.target === modal) close();
    });
    modal.querySelector('.shared-center-reserve').addEventListener('click', () => {
        reservarCitaCentro(center.name, center.type.toLowerCase().includes('laboratorio') ? 'laboratorio' : 'hospital', center.address);
    });
}

function setupSharedCenterSearch() {
    const searchInput = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchResultsDropdown');
    if (!searchInput || !dropdown) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        dropdown.classList.remove('show');
        if (query.length < 2) return;

        const matches = HOSPired_CENTERS.filter(center => center.name.toLowerCase().includes(query));
        if (!matches.length) {
            const empty = document.createElement('div');
            empty.className = 'search-result-item';
            empty.textContent = 'No se encontraron resultados';
            dropdown.appendChild(empty);
        } else {
            matches.forEach(center => {
                const result = document.createElement('a');
                result.href = '#';
                result.className = 'search-result-item';
                result.innerHTML = `${center.icon}<span>${center.name}</span>`;
                result.addEventListener('click', event => {
                    event.preventDefault();
                    searchInput.value = center.name;
                    dropdown.classList.remove('show');
                    openSharedCenterModal(center);
                });
                dropdown.appendChild(result);
            });
        }
        dropdown.classList.add('show');
    });
}

document.addEventListener('DOMContentLoaded', setupSharedCenterSearch);
