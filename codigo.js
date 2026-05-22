// codigo.js - aca puse toda la logica interactiva del sitio
// use funciones separadas para cada herramienta asi queda mas ordenado


// ─── TABS DEL EXPLORADOR ───
// esta funcion la hice para poder cambiar entre las tres pestañas
// sin tener que recargar la pagina, me parecio mas comodo que hacer tres paginas separadas
function cambiarTab(nombre, boton) {

    // primero oculto todos los paneles que esten visibles
    var paneles = document.querySelectorAll('.panel');
    for (var i = 0; i < paneles.length; i++) {
        paneles[i].classList.remove('activo');
    }

    // despues saco el marcado de todos los botones de pestaña
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('activo');
    }

    // y por ultimo muestro solo el panel que corresponde al boton que apreto
    document.getElementById('panel-' + nombre).classList.add('activo');
    boton.classList.add('activo');
}


// ─── HERRAMIENTA 1: TIPO DE SANGRE ───
// aca calculo que tipos de sangre puede tener un hijo segun los padres
// busque en internet las combinaciones posibles y las puse en una tabla

function calcularSangre() {

    // leo lo que eligio el usuario en los dos selects
    var padre = document.getElementById('sangre-padre').value;
    var madre = document.getElementById('sangre-madre').value;
    var rhPadre = document.getElementById('rh-padre').value;
    var rhMadre = document.getElementById('rh-madre').value;

    // si no eligio alguno de los dos le aviso con un alert
    if (padre == '' || madre == '') {
        alert('Seleccioná el tipo de sangre de ambos progenitores.');
        return; // con return corto la funcion para que no siga
    }

    // puse todas las combinaciones posibles en un objeto
    // la clave es padre_madre y el valor es el resultado
    var resultados = {
        'A_A':   'A (75%) · O (25%)',
        'A_B':   'A (25%) · B (25%) · AB (25%) · O (25%)',
        'A_AB':  'A (50%) · B (25%) · AB (25%)',
        'A_O':   'A (50%) · O (50%)',
        'B_B':   'B (75%) · O (25%)',
        'B_AB':  'A (25%) · B (50%) · AB (25%)',
        'B_O':   'B (50%) · O (50%)',
        'AB_AB': 'A (25%) · B (25%) · AB (50%)',
        'AB_O':  'A (50%) · B (50%)',
        'O_O':   'O (100%)'
    };

    // armo la clave con los dos valores y busco en la tabla
    // pruebo los dos ordenes porque A_B y B_A dan lo mismo
    var clave1 = padre + '_' + madre;
    var clave2 = madre + '_' + padre;
    var resultado = resultados[clave1] || resultados[clave2] || 'Combinación no encontrada';

    // para el factor rh use un if simple segun las dos opciones
    var rh = '';
    if (rhPadre == '+' && rhMadre == '+') {
        rh = 'El hijo puede ser Rh+ (muy probable) o Rh− (poco probable).';
    } else if (rhPadre == '-' && rhMadre == '-') {
        rh = 'El hijo será Rh− con total seguridad.';
    } else {
        rh = 'El hijo puede ser Rh+ o Rh−, depende del genotipo exacto.';
    }

    // muestro el resultado en los elementos del html
    document.getElementById('val-sangre').textContent = resultado;
    document.getElementById('desc-sangre').textContent = 'Factor Rh: ' + rh;

    // le agrego la clase visible para que aparezca el div de resultado
    document.getElementById('resultado-sangre').classList.add('visible');
}

// esta funcion limpia todo y vuelve al estado inicial
function limpiarSangre() {
    document.getElementById('sangre-padre').value = '';
    document.getElementById('sangre-madre').value = '';
    document.getElementById('rh-padre').value = '+';
    document.getElementById('rh-madre').value = '+';
    document.getElementById('resultado-sangre').classList.remove('visible');
}


