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


    archiveBox.addEventListener('click', function () {
        document.getElementById('fileInput').click();
    });

    archiveBox.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    archiveBox.addEventListener('drop', function (event) {
        event.preventDefault();
        var files = event.dataTransfer.files;
        handleFiles(files);
    });


    function handleFiles(files) {
        
        for (var i = 0; i < files.length; i++) {
            alert("Nome do arquivo: " + files[i].name);
            
        }
    }
});
