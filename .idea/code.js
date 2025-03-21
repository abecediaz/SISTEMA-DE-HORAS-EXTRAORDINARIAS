function doGet(e) {
    let page = e.parameter.page || "login";
    return HtmlService.createHtmlOutputFromFile(page)
        .setTitle("Sistema Interno de Horas Extraordinarias")
}

function obtenerInformacionUsuarios() {
    const usuarios = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("USERS").getDataRange().getValues();
    return usuarios;
}

function hashPassword(password) {
    var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
    return hash.map(function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

function cargarUsuarioNuevo(id, usuario, email, password) {
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("USERS").appendRow([id, usuario, email, password, "", "", ""]);
}