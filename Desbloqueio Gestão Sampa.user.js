// ==UserScript==
// @name         Desbloqueio Gestão Sampa
// @namespace    http://tampermonkey.net/
// @version      2025.1
// @description  Redireciona ao PDV e ajusta layout Gestão Sampa, com redirecionamento inteligente
// @match        https://*/muppos/*
// @match        https://*/index.html
// @match        https://*/index-adesampa.html
// @match        https://*.marketup.com/*
// @updateURL    https://raw.githubusercontent.com/eriandsonazevedo/Sampa/main/Desbloqueio%20Gest%C3%A3o%20Sampa.user.js
// @downloadURL  https://raw.githubusercontent.com/eriandsonazevedo/Sampa/main/Desbloqueio%20Gest%C3%A3o%20Sampa.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marketup.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------
    // 1️⃣ Redirecionamento Inteligente
    // ----------------------------

    let redirectTimeout;

    function scheduleRedirect() {
        clearTimeout(redirectTimeout);
        redirectTimeout = setTimeout(() => {
            if (window.location.hash === '#/home') {
                window.location.replace('muppos');
            }
        }, 10000); // 10 segundos
    }

    function cancelRedirectOnClick(event) {
        // Cancela se clicar em <li> com id
        if (event.target.closest('li[id]')) {
            clearTimeout(redirectTimeout);
        }
    }

    // Executa apenas após carregamento completo da página
    window.addEventListener('load', () => {
        scheduleRedirect();
        document.addEventListener('click', cancelRedirectOnClick);
    });

    // Observa mudanças na URL (frameworks SPA)
    window.addEventListener('hashchange', scheduleRedirect);

    // ----------------------------
    // 2️⃣ Desbloqueio Gestão Sampa
    // ----------------------------

    function executarAcoes() {
        let pdvInfo = JSON.parse(localStorage.getItem('PdvInstallSummaryInfo')) || {};
        let alterado = false;

        if (pdvInfo.SourceID !== 79) {
            pdvInfo.SourceID = 79;
            alterado = true;
        }
        if (pdvInfo.SourceName !== "Adesampa") {
            pdvInfo.SourceName = "Adesampa";
            alterado = true;
        }

        if (alterado) {
            localStorage.setItem('PdvInstallSummaryInfo', JSON.stringify(pdvInfo));
        }
    }

    // Executa imediatamente
    executarAcoes();

    // Observa mudanças no DOM
    const observer = new MutationObserver(executarAcoes);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Observa mudanças de URL
    let ultimaUrl = location.href;
    setInterval(() => {
        if (location.href !== ultimaUrl) {
            ultimaUrl = location.href;
            executarAcoes();
        }
    }, 500);

    window.addEventListener('popstate', executarAcoes);

})();
