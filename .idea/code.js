function doGet(e) {
    return HtmlService.createHtmlOutputFromFile("login")
        .setTitle("Sistema de Horas Extraordinarias | Login")
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