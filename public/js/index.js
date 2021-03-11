$(document).ready(function () {
    const tooltips = $('.controller-bar button');
    const animsition = $(".animsition");
    const paginationButton = $('.post-pagination .btn');
    const originpaginationUrl = paginationButton.data('href');
    // Prop
    let paginationUrl = '';
    let lastestPostIndex = Number($($('.post-row')[$('.post-row').length - 1]).children('.index-col').text());
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
    paginationButton.on('click', e => {
        e.preventDefault();
        const self = $(e.currentTarget);
        // Clone text
        const cloneText = self.text();
        // Change text
        self.prop('disabled', true);
        self.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class= "sr-only">Loading...</span >');
        // Options
        if (typeof paginationUrl !== 'undefined') {
            const ajaxOptions = {
                type: 'GET',
                url: (paginationUrl.length) ? paginationUrl : originpaginationUrl,
                success: function (data) {
                    const doc = $(data);
                    const nextPosts = doc.find('.post-row');
                    nextPosts.each((index, item) => $(item).children('.index-col').text(++lastestPostIndex));
                    paginationUrl = doc.find('.post-pagination .btn').data('href');
                    // Show next post list
                    $('#posts tbody').append($(nextPosts).hide().fadeIn());
                    self.text(cloneText);
                    self.prop('disabled', false);
                },
                error: function (err) {
                    console.error(err);
                }
            }
            $.ajax(ajaxOptions);
        }else{
            self.text('Đã load hết')
        }
    });
    // Init
    tooltips.tooltip(tooltipOptions);
    animsition.animsition(animsitionOptions);
});