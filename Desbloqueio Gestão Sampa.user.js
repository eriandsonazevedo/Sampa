// ==UserScript==
// @name         Desbloqueio Gestão Sampa
// @namespace    http://tampermonkey.net/
// @version      2025
// @description  Desbloqueio Gestão Sampa
// @author       Eriandson
// @match        https://*.marketup.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marketup.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Função que define ou corrige os valores no localStorage
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
        } else {
        }
    }

    // Executa no carregamento inicial
    executarAcoes();

    // Observa mudanças no DOM
    const observer = new MutationObserver(() => {
        executarAcoes();
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Monitora mudanças na URL
    let ultimaUrl = location.href;
    setInterval(() => {
        if (location.href !== ultimaUrl) {
            ultimaUrl = location.href;
            executarAcoes();
        }
    }, 500);

    // Monitora eventos de navegação
    window.addEventListener('popstate', () => {
        executarAcoes();
    });
})();