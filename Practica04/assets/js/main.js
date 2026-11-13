
// ============================================================
// 1. MENSAJE INICIAL
// ============================================================
console.log("Hola Mundo, desde JavaScript");

// ============================================================
// 2. CÁLCULO DE EDAD
// ============================================================
const fechaNacimiento = document.getElementById("fechaNacimiento");
const resultadoEdad = document.getElementById("resultadoEdad");

if (fechaNacimiento && resultadoEdad) {
    fechaNacimiento.addEventListener("change", function () {
        resultadoEdad.classList.remove(
            "edad-estado--mayor",
            "edad-estado--menor",
            "edad-estado--error"
        );

        if (fechaNacimiento.value === "") {
            resultadoEdad.textContent = "Selecciona una fecha para calcular tu edad.";
            return;
        }

        const [anio, mes, dia] = fechaNacimiento.value.split("-").map(Number);
        const nacimiento = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (nacimiento > hoy) {
            resultadoEdad.textContent =
                "Error: no se puede calcular la edad con una fecha futura.";
            resultadoEdad.classList.add("edad-estado--error");
            return;
        }

        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const diferenciaMeses = hoy.getMonth() - nacimiento.getMonth();
        const diferenciaDias = hoy.getDate() - nacimiento.getDate();

        if (
            diferenciaMeses < 0 ||
            (diferenciaMeses === 0 && diferenciaDias < 0)
        ) {
            edad--;
        }

        if (edad >= 18) {
            resultadoEdad.textContent = `Eres mayor de edad. Tienes ${edad} años.`;
            resultadoEdad.classList.add("edad-estado--mayor");
        } else {
            resultadoEdad.textContent = `Eres menor de edad. Tienes ${edad} años.`;
            resultadoEdad.classList.add("edad-estado--menor");
        }
    });
}

// ============================================================
// 3. NAVEGACIÓN DEL FORMULARIO DE CUATRO PASOS
// ============================================================
const formulario = document.getElementById("formRegistro");
const paneles = document.querySelectorAll(".wizard-panel");
const pasos = document.querySelectorAll(".stepper-item");
const botonesPaso = document.querySelectorAll(".step-btn");

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnSiguienteTexto = document.getElementById("btnSiguienteTexto");
const btnSiguienteIcono = document.getElementById("btnSiguienteIcono");
const btnLimpiar = document.getElementById("btnLimpiar");
const progreso = document.getElementById("wizardProgress");
const banner = document.getElementById("bannerFormulario");

let pasoActual = 1;
const totalPasos = paneles.length;

function mostrarBanner(mensaje) {
    if (!banner) return;

    banner.textContent = mensaje;
    banner.hidden = false;
}

function ocultarBanner() {
    if (!banner) return;

    banner.textContent = "";
    banner.hidden = true;
}

function mostrarPaso(numero) {
    pasoActual = numero;

    paneles.forEach((panel) => {
        panel.hidden = Number(panel.dataset.step) !== numero;
    });

    pasos.forEach((paso) => {
        const numeroPaso = Number(paso.dataset.step);

        paso.classList.toggle("is-active", numeroPaso === numero);
        paso.classList.toggle("is-completed", numeroPaso < numero);
    });

    if (btnAnterior) {
        btnAnterior.disabled = numero === 1;
    }

    if (btnSiguienteTexto && btnSiguienteIcono) {
        if (numero === totalPasos) {
            btnSiguienteTexto.textContent = "Enviar solicitud";
            btnSiguienteIcono.textContent = "check";
        } else {
            btnSiguienteTexto.textContent = "Siguiente";
            btnSiguienteIcono.textContent = "arrow_forward";
        }
    }

    if (progreso) {
        progreso.style.width = `${((numero - 1) / (totalPasos - 1)) * 100}%`;
    }

    ocultarBanner();
}