// ─── HERRAMIENTA 2: RASGOS HEREDITARIOS ───
// aca use el cuadro de punnett para calcular como se hereda un rasgo
// aprendimos esto en genetica, cada padre aporta un alelo al hijo

// puse la info de cada rasgo en un objeto para no repetir codigo
var rasgos = {
    ojos:    { dominante: 'Ojos Marrón',    recesivo: 'Ojos Azules',  emoji: '👁️' },
    cabello: { dominante: 'Cabello Rizado',  recesivo: 'Cabello Liso', emoji: '💇' },
    lobulo:  { dominante: 'Lóbulo Libre',    recesivo: 'Lóbulo Unido', emoji: '👂' },
    pulgar:  { dominante: 'Pulgar Arqueado', recesivo: 'Pulgar Recto', emoji: '👍' }
};

// esta funcion actualiza los labels cuando cambia el rasgo seleccionado
function actualizarRasgo() {
    var tipo = document.getElementById('rasgo-tipo').value;
    var info = rasgos[tipo];
    // cambio el texto de los labels para que diga que significa D en ese rasgo
    document.getElementById('label-padre').textContent = 'Genotipo del Padre (D = ' + info.dominante + ')';
    document.getElementById('label-madre').textContent = 'Genotipo de la Madre (D = ' + info.dominante + ')';
}

function calcularRasgo() {
    var tipo = document.getElementById('rasgo-tipo').value;
    var genP = document.getElementById('gen-padre').value;
    var genM = document.getElementById('gen-madre').value;
    var info = rasgos[tipo];

    // separo cada genotipo en sus dos alelos individuales
    // por ejemplo DD -> p1=D y p2=D, Dd -> p1=D y p2=d
    var p1 = genP[0];
    var p2 = genP[1];
    var m1 = genM[0];
    var m2 = genM[1];

    // genero las 4 combinaciones posibles del cuadro de punnett
    // es como hacer una tabla de 2x2 con los alelos de cada padre
    var combinaciones = [
        ordenarGenotipo(p1 + m1),
        ordenarGenotipo(p1 + m2),
        ordenarGenotipo(p2 + m1),
        ordenarGenotipo(p2 + m2)
    ];

    // cuento cuantos tienen al menos una D (dominante) y cuantos son dd (recesivo)
    var dominantes = 0;
    var recesivos = 0;
    for (var i = 0; i < combinaciones.length; i++) {
        if (combinaciones[i].indexOf('D') !== -1) {
            dominantes++;
        } else {
            recesivos++;
        }
    }

    // armo el html de las 4 celdas del cuadro de punnett dinamicamente
    // uso verde para dominante y azul para recesivo para que se vea diferente
    var html = '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px;">';
    for (var i = 0; i < combinaciones.length; i++) {
        var esDom = combinaciones[i].indexOf('D') !== -1;
        var color = esDom ? '#1a6b2f' : '#1565c0';
        var fenotipo = esDom ? info.dominante : info.recesivo;
        html += '<div style="border:1px solid ' + color + '; border-radius:6px; padding:12px; text-align:center;">';
        html += '<div style="font-size:1.1rem; font-weight:700; color:' + color + ';">' + combinaciones[i] + '</div>';
        html += '<div style="font-size:0.8rem; color:#666; margin-top:4px;">' + fenotipo + '</div>';
        html += '</div>';
    }
    html += '</div>';

    // abajo del cuadro muestro el resumen con los porcentajes
    html += '<p style="font-size:0.88rem; color:#444;">';
    html += info.emoji + ' <strong style="color:#1a6b2f">' + info.dominante + ':</strong> ' + dominantes + ' de 4 (' + (dominantes * 25) + '%)<br>';
    html += info.emoji + ' <strong style="color:#1565c0">' + info.recesivo + ':</strong> ' + recesivos + ' de 4 (' + (recesivos * 25) + '%)';
    html += '</p>';

    document.getElementById('contenido-rasgo').innerHTML = html;
    document.getElementById('resultado-rasgo').classList.add('visible');
}

