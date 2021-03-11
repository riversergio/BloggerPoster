
const selectedPosts = [];

const selectAllCheckBox = $('#selectAll');
const controller = $('.post-controller');
const controllerState = () => {
    if (selectedPosts.length)
        controller.addClass('active');
    else
        controller.removeClass('active');
    controller.find('.num').text(selectedPosts.length)
}
const isDuplicate = (arr,value) => {
    for(let i = 0; i<arr.length ; i++)
        if(arr[i]===value)
            return true;
    return false;
}
const postsOnCheck = e => {
    e.preventDefault();
    const self = $(e.currentTarget);
    const isChecked = self.prop('checked');
    const postId = self.data('postid');
    if (isChecked && !isDuplicate(selectedPosts,postId))
        selectedPosts.push(postId);
    else{
        selectedPosts.splice(selectedPosts.indexOf(postId),1);
        selectAllCheckBox.prop('checked',false);
    }
    controllerState()
}
let posts = selectAllCheckBox.parent().parent().parent().next().find('.form-check-input');

posts.each((i,post) => $(post).on('change',postsOnCheck));

selectAllCheckBox.on('change', e => {
    e.preventDefault();
    const self = $(e.currentTarget);
    const isChecked = self.prop('checked');
    if (isChecked)
        posts.each((i,post) => {
            if(!$(post).prop('checked'))
                $(post).click();
        });
    else
        posts.each((i, post) => {
            if ($(post).prop('checked'))
                $(post).click();
        });
});