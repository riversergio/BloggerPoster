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
    const tagManager = $('.tm-input').tagsManager({
        tagsContainer: '.tags-show',
    });
    $('#addTags').on('click', e => {
        e.preventDefault();
        if ($('.tm-input').val().length) {
            tagManager.tagsManager('pushTag', $('.tm-input').val().trim());
        }
    })
});