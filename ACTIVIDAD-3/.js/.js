// 🎯 SISTEMA DE VALIDACIÓN AVANZADA
const formulario = document.getElementById('formularioAvanzado');
const campos = formulario.querySelectorAll('input, textarea, select');
const btnEnviar = document.getElementById('btnEnviar');

// Estado de validación de cada campo
let estadoValidacion = {};

// Inicializar estado de todos los campos
campos.forEach((campo) => {
    estadoValidacion[campo.name] = false;
});

// 🎯 VALIDACIONES ESPECÍFICAS POR CAMPO

// Validación del nombre
document.getElementById('Nombres').addEventListener('input', function() {
    const valor = this.value.trim();
    const nombres = valor.split(' ').filter((nombre) => nombre.length > 0);
    
    if (valor.length < 3) {
        mostrarError('errorNombre', 'El nombre debe tener al menos 3 caracteres');
        marcarCampo(this, false);
    } else if (nombres.length < 2) {
        mostrarError('errorNombre', 'Ingresa al menos 2 nombres');
        marcarCampo(this, false);
    } else {
        mostrarExito('ExitoNombre', '✓ Nombre válido');
        marcarCampo(this, true);
    }
});

// Validación del apellido
document.getElementById('Apellidos').addEventListener('input', function() {
    const valor = this.value.trim();
    const apellidos = valor.split(' ').filter((apellido) => apellido.length > 0);
    
    if (valor.length < 3) {
        mostrarError('errorApellido', 'El apellido debe tener al menos 3 caracteres');
        marcarCampo(this, false);
    } else if (apellidos.length < 2) {
        mostrarError('errorApellido', 'Ingresa al menos 2 apellidos');
        marcarCampo(this, false);
    } else {
        mostrarExito('ExitoApellido', '✓ Apellido válido');
        marcarCampo(this, true);
    }
});

// Validación del email
document.getElementById('correo').addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
        mostrarError('errorCorreo', 'Formato de email inválido');
        marcarCampo(this, false);
    } else {
        mostrarExito('extitoCorreo', '✓ Email válido');
        marcarCampo(this, true);
    }
});

// Validación de confirmación de email
document.getElementById('confirmacion-correo').addEventListener('input', function() {
    const emailOriginal = document.getElementById('correo').value;
    
    if (this.value !== emailOriginal) {
        mostrarError('errorConfirmacionCorreo', 'Los correos no coinciden');
        marcarCampo(this, false);
    } else if (this.value.length > 0) {
        mostrarExito('exitoConfirmacionCorreo', '✓ Correos coinciden');
        marcarCampo(this, true);
    }
});

// Validación de contraseña con indicador de fortaleza
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const fortaleza = calcularFortalezaPassword(password);
    actualizarBarraFortaleza(fortaleza);
    
    if (password.length < 8) {
        mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
        marcarCampo(this, false);
    } else if (fortaleza.nivel < 2) {
        mostrarError('errorPassword', 'Contraseña muy débil. Añade números y símbolos');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
        marcarCampo(this, true);
    }
    
    // Revalidar confirmación si existe
    const confirmar = document.getElementById('confirmarPassword');
    if (confirmar.value) {
        confirmar.dispatchEvent(new Event('input'));
    }
});

// Validación de confirmación de contraseña
document.getElementById('confirmarPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    
    if (this.value !== password) {
        mostrarError('errorConfirmar', 'Las contraseñas no coinciden');
        marcarCampo(this, false);
    } else if (this.value.length > 0) {
        mostrarExito('exitoConfirmar', '✓ Contraseñas coinciden');
        marcarCampo(this, true);
    }
});

// Validación del teléfono con formato automático
document.getElementById('telefono').addEventListener('input', function() {
    // Aplicar formato automático
    let valor = this.value.replace(/\D/g, '');
    if (valor.length >= 6) {
        valor = valor.substring(0, 3) + '-' + valor.substring(3, 6) + '-' + valor.substring(6, 10);
    } else if (valor.length >= 3) {
        valor = valor.substring(0, 3) + '-' + valor.substring(3);
    }
    this.value = valor;
    
    const telefonoRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!telefonoRegex.test(valor)) {
        mostrarError('errorTelefono', 'Formato: 300-123-4567');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoTelefono', '✓ Teléfono válido');
        marcarCampo(this, true);
    }
});

