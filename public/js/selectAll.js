const selectAllCheckBox = $('#selectAll');
let posts = selectAllCheckBox.parent().parent().parent().next().find('.form-check-input');
selectAllCheckBox.on('change', e => {
    e.preventDefault();
    const self = $(e.currentTarget);
    const checked = self.prop('checked');
    posts = selectAllCheckBox.parent().parent().parent().next().find('.form-check-input')
    posts.prop('checked', checked);
});