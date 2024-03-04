document.addEventListener('DOMContentLoaded', function () {
    const menuBar = document.querySelector('.menu-bar');
    const helpButton = document.querySelector('.help-button');
    const helpBox = document.querySelector('.help-box');

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
            menuBar.classList.toggle('close-menu');
         }
    });


    helpButton.addEventListener('click', function () {
        helpBox.classList.toggle('help-box-open');
        helpButton.classList.toggle('help-button-hover');
    })

});