// Validar solamente los campos obligatorios del paso actual.
function validarPaso(numero) {
    const panel = document.getElementById(`panel-${numero}`);

    if (!panel) return true;

    const campos = panel.querySelectorAll("input, select, textarea");

    for (const campo of campos) {
        if (campo.disabled) continue;

        if (!campo.checkValidity()) {
            campo.reportValidity();
            campo.focus();
            return false;
        }
    }

    // Validar las reglas de la contraseña.
    if (numero === 3) {
        const password = document.getElementById("password");
        const confirmar = document.getElementById("confirmarPassword");

        if (password && confirmar) {
            if (!validarReglasPassword(password.value)) {
                password.setCustomValidity(
                    "La contraseña no cumple con todos los requisitos."
                );
                password.reportValidity();
                password.setCustomValidity("");
                password.focus();
                return false;
            }

            if (password.value !== confirmar.value) {
                confirmar.setCustomValidity("Las contraseñas no coinciden.");
                confirmar.reportValidity();
                confirmar.setCustomValidity("");
                confirmar.focus();
                return false;
            }
        }
    }

    return true;
}

if (btnSiguiente) {
    btnSiguiente.addEventListener("click", function () {
        if (!validarPaso(pasoActual)) {
            mostrarBanner("Revisa los campos obligatorios antes de continuar.");
            return;
        }

        if (pasoActual < totalPasos) {
            mostrarPaso(pasoActual + 1);
        } else {
            mostrarBanner(
                "¡Formulario validado correctamente! La solicitud está lista."
            );
            console.log("Datos del formulario:", new FormData(formulario));
        }
    });
}

if (btnAnterior) {
    btnAnterior.addEventListener("click", function () {
        if (pasoActual > 1) {
            mostrarPaso(pasoActual - 1);
        }
    });
}

// Permitir navegar con los botones del indicador de pasos.
botonesPaso.forEach((boton) => {
    boton.addEventListener("click", function () {
        const elementoPaso = boton.closest(".stepper-item");
        const destino = Number(elementoPaso.dataset.step);

        if (destino < pasoActual) {
            mostrarPaso(destino);
        } else if (destino > pasoActual) {
            let puedeAvanzar = true;

            for (let paso = pasoActual; paso < destino; paso++) {
                if (!validarPaso(paso)) {
                    puedeAvanzar = false;
                    break;
                }
            }

            if (puedeAvanzar) {
                mostrarPaso(destino);
            }
        }
    });
});

// ============================================================
// 4. BOTÓN LIMPIAR SECCIÓN
// ============================================================
if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
        const panel = document.getElementById(`panel-${pasoActual}`);

        if (!panel) return;

        const campos = panel.querySelectorAll("input, select, textarea");

        campos.forEach((campo) => {
            if (campo.type === "checkbox" || campo.type === "radio") {
                campo.checked = campo.defaultChecked;
            } else if (campo.type === "file") {
                campo.value = "";
            } else {
                campo.value = campo.defaultValue;
            }

            campo.setCustomValidity("");
        });

        panel.querySelectorAll(".field-error").forEach((error) => {
            error.textContent = "";
            error.hidden = true;
        });

        // Restablecer los elementos relacionados con el QR.
        if (pasoActual === 2) {
            actualizarQR();
        }

        // Restablecer las redes sociales.
        actualizarRedesSociales();

        // Actualizar el cálculo de edad si se limpió el primer paso.
        if (pasoActual === 1 && fechaNacimiento) {
            fechaNacimiento.dispatchEvent(new Event("change"));
        }

        // Actualizar las reglas de contraseña.
        if (pasoActual === 3) {
            actualizarReglasPassword();
        }

        ocultarBanner();
    });
}

// ============================================================
// 5. MOSTRAR Y OCULTAR CONTRASEÑAS
// ============================================================
document.querySelectorAll(".toggle-pass").forEach((boton) => {
    boton.addEventListener("click", function () {
        const objetivo = document.getElementById(boton.dataset.target);

        if (!objetivo) return;

        const icono = boton.querySelector(".material-symbols-outlined");

        if (objetivo.type === "password") {
            objetivo.type = "text";
            if (icono) icono.textContent = "visibility_off";
        } else {
            objetivo.type = "password";
            if (icono) icono.textContent = "visibility";
        }
    });
});

// ============================================================
// 6. VALIDACIÓN DE CONTRASEÑA EN TIEMPO REAL
// ============================================================
const password = document.getElementById("password");
const confirmarPassword = document.getElementById("confirmarPassword");