// Validación de fecha de nacimiento
document.getElementById('fechaNacimiento').addEventListener('change', function() {
    const fechaNacimiento = new Date(this.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    
    if (edad < 18) {
        mostrarError('errorFecha', 'Debes ser mayor de 18 años');
        marcarCampo(this, false);
    } else if (edad > 100) {
        mostrarError('errorFecha', 'Fecha no válida');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoFecha', `✓ Edad: ${edad} años`);
        marcarCampo(this, true);
    }
});

// Contador de caracteres para comentarios
document.getElementById('comentarios').addEventListener('input', function() {
    const contador = document.getElementById('contadorComentarios');
    contador.textContent = this.value.length;
    
    if (this.value.length > 450) {
        contador.style.color = '#dc3545';
    } else if (this.value.length > 400) {
        contador.style.color = '#ffc107';
    } else {
        contador.style.color = '#666';
    }
    marcarCampo(this, true); // Los comentarios son opcionales
});

// Validación de términos
document.getElementById('terminos').addEventListener('change', function() {
    if (!this.checked) {
        mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
        marcarCampo(this, false);
    } else {
        ocultarMensaje('errorTerminos');
        marcarCampo(this, true);
    }
});

// 🎯 FUNCIONES AUXILIARES
function mostrarError(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
    ocultarMensaje(idElemento.replace('error', 'Exito'));
}

function mostrarExito(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
    ocultarMensaje(idElemento.replace('Exito', 'error'));
}

function ocultarMensaje(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (elemento) elemento.style.display = 'none';
}

function marcarCampo(campo, esValido) {
    estadoValidacion[campo.name] = esValido;
    if (esValido) {
        campo.classList.remove('invalido');
        campo.classList.add('valido');
    } else {
        campo.classList.remove('valido');
        campo.classList.add('invalido');
    }
    actualizarProgreso();
    actualizarBotonEnvio();
}

function calcularFortalezaPassword(password) {
    let puntos = 0;
    if (password.length >= 8) puntos++;
    if (password.length >= 12) puntos++;
    if (/[a-z]/.test(password)) puntos++;
    if (/[A-Z]/.test(password)) puntos++;
    if (/[0-9]/.test(password)) puntos++;
    if (/[^A-Za-z0-9]/.test(password)) puntos++;
    
    const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
    const nivel = Math.min(Math.floor(puntos / 1.2), 4);
    return { nivel, texto: niveles[nivel], puntos };
}

function actualizarBarraFortaleza(fortaleza) {
    const barra = document.getElementById('strengthBar');
    const clases = [
        'strength-weak',
        'strength-weak',
        'strength-medium',
        'strength-strong',
        'strength-very-strong'
    ];
    barra.className = 'password-strength ' + clases[fortaleza.nivel];
}

function actualizarProgreso() {
    const totalCampos = Object.keys(estadoValidacion).length;
    const camposValidos = Object.values(estadoValidacion).filter((valido) => valido).length;
    const porcentaje = Math.round((camposValidos / totalCampos) * 100);
    
    document.getElementById('barraprogreso').style.width = porcentaje + '%';
    document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
    const todosValidos = Object.values(estadoValidacion).every((valido) => valido);
    btnEnviar.disabled = !todosValidos;
}

// 🎯 MANEJO DEL ENVÍO DEL FORMULARIO
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    const datosFormulario = new FormData(this);
    let resumenHTML = '';
    
    for (let [campo, valor] of datosFormulario.entries()) {
        if (valor && valor.trim() !== '') {
            const nombreCampo = obtenerNombreCampo(campo);
            resumenHTML += `
                <div class="dato-resumen">
                    <span class="etiqueta-resumen">${nombreCampo}:</span> ${valor}
                </div>
            `;
        }
    }
    
    document.getElementById('contenidoResumen').innerHTML = resumenHTML;
    document.getElementById('resumenDatos').style.display = 'block';
    
    // Scroll suave hacia el resumen
    document.getElementById('resumenDatos').scrollIntoView({
        behavior: 'smooth'
    });
    
    console.log('📊 Formulario enviado con validación completa:', Object.fromEntries(datosFormulario));
});

function obtenerNombreCampo(campo) {
    const nombres = {
        'Nombres': 'Nombres',
        'Apellidos': 'Apellidos',
        'correo': 'Correo electrónico',
        'confirmacion-correo': 'Confirmación de correo',
        'password': 'Contraseña',
        'confirmarPassword': 'Confirmación de contraseña',
        'telefono': 'Teléfono',
        'fechaNacimiento': 'Fecha de nacimiento',
        'comentarios': 'Comentarios',
        'terminos': 'Términos aceptados'
    };
    return nombres[campo] || campo;
}
