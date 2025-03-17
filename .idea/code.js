const ss = SpreadsheetApp.getActiveSpreadsheet()

function doGet(e) {
    return HtmlService.createHtmlOutputFromFile("login")
}

function obtenerInformacion(ss, hoja, columna) {
    const [head, ...data] = ss.getSheetByName(hoja).getDataRange().getValues();
    const index = head.indexOf(columna);

    if (index === -1) {
        return [];
    }

    return data.map(row => row[head.indexOf(columna)])
        .filter(valor => valor !== "" && valor !== null && valor !== undefined);
}

function cerrarMensajeError() {
    const mensajeDiv = document.getElementById("mensajeError");
    mensajeDiv.style.display = "none";
}

function cerrarMensajeExito() {
    const mensajeDiv = document.getElementById("mensajeExito");
    mensajeDiv.style.display = "none";
}

function mostrarMensajeError(mensaje) {
    const mensajeDiv = document.getElementById("mensajeError");
    const mensajeTexto = document.getElementById("mensajeErrorTexto");

    mensajeTexto.innerText = mensaje;
    mensajeDiv.style.display = "block";
    return true;
}

function mostrarMensajeExito(mensaje) {
    const mensajeDiv = document.getElementById("mensajeExito");
    const mensajeTexto = document.getElementById("mensajeExitoTexto");

    mensajeTexto.innerText = mensaje;
    mensajeDiv.style.display = "block";
}

function validarCampoVacio(usuario, email, password, rpassword) {
    if (arguments.length === 3) {
        if (!email || !password) {
            return mostrarMensajeError("Por favor, complete todos los campos para poder ingresar.");
        }
    } else {
        if (!usuario || !email || !password || !rpassword) {
            return mostrarMensajeError("Por favor, complete todos los campos del formulario.");
        }
    }
    return false;
}

function validarEmailsExistentesRegistro(email) {
    let emails = obtenerInformacion(ss,"USERS", "EMAIL");

    if (emails.includes(email)) {
        return mostrarMensajeError("El mail ingresado ya existe.");
    }
    return false;
}

function validarInformacionLogin(email, password) {
    let emails = obtenerInformacion(ss,"USERS", "EMAIL");
    let passwords = obtenerInformacion(ss,"USERS", "PASSWORD");

    if (emails.includes(email)) {
        if (passwords[emails.indexOf(email)] !== hashPassword(password)) {
            return mostrarMensajeError("La contraseña ingresada es incorrecta o no se corresponde al mail ingresado.")
        }
    } else {
        return mostrarMensajeError("El mail ingresado no está registrado.")
    }

    return false;
}

function validarNivelAcceso(email) {
    let emails = obtenerInformacion(ss,"USERS", "EMAIL");
    let accesos = obtenerInformacion(ss,"USERS", "ACCESS");

    switch (accesos[emails.indexOf(email)]) {
        case "BASICO":
        case "ALTO":
        case "CENTRAL":
            return false;
        default:
            return mostrarMensajeError("Su cuenta aún no ha sido validada. Por favor, intentelo más tarde.");
    }
}

function validarPasswordRepetida(password, rpassword) {
    if (rpassword !== password) {
        return mostrarMensajeError("Las contraseñas ingresadas no son iguales entre sí.");
    }
    return false;
}

function hashPassword(password) {
    var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
    return hash.map(function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

function registrarUsuario(usuario, email, password, rpassword) {
    let id = Utilities.getUuid();

    if (validarCampoVacio(usuario, email, password, rpassword) ||
        validarEmailsExistentesRegistro(email) ||
        validarPasswordRepetida (password, rpassword)) {
        return "error";
    }

    ss.getSheetByName("USERS").appendRow([id, usuario, email, hashPassword(password), "", "", ""]);
    mostrarMensajeExito("¡El usuario ha sido registrado correctamente!");
}

function loginUsuario(email, password) {
    if (validarCampoVacio(email, password) ||
        validarInformacionLogin(email, password) ||
        validarNivelAcceso(email)
    ) {
        return "error";
    }

    //INGRESAR A LA PÁGINA SEGÚN SU NIVEL DE ACCESO
}