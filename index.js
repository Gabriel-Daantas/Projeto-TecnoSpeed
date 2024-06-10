const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
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

    // Menu.setApplicationMenu(null);
    mainWindow.maximize()
    mainWindow.loadFile(`templates/index.html`)
}


// Função para garantir que o diretório de saída existe
function ensureOutputDirectory() {
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
}


ipcMain.on('convertPFXtoCRTandKEY', (event, PFXFile, exportPassword) => {
    ensureOutputDirectory();

    dialog.showOpenDialog({
        title: 'Selecionar pasta para salvar arquivo',
        defaultPath: 'output/',
        properties: ['openDirectory']
    }).then(result => {
        if (result.canceled) {
            console.log('O usuário cancelou a operação.');
            return;
        }

        const outputPath = result.filePaths[0];

        const commandToCRT = `openssl pkcs12 -in "${PFXFile}" -out "${outputPath}/certificado.crt" -clcerts -nokeys -password pass:${exportPassword}`;
        const commandToKEY = `openssl pkcs12 -in "${PFXFile}" -out "${outputPath}/chave.key" -nocerts -nodes -password pass:${exportPassword}`;

        exec(commandToCRT, (errorCRT, stdoutCRT, stderrCRT) => {
            if (errorCRT) {
                console.error(`Erro ao converter PFX para CRT: ${errorCRT.message}`);
                return;
            }
            if (stderrCRT) {
                console.error(`Erro ao converter PFX para CRT: ${stderrCRT}`);
                return;
            }
            console.log(`Conversão PFX para CRT bem-sucedida. Arquivo gerado: ${outputPath}/certificado.crt.`);
        });

        exec(commandToKEY, (errorKEY, stdoutKEY, stderrKEY) => {
            if (errorKEY) {
                console.error(`Erro ao converter PFX para KEY: ${errorKEY.message}`);
                dialog.showErrorBox('ERRO', 'Senha Incorreta!');
                return;
            }
            if (stderrKEY) {
                console.error(`Erro ao converter PFX para KEY: ${stderrKEY}`);
                dialog.showErrorBox('ERRO', 'Senha Incorreta!');
                return;
            }
            console.log(`Conversão PFX para KEY bem-sucedida. Arquivo gerado: ${outputPath}/chave.key`);
            dialog.showMessageBox({
                type: 'info',
                title: 'Sucesso!',
                message: 'Conversão bem-sucedida!'
            });
        });
    }).catch(err => {
        console.error('Erro ao abrir o diálogo de selecionar pasta:', err);
    });
});


ipcMain.on('convertCRTandKEYtoPFX', (event, CRTFile, KEYFile, exportPassword) => {
    ensureOutputDirectory();

    dialog.showOpenDialog({
        title: 'Selecionar pasta para salvar arquivo',
        defaultPath: 'output/',
        properties: ['openDirectory']
    }).then(result => {
        if (result.canceled) {
            console.log('O usuário cancelou a operação.');
            return;
        }

        const outputPath = result.filePaths[0];
        console.log(outputPath);

        const commandToPFX = `openssl pkcs12 -export -out "${outputPath}/arquivo.pfx" -inkey "${KEYFile}" -in "${CRTFile}" -passout pass:${exportPassword} -passin pass:${exportPassword}`;

        exec(commandToPFX, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao converter CRT e KEY para PFX: ${error.message}`);
                dialog.showErrorBox('ERRO', 'Senha Incorreta!');
                return;
            }
            if (stderr) {
                console.error(`Erro ao converter CRT e KEY para PFX: ${stderr}`);
                dialog.showErrorBox('ERRO', 'Senha Incorreta!');
                return;
            }
            console.log(`Conversão bem-sucedida. Arquivo gerado: ${outputPath}`);
            dialog.showMessageBox({
                type: 'info',
                title: 'Sucesso!',
                message: 'Conversão bem-sucedida!'
            });
        });
    }).catch(err => {
        console.error('Erro ao abrir o diálogo de salvar arquivo:', err);
    });
});


app.whenReady().then(createApp);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})