



document.addEventListener('DOMContentLoaded', function () {
    const { ipcRenderer } = require('electron');

    const menuBar = document.querySelector('.menu-bar');
    const logoNavbar = document.querySelector('.logo-navbar');
    const archiveBox = document.querySelector('.archive-box');
    const archiveDisplay = document.querySelector('.archive-display');

    const archivesStatus = document.querySelector('.archives-status');
    const archiveStatusCRT = document.querySelector('.archive-status-crt');
    const archiveStatusKey = document.querySelector('.archive-status-key');
    const archiveStatusPFX = document.querySelector('.archive-status-pfx');

    const removeArchiveButtons = document.querySelectorAll('.remove-icon');

    let crtPath = '';
    let keyPath = '';
    let pfxPath = '';
    let files = '';

    menuBar.addEventListener('click', function (event) {

        // Obtendo as coordenadas do clique.
        const clickX = event.clientX;
        const clickY = event.clientY;

        // Obtendo as dimensões e a posição do pseudo-elemento usando getComputedStyle.
        const pseudoStyles = window.getComputedStyle(menuBar, '::before');
        const pseudoRect = menuBar.getBoundingClientRect();

        // Verificando se o clique ocorreu dentro das coordenadas do pseudo-elemento.
        if (
            clickX >= pseudoRect.right &&
            clickX <= pseudoRect.right + parseFloat(pseudoStyles.width) &&
            clickY >= pseudoRect.top &&
            clickY <= pseudoRect.top + parseFloat(pseudoStyles.height)
        ) {
            menuBar.classList.toggle('open-menu');
            logoNavbar.classList.toggle('opacity-0');
        }
    });


    // Adiciona um ouvinte de evento ao botão de conversão
    archiveDisplay.addEventListener('click', function () {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function (event) {
        const files = event.target.files;
        verifyFiles(files);
    });

    archiveBox.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    archiveBox.addEventListener('drop', function (event) {
        event.preventDefault();
        files = event.dataTransfer.files;
        verifyFiles(files);
    });

    archiveBox.addEventListener('mouseover', function (event) {
        document.querySelector('.cloud-icon').classList.add('cloud-keyframe');
    });
    archiveBox.addEventListener('mouseout', function (event) {
        document.querySelector('.cloud-icon').classList.remove('cloud-keyframe');
    });

    // Função para manipular o arquivo selecionado
    function verifyFiles(files) {
        const filesArray = Array.from(files);

        const crtFiles = filesArray.filter(file => file.name.includes('.crt'));
        const keyFiles = filesArray.filter(file => file.name.includes('.key'));
        const pfxFiles = filesArray.filter(file => file.name.includes('.pfx'));

        if (crtFiles.length > 1 || keyFiles.length > 1) {
            alert("Há mais de 1 arquivo .CRT ou .KEY, para evitar erros de conversão, insira somente um par (.CRT + .KEY).")

        } else if ((crtFiles.length !== 0 || keyFiles.length !== 0) && pfxFiles.length !== 0) {
            alert(`Para evitar erros de conversão, insira somente um par (.CRT + .KEY) ou um arquivo .PFX, não misture os arquivos.`)

        } else if (pfxFiles.length > 1) {
            alert(`Para evitar erros de conversão, insira somente um arquivo .PFX.`)

        } else {

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file) {
                    const fileName = file.name;
                    const fileExtension = fileName.split('.').pop().toUpperCase();
                    const filePath = file.path;

                    if (fileExtension === 'PFX') {
                        pfxPath = filePath;
                        resetFiles("crt e key");

                        if (archivesStatus.classList.contains('remove-archives-status')) {
                            archivesStatus.classList.remove('remove-archives-status');
                        }

                        archiveStatusPFX.classList.remove('hide-archive-status');
                        archiveStatusCRT.classList.add('hide-archive-status');
                        archiveStatusKey.classList.add('hide-archive-status');

                        revealPassInput(true);

                    } else if (fileExtension === 'KEY' || fileExtension === 'CRT') {
                        resetFiles("pfx");

                        if (archivesStatus.classList.contains('remove-archives-status')) {
                            archivesStatus.classList.remove('remove-archives-status');
                        }
                        archiveStatusPFX.classList.add('hide-archive-status');
                        archiveStatusKey.classList.remove('hide-archive-status');
                        archiveStatusCRT.classList.remove('hide-archive-status');

                        if (fileExtension === 'CRT') {
                            crtPath = filePath;
                            archiveStatusCRT.classList.add('containArchive');
                        } else {
                            keyPath = filePath;
                            archiveStatusKey.classList.add('containArchive');
                        }

                        if (crtPath && keyPath) {
                            revealPassInput(true);
                        }

                    } else {
                        alert(`O arquivo ${fileName} precisa ser do tipo .PFX, .CRT ou .KEY`)
                    }

                } else {
                    console.log('Nenhum arquivo selecionado.');
                }
            }
        }
    }


    document.querySelector('.pass-submit').addEventListener('click', function () {
        const senha = document.querySelector('.pass-input').value;

        if (pfxPath) {
            ipcRenderer.removeAllListeners('conversionResult');
            ipcRenderer.send("convertPFXtoCRTandKEY", pfxPath, senha);

            ipcRenderer.on('conversionResult', (event, response) => {
                if (response.success) {

                    const mensagem = response.message;

                    alert(`Resultado da conversão: ${mensagem}`);
                    // console.log('Resultado da conversão:', response.message);
                } else {
                    alert('Senha Incorreta!')
                }
            });

        } else if (crtPath && keyPath) {
            ipcRenderer.removeAllListeners('conversionResult');
            ipcRenderer.send("convertCRTandKEYtoPFX", crtPath, keyPath, senha);

            ipcRenderer.on('conversionResult', (event, response) => {
                if (response.success) {

                    const mensagem = response.message;

                    alert(`Resultado da conversão: ${mensagem}`);
                    // console.log('Resultado da conversão:', response.message);
                } else {
                    alert('Senha Incorreta!')
                }
            });
        }
    });



    removeArchiveButtons.forEach(removeButton => {
        removeButton.addEventListener('click', () => {
            resetFiles(removeButton.id);
        });
    });


    function resetDisplayBox() {
        archivesStatus.classList.add('remove-archives-status');
        archiveStatusPFX.classList.add('hide-archive-status');
        archiveStatusCRT.classList.add('hide-archive-status');
        archiveStatusKey.classList.add('hide-archive-status');
        revealPassInput(false);
    }

    function resetFiles(fileToReset) {
        if (fileToReset == 'pfx') {
            pfxPath = '';

        } else if (fileToReset == 'crt') {
            crtPath = '';
            archiveStatusCRT.classList.remove('containArchive');

        } else if (fileToReset == 'key') {
            keyPath = '';
            archiveStatusKey.classList.remove('containArchive');

        } else if (fileToReset == 'crt e key') {
            crtPath = '';
            keyPath = '';
            archiveStatusCRT.classList.remove('containArchive');
            archiveStatusKey.classList.remove('containArchive');
        }

        if (!pfxPath && !crtPath && !keyPath) {
            resetDisplayBox();

        }

        if (!crtPath || !keyPath) {
            revealPassInput(false);
        }
    }


    function revealPassInput(hide) {
        if (hide) {
            document.querySelector('.password-box').classList.remove('hide-password-box');
            document.querySelector('.pass-input').value = '';

        } else {
            document.querySelector('.password-box').classList.add('hide-password-box');
        }
    }

    function salvarArquivo(fileName, PFXFile) {
        // const PFXFile = 'conteúdo_do_arquivo';
        // const fileName = 'nome_do_arquivo';

        // Criando um Blob (objeto binário) a partir dos dados do arquivo
        const blob = new Blob([PFXFile], { type: 'application/octet-stream' });

        // Usando o método saveAs do FileSaver.js para oferecer uma opção de salvar o arquivo
        saveAs(blob, `${fileName}.pfx`);
    }

});
