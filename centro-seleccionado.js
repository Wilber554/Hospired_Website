const CENTRO_SELECCIONADO_KEY = 'hospired_centro_seleccionado';

function guardarCentroSeleccionado(nombre, tipo, direccion) {
    const centro = {
        nombre: nombre.trim(),
        tipo: tipo.trim().toLowerCase(),
        direccion: direccion.trim()
    };

    localStorage.setItem(CENTRO_SELECCIONADO_KEY, JSON.stringify(centro));
    return centro;
}

function reservarCitaCentro(nombre, tipo, direccion) {
    guardarCentroSeleccionado(nombre, tipo, direccion);
    window.location.href = 'citas.unificado.html';
}
