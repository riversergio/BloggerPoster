$(document).ready(function () {
    const tooltips = $('.controller-bar button');
    const animsition = $(".animsition");
    // JSON Options
    const tooltipOptions = {
        placement: 'top',
        trigger: 'hover',
        animation: true
    };
    const animsitionOptions = {
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 250,
        outDuration: 150,
        linkElement: 'a.aLink',
        // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
        loading: true,
        loadingParentElement: 'body', //animsition wrapper element
        loadingClass: 'animsition-loading',
        loadingInner: '', // e.g '<img src="loading.svg" />'
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        transition: function (url) { window.location.href = url; }
    };
    // Init
    tooltips.tooltip(tooltipOptions);
    animsition.animsition(animsitionOptions);
});