// esta funcion la hice porque si el resultado es dD queda mal escrito
// lo correcto es Dd, la mayuscula siempre va primero
function ordenarGenotipo(g) {
    if (g === 'dD') return 'Dd';
    return g;
}

function limpiarRasgo() {
    document.getElementById('gen-padre').value = 'DD';
    document.getElementById('gen-madre').value = 'DD';
    document.getElementById('resultado-rasgo').classList.remove('visible');
}


// ─── HERRAMIENTA 3: COMPLEMENTO DE ADN ───
// aca genero la cadena complementaria de una secuencia de ADN
// cada base tiene su par: A va con T, y G va con C
// en el ARNm es casi igual pero la T se reemplaza por U (Uracilo)

function calcularADN() {
    var cadena = document.getElementById('cadena-adn').value.trim();

    // minimo 3 letras para que tenga sentido
    if (cadena.length < 3) {
        alert('Ingresá al menos 3 bases de ADN.');
        return;
    }

    var complemento = '';
    var arnm = '';

    // recorro letra por letra y busco el par de cada base
    for (var i = 0; i < cadena.length; i++) {
        var base = cadena[i];

        if (base === 'A') { complemento += 'T'; arnm += 'U'; }
        else if (base === 'T') { complemento += 'A'; arnm += 'A'; }
        else if (base === 'G') { complemento += 'C'; arnm += 'C'; }
        else if (base === 'C') { complemento += 'G'; arnm += 'G'; }
    }

    // cuento cuantas veces aparece cada base para el resumen de abajo
    var contA = 0, contT = 0, contG = 0, contC = 0;
    for (var i = 0; i < cadena.length; i++) {
        if (cadena[i] === 'A') contA++;
        else if (cadena[i] === 'T') contT++;
        else if (cadena[i] === 'G') contG++;
        else if (cadena[i] === 'C') contC++;
    }

    // uso split('').join(' ') para separar cada letra con un espacio y que se lea mejor
    document.getElementById('res-original').textContent    = cadena.split('').join(' ');
    document.getElementById('res-complemento').textContent = complemento.split('').join(' ');
    document.getElementById('res-arnm').textContent        = arnm.split('').join(' ');

    document.getElementById('res-adn-info').innerHTML =
        'Composición: A=' + contA + ' · T=' + contT + ' · G=' + contG + ' · C=' + contC +
        '<br><em style="color:#888;">En el ARNm la Timina (T) se reemplaza por Uracilo (U).</em>';

    document.getElementById('resultado-adn').classList.add('visible');
}

function limpiarADN() {
    document.getElementById('cadena-adn').value = '';
    document.getElementById('resultado-adn').classList.remove('visible');
}


// ─── LABORATORIO: REGISTRO DE PERFILES ───
// aca guardo los perfiles que van cargando los usuarios
// use un array porque me parecio la forma mas simple de guardar varios objetos

var registros = []; // array vacio que se va llenando con cada registro

