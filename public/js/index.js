$(document).ready(function () {
    const tooltips = $('.controller-bar button');
    // JSON Options
    const tooltipOptions = {
        placement: 'top',
        trigger: 'hover',
        animation: true
    };
    // Init
    tooltips.tooltip(tooltipOptions);
    $('.tm-input').tagsManager({
        tagsContainer: '.tags-show',
    });
});