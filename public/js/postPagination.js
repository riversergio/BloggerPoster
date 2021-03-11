const paginationButton = $('.post-pagination .btn');
const originpaginationUrl = paginationButton.data('href');
// Prop
let paginationUrl = '';
let lastestPostIndex = Number($($('.post-row')[$('.post-row').length - 1]).children('.index-col').text());
// Init
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
    } else {
        self.text('Đã load hết')
    }
});