function registrar() {

    // leo el valor de cada campo del formulario
    var nombre = document.getElementById('reg-nombre').value.trim();
    var edad   = document.getElementById('reg-edad').value;
    var sexo   = document.getElementById('reg-sexo').value;
    var email  = document.getElementById('reg-email').value.trim();
    var sangre = document.getElementById('reg-sangre').value;
    var ojos   = document.getElementById('reg-ojos').value;
    var cabRad = document.querySelector('input[name="cabello"]:checked'); // busco el radio seleccionado

    // si falta algun campo muestro el mensaje de error y no sigo
    if (!nombre || !edad || !sexo || !email || !sangre || !ojos || !cabRad) {
        document.getElementById('msg-ok').classList.remove('visible');
        document.getElementById('msg-error').classList.add('visible');
        // con setTimeout hago que el mensaje desaparezca solo despues de 3 segundos
        setTimeout(function() {
            document.getElementById('msg-error').classList.remove('visible');
        }, 3000);
        return;
    }

    // creo un objeto con todos los datos del perfil
    var perfil = {
        nombre:  nombre,
        edad:    edad,
        sexo:    sexo,
        email:   email,
        sangre:  sangre,
        ojos:    ojos,
        cabello: cabRad.value
    };

    // lo agrego al array con push
    registros.push(perfil);

    // limpio todos los campos para que el usuario pueda cargar otro
    document.getElementById('reg-nombre').value = '';
    document.getElementById('reg-edad').value   = '';
    document.getElementById('reg-sexo').value   = '';
    document.getElementById('reg-email').value  = '';
    document.getElementById('reg-sangre').value = '';
    document.getElementById('reg-ojos').value   = '';
    document.querySelectorAll('input[name="cabello"]').forEach(function(r) {
        r.checked = false;
    });

    // muestro el mensaje de exito y lo oculto despues de 3 segundos
    document.getElementById('msg-error').classList.remove('visible');
    document.getElementById('msg-ok').classList.add('visible');
    setTimeout(function() {
        document.getElementById('msg-ok').classList.remove('visible');
    }, 3000);

    // actualizo la lista de perfiles y las estadisticas
    mostrarRegistros();
    actualizarEstadisticas();
}

// esta funcion recorre el array y genera el html de cada tarjeta de perfil
function mostrarRegistros() {
    var lista = document.getElementById('lista-registros');

    if (registros.length === 0) {
        lista.innerHTML = '<p style="color:#aaa; font-style:italic; font-size:0.9rem;">Todavía no hay perfiles registrados.</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < registros.length; i++) {
        var r = registros[i];
        html += '<div class="registro-item">';
        html += '<div>';
        html += '<div class="reg-nombre">' + r.nombre + '</div>';
        html += '<div class="reg-info">' + r.sexo + ' · ' + r.edad + ' años · Sangre: ' + r.sangre + ' · Ojos: ' + r.ojos + ' · Cabello: ' + r.cabello + '</div>';
        html += '</div>';
        html += '<span class="reg-badge">✓ Registrado</span>';
        html += '</div>';
    }

    lista.innerHTML = html;
}

// aca actualizo los numeritos de las tarjetas de estadisticas
function actualizarEstadisticas() {

    // primero actualizo el contador de perfiles
    document.getElementById('contador').textContent = registros.length;

    // si no hay registros no tiene sentido calcular el resto
    if (registros.length === 0) return;

    // para cada estadistica uso un objeto para contar las repeticiones
    // despues llamo a masComun() para saber cual fue el mas repetido

    var sangreCount = {};
    for (var i = 0; i < registros.length; i++) {
        var s = registros[i].sangre;
        sangreCount[s] = (sangreCount[s] || 0) + 1; // si no existe arranca en 0
    }
    document.getElementById('sangre-comun').textContent = masComun(sangreCount);

    var ojosCount = {};
    for (var i = 0; i < registros.length; i++) {
        var o = registros[i].ojos;
        ojosCount[o] = (ojosCount[o] || 0) + 1;
    }
    document.getElementById('ojos-comun').textContent = masComun(ojosCount);

    var cabelloCount = {};
    for (var i = 0; i < registros.length; i++) {
        var c = registros[i].cabello;
        cabelloCount[c] = (cabelloCount[c] || 0) + 1;
    }
    document.getElementById('cabello-comun').textContent = masComun(cabelloCount);
}

// funcion auxiliar que recorre un objeto y devuelve la clave con el valor mas alto
// la uso para saber cual tipo de sangre, ojos o cabello se repite mas
function masComun(obj) {
    var max = 0;
    var resultado = '—';
    for (var clave in obj) {
        if (obj[clave] > max) {
            max = obj[clave];
            resultado = clave;
        }
    }
    return resultado;
}
