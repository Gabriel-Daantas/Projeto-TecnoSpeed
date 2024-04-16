const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createApp() {

    const mainWindow = new BrowserWindow({
        width: 1080,
        height: 720,
        fullscreenable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    Menu.setApplicationMenu(null);
    mainWindow.maximize()
    // mainWindow.loadURL(`File://${__dirname}/templates/index.html`)
    mainWindow.loadFile(`templates/index.html`)
}

ipcMain.on('convertPFXtoCRTandKEY', (event, PFXFile) => {
    const exportPassword = ''
    const commandToCRT = `openssl pkcs12 -in "${PFXFile}" -out "output/certificado.crt" -clcerts -nokeys -password pass: ${exportPassword}`;
    const commandToKEY = `openssl pkcs12 -in "${PFXFile}" -out "output/chave.key" -nocerts -nodes -password pass: ${exportPassword}`;

    exec(commandToCRT, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao converter PFX para CRT: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro ao converter PFX para CRT: ${stderr}`);
            return;
        }
        // console.log(`Conversão PFX para CRT e KEY bem-sucedida. Arquivos gerados: ${outputCRTFile}, ${outputKEYFile}`);
        console.log(`Conversão PFX para CRT bem-sucedida. Arquivo gerado: certificado.crt.`);
    });

    exec(commandToKEY, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao converter PFX para KEY: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro ao converter PFX para KEY: ${stderr}`);
            return;
        }
        // console.log(`Conversão PFX para CRT e KEY bem-sucedida. Arquivos gerados: ${outputCRTFile}, ${outputKEYFile}`);
        console.log(`Conversão PFX para KEY bem-sucedida. Arquivo gerado: chave.key`);
    });
})


ipcMain.on('convertCRTandKEYtoPFX', (event, CRTFile, KEYFile) => {
    const exportPassword = ''
    const commandToPFX = `openssl pkcs12 -export -out "output/arquivo.pfx" -inkey "${KEYFile}" -in "${CRTFile}" -passout pass: ${exportPassword}`;

    exec(commandToPFX, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao converter CRT e KEY para PFX: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro ao converter CRT e KEY para PFX: ${stderr}`);
            return;
        }
        // console.log(`Conversão PFX para CRT e KEY bem-sucedida. Arquivos gerados: ${outputCRTFile}, ${outputKEYFile}`);
        console.log(`Conversão CRT e KEY para PFX bem-sucedida. Arquivo gerado: arquivo.pfx`);
    });

})


app.whenReady().then(createApp);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})