function validarReglasPassword(valor) {
    return (
        valor.length >= 8 &&
        /[A-Z]/.test(valor) &&
        /[a-z]/.test(valor) &&
        /[0-9]/.test(valor) &&
        /[^A-Za-z0-9]/.test(valor)
    );
}

function actualizarReglasPassword() {
    if (!password) return;

    const valor = password.value;

    const reglas = {
        longitud: valor.length >= 8,
        mayuscula: /[A-Z]/.test(valor),
        minuscula: /[a-z]/.test(valor),
        numero: /[0-9]/.test(valor),
        especial: /[^A-Za-z0-9]/.test(valor)
    };

    document.querySelectorAll("#reglasContrasena li").forEach((elemento) => {
        const regla = elemento.dataset.regla;
        elemento.classList.toggle("cumplida", Boolean(reglas[regla]));
    });
}

if (password) {
    password.addEventListener("input", actualizarReglasPassword);
}

if (confirmarPassword) {
    confirmarPassword.addEventListener("input", function () {
        confirmarPassword.setCustomValidity("");
    });
}

// ============================================================
// 7. ACTIVAR Y DESACTIVAR REDES SOCIALES
// ============================================================
function actualizarRedesSociales() {
    const redes = [
        ["checkFacebook", "urlFacebook"],
        ["checkLinkedIn", "urlLinkedIn"],
        ["checkWhatsApp", "whatsAppQR"]
    ];

    redes.forEach(([idCheck, idCampo]) => {
        const check = document.getElementById(idCheck);
        const campo = document.getElementById(idCampo);

        if (!check || !campo) return;

        campo.disabled = !check.checked;

        if (!check.checked) {
            campo.value = "";
        }
    });

    actualizarQR();
}

["checkFacebook", "checkLinkedIn", "checkWhatsApp"].forEach((id) => {
    const check = document.getElementById(id);

    if (check) {
        check.addEventListener("change", actualizarRedesSociales);
    }
});

// ============================================================
// 8. VISTA PREVIA DEL CÓDIGO QR
// ============================================================
const whatsAppQR = document.getElementById("whatsAppQR");
const qrImage = document.getElementById("qrImage");
const qrEmpty = document.getElementById("qrEmpty");
const qrError = document.getElementById("qrError");
const qrFileName = document.getElementById("qrFileName");
const qrRemove = document.getElementById("qrRemove");

function actualizarQR() {
    if (!whatsAppQR || !qrImage) return;

    if (whatsAppQR.value === "") {
        qrImage.removeAttribute("src");
        qrImage.hidden = true;

        if (qrEmpty) qrEmpty.hidden = false;
        if (qrRemove) qrRemove.hidden = true;
        if (qrError) qrError.hidden = true;

        if (qrFileName) {
            qrFileName.textContent =
                "Solo vista previa local; no se envía al servidor.";
        }
    }
}

if (whatsAppQR) {
    whatsAppQR.addEventListener("change", function () {
        const archivo = whatsAppQR.files[0];

        if (!archivo) {
            actualizarQR();
            return;
        }

        if (!archivo.type.startsWith("image/")) {
            if (qrError) {
                qrError.textContent = "Selecciona un archivo de imagen válido.";
                qrError.hidden = false;
            }

            whatsAppQR.value = "";
            actualizarQR();
            return;
        }

        if (qrError) qrError.hidden = true;

        const lector = new FileReader();

        lector.onload = function (evento) {
            qrImage.src = evento.target.result;
            qrImage.hidden = false;

            if (qrEmpty) qrEmpty.hidden = true;
            if (qrRemove) qrRemove.hidden = false;

            if (qrFileName) {
                qrFileName.textContent = archivo.name;
            }
        };

        lector.readAsDataURL(archivo);
    });
}

if (qrRemove) {
    qrRemove.addEventListener("click", function () {
        whatsAppQR.value = "";
        actualizarQR();
    });
}

// ============================================================
// 9. MÓDULO DE PRÁCTICA: FILTRO DE CITAS
// ============================================================
const filtroMes = document.getElementById("appoimentByMonth");
const filtroSemana = document.getElementById("appoimentByWeek");
const botonVerCitas = document.getElementById("verCitas");

