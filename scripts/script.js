



document.addEventListener('DOMContentLoaded', function () {
    const { ipcRenderer } = require('electron');

    const menuBar = document.querySelector('.menu-bar');
    const helpButton = document.querySelector('.help-button');
    const helpBox = document.querySelector('.help-box');
    const logoNavbar = document.querySelector('.logo-navbar');
    const archiveBox = document.querySelector('.archive-box');

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


    helpButton.addEventListener('click', function () {
        helpBox.classList.toggle('help-box-open');
        helpButton.classList.toggle('help-button-hover');
    })


    // Adiciona um ouvinte de evento ao botão de conversão
    archiveBox.addEventListener('click', function () {
        document.getElementById('fileInput').click();
    });

    archiveBox.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    archiveBox.addEventListener('drop', function (event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFile(files);
    });


    // Função para manipular o arquivo selecionado
    function handleFile(files) {
        const filesArray = Array.from(files);

        const crtFiles = filesArray.filter(file => file.name.includes('.crt'));
        const keyFiles = filesArray.filter(file => file.name.includes('.key'));
        const pfxFiles = filesArray.filter(file => file.name.includes('.pfx'));

        if (crtFiles.length > 1 || keyFiles.length > 1) {
            alert("Há mais de 1 arquivo .CRT ou .KEY, para evitar erros de conversão, insira somente um par (.CRT + .KEY).")

        } else if ((crtFiles.length !== 0 || keyFiles.length !== 0) && pfxFiles.length !== 0) {
            alert(`Para evitar erros de conversão, insira somente um par (.CRT + .KEY) ou arquivos .PFX, não misture os arquivos.`)

        } else if ((crtFiles.length === 1 && keyFiles.length !== 1) || (crtFiles.length !== 1 && keyFiles.length === 1)) {
            alert(`Inseriu somente um arquivo tipo .CRT ou .KEY, insira um par (.CRT + .KEY).`)

        } else {
            let crtPath = ''
            let keyPath = ''
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file) {
                    const fileName = file.name;
                    const fileExtension = fileName.split('.').pop().toUpperCase();
                    const filePath = file.path;

                    if (fileExtension === 'PFX') {
                        ipcRenderer.send("convertPFXtoCRTandKEY", filePath);

                    } else if (fileExtension === 'KEY' || fileExtension === 'CRT') {
                        if (fileExtension === 'CRT') {
                            crtPath = filePath;
                        } else {
                            keyPath = filePath;
                        }

                        if (crtPath && keyPath) {
                            ipcRenderer.send("convertCRTandKEYtoPFX", crtPath, keyPath);
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


    // Função para manipular os arquivos arrastados
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            alert("Nome do arquivo: " + files[i].name);
        }
    }


    function convertPFXtoCRTandKEY(PFXFile, exportPassword) {
        const blob = new Blob([PFXFile], { type: 'application/octet-stream' });
        // const blob = new Blob([PFXFile], { type: 'application/x-x509-ca-cert' });

        // Usando o método saveAs do FileSaver.js para oferecer uma opção de salvar o arquivo
        saveAs(blob, 'Documento.pfx');

    }

    function convertCRTandKEYtoPFX(PFXFile, exportPassword) {

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
