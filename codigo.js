// codigo.js - funciones del sitio de genetica

function calcularSangre() {
    var padre = document.getElementById('sangre-padre').value;
    var madre = document.getElementById('sangre-madre').value;

    if (padre == '' || madre == '') {
        alert('Por favor selecciona el tipo de sangre de los dos.');
        return;
    }

    var resultado = '';

    if (padre == 'O' && madre == 'O') {
        resultado = 'El hijo solo puede ser: O';
    } else if ((padre == 'A' && madre == 'O') || (padre == 'O' && madre == 'A')) {
        resultado = 'El hijo puede ser: A u O';
    } else if ((padre == 'B' && madre == 'O') || (padre == 'O' && madre == 'B')) {
        resultado = 'El hijo puede ser: B u O';
    } else if (padre == 'A' && madre == 'A') {
        resultado = 'El hijo puede ser: A u O';
    } else if (padre == 'B' && madre == 'B') {
        resultado = 'El hijo puede ser: B u O';
    } else if ((padre == 'A' && madre == 'B') || (padre == 'B' && madre == 'A')) {
        resultado = 'El hijo puede ser: A, B, AB u O';
    } else if ((padre == 'AB' && madre == 'O') || (padre == 'O' && madre == 'AB')) {
        resultado = 'El hijo puede ser: A o B';
    } else if ((padre == 'AB' && madre == 'A') || (padre == 'A' && madre == 'AB')) {
        resultado = 'El hijo puede ser: A, B o AB';
    } else if ((padre == 'AB' && madre == 'B') || (padre == 'B' && madre == 'AB')) {
        resultado = 'El hijo puede ser: A, B o AB';
    } else if (padre == 'AB' && madre == 'AB') {
        resultado = 'El hijo puede ser: A, B o AB';
    }

    document.getElementById('resultado').innerHTML = 'Resultado: ' + resultado;
}

function limpiarSangre() {
    document.getElementById('sangre-padre').value = '';
    document.getElementById('sangre-madre').value = '';
    document.getElementById('resultado').innerHTML = '';
}

function calcularADN() {
    var cadena = document.getElementById('cadena-adn').value;

    if (cadena == '') {
        alert('Por favor ingresa una cadena de ADN.');
        return;
    }

    var complemento = '';

    for (var i = 0; i < cadena.length; i++) {
        if (cadena[i] == 'A') complemento += 'T';
        else if (cadena[i] == 'T') complemento += 'A';
        else if (cadena[i] == 'G') complemento += 'C';
        else if (cadena[i] == 'C') complemento += 'G';
    }

    document.getElementById('resultado-adn').innerHTML =
        'Cadena original: ' + cadena + '<br>' +
        'Cadena complementaria: ' + complemento;
}

function limpiarADN() {
    document.getElementById('cadena-adn').value = '';
    document.getElementById('resultado-adn').innerHTML = '';
}

var registros = [];

function registrar() {
    var nombre  = document.getElementById('reg-nombre').value;
    var edad    = document.getElementById('reg-edad').value;
    var email   = document.getElementById('reg-email').value;
    var sangre  = document.getElementById('reg-sangre').value;
    var ojos    = document.getElementById('reg-ojos').value;
    var cabello = document.getElementById('reg-cabello').value;

    if (nombre == '' || edad == '' || email == '' || sangre == '' || ojos == '' || cabello == '') {
        alert('Por favor completa todos los campos.');
        return;
    }

    var perfil = {
        nombre:  nombre,
        edad:    edad,
        email:   email,
        sangre:  sangre,
        ojos:    ojos,
        cabello: cabello
    };

    registros.push(perfil);

    document.getElementById('msg-registro').innerHTML = 'Perfil de ' + nombre + ' registrado correctamente.';

    limpiarFormulario();
    mostrarRegistros();
}

function limpiarFormulario() {
    document.getElementById('reg-nombre').value  = '';
    document.getElementById('reg-edad').value    = '';
    document.getElementById('reg-email').value   = '';
    document.getElementById('reg-sangre').value  = '';
    document.getElementById('reg-ojos').value    = '';
    document.getElementById('reg-cabello').value = '';
}

function mostrarRegistros() {
    document.getElementById('contador').innerHTML = registros.length;

    var lista = '';
    for (var i = 0; i < registros.length; i++) {
        var r = registros[i];
        lista += '<p><strong>' + r.nombre + '</strong> - ' + r.edad + ' años - Sangre: ' + r.sangre + ' - Ojos: ' + r.ojos + ' - Cabello: ' + r.cabello + '</p>';
    }

    document.getElementById('lista-registros').innerHTML = lista;
}