if (filtroMes && filtroSemana) {
    filtroMes.addEventListener("change", function () {
        if (filtroMes.checked) {
            document.querySelector('input[type="month"]').disabled = false;
            document.querySelector('input[type="week"]').disabled = true;
        }
    });

    filtroSemana.addEventListener("change", function () {
        if (filtroSemana.checked) {
            document.querySelector('input[type="month"]').disabled = true;
            document.querySelector('input[type="week"]').disabled = false;
        }
    });
}

if (botonVerCitas) {
    botonVerCitas.addEventListener("click", function () {
        const mes = document.querySelector('input[type="month"]');
        const semana = document.querySelector('input[type="week"]');

        if (filtroSemana && filtroSemana.checked) {
            if (!semana.value) {
                alert("Selecciona una semana para consultar las citas.");
                return;
            }

            alert(`Filtro seleccionado: semana ${semana.value}`);
        } else {
            if (!mes.value) {
                alert("Selecciona un mes para consultar las citas.");
                return;
            }

            alert(`Filtro seleccionado: ${mes.value}`);
        }
    });
}

// ============================================================
// 10. MÓDULO DE PRÁCTICA: COLORES
// ============================================================
const fontColor = document.getElementById("fontColor");
const backgroundColor = document.getElementById("backgroundColor");

if (fontColor) {
    fontColor.addEventListener("input", function () {
        document.body.style.color = fontColor.value;
    });
}

if (backgroundColor) {
    backgroundColor.addEventListener("input", function () {
        document.body.style.backgroundColor = backgroundColor.value;
    });
}

// ============================================================
// 11. MÓDULO DE PRÁCTICA: SILENCIAR
// ============================================================
const soundsVolume = document.getElementById("soundsVolume");
const muteSounds = document.getElementById("muteSounds");

let volumenAnterior = soundsVolume ? soundsVolume.value : 80;

if (muteSounds && soundsVolume) {
    muteSounds.addEventListener("click", function () {
        if (Number(soundsVolume.value) > 0) {
            volumenAnterior = soundsVolume.value;
            soundsVolume.value = 0;
            muteSounds.innerHTML =
                '<span class="material-symbols-outlined" aria-hidden="true">volume_up</span> Activar Sonidos';
        } else {
            soundsVolume.value = volumenAnterior;
            muteSounds.innerHTML =
                '<span class="material-symbols-outlined" aria-hidden="true">volume_off</span> Silenciar Sonidos';
        }

        soundsVolume.dispatchEvent(new Event("input"));
    });
}

// ============================================================
// 12. MÓDULO DE PRÁCTICA: BOTÓN DE IMAGEN SIGUIENTE
// ============================================================
const buttonNext = document.getElementById("buttonNext");

if (buttonNext) {
    buttonNext.addEventListener("click", function (evento) {
        evento.preventDefault();
        alert("Botón Siguiente seleccionado.");
    });
}

// ============================================================
// 13. MÓDULO DE PRÁCTICA: SOLICITAR HERRAMIENTAS
// ============================================================
const requestTool = document.getElementById("requestTool");

if (requestTool) {
    requestTool.addEventListener("click", function () {
        const categoria = document.querySelector(
            'input[name="resourceCategory"]:checked'
        );
        const pieza = document.getElementById("selectPieza");
        const cantidad = document.getElementById("toolQuantity");

        if (!categoria) {
            alert("Selecciona una categoría: refacción o herramienta.");
            return;
        }

        if (!cantidad.value || Number(cantidad.value) < 1) {
            alert("Ingresa una cantidad válida.");
            cantidad.focus();
            return;
        }

        alert(
            `Solicitud registrada:\n` +
            `Categoría: ${categoria.value}\n` +
            `Pieza: ${pieza.value}\n` +
            `Cantidad: ${cantidad.value}`
        );
    });
}

// ============================================================
// 14. EVITAR ENVÍOS ACCIDENTALES DE LOS FORMULARIOS
// ============================================================
document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
    });
});

// ============================================================
// 15. INICIAR EL FORMULARIO EN EL PRIMER PASO
// ============================================================
mostrarPaso(1);
actualizarRedesSociales();
actualizarReglasPassword();

console.log("MecaGest: funciones y eventos inicializados correctamente.");