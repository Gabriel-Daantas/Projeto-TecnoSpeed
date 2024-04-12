document.addEventListener('DOMContentLoaded', function () {
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
        // handleFiles(files);
        handleFile(files);
    });


    // Função para manipular o arquivo selecionado
    function handleFile(files) {
        // const fileInput = document.getElementById('fileInput');
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const fileContent = event.target.result;
                    const fileName = file.name;
                    const fileExtension = fileName.split('.').pop().toUpperCase();

                    // Aqui você pode chamar a função para processar o conteúdo do arquivo
                    // Passando fileContent, fileName e fileExtension como parâmetros
                    processFile(fileContent, fileName, fileExtension);
                };

                // Lê o conteúdo do arquivo como texto
                reader.readAsText(file);
            } else {
                console.log('Nenhum arquivo selecionado.');
            }
        }
    }

    // Função para processar o conteúdo do arquivo
    function processFile(content, name, extension) {
        // Aqui você pode implementar a lógica para manipular o conteúdo do arquivo
        console.log('Conteúdo do arquivo:', content);
        // console.log('Nome do arquivo:', name);
        // console.log('Extensão do arquivo:', extension);
    }

    // Função para manipular os arquivos arrastados
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            alert("Nome do arquivo: " + files[i].name);
        }
    }

});
