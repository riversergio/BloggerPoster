// Forms
let leeching = false;
const leechForm = $('#leechForm');
const createForm = $('#appCreateForm');
// Input
const imageUrlInput = createForm.find('.file-url input');
const imagePreview = createForm.find('.image-preview');
// Elems
const quickInfoElem = $('.quick-info');
const appDetailElem = $('.app-detail>.detail');
const appImages = $('.app-detail>.images');
const appDownload = $('.app-detail>.downloads');
const inputs = createForm.find('.form-control[id],.form-check-input[id]');
const downloadPreview = $('#download-preview');
const addDownloadBtn = $('#addDownload');
// functions
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
// Events and loops
inputs.each((index, input) => {
    console.log(input.checked);
    $(input).bind('keyup change', e => {
        const inputTarget = $(e.currentTarget.dataset.target).find('.value');
        const inputId = e.currentTarget.id;
        const inputValue = $(e.currentTarget).val();
        // Others
        if (e.currentTarget.tagName === "TEXTAREA")
            inputTarget.html(inputValue.replace(/\n/g, '<br/>'));
        else if (e.currentTarget.type === "checkbox")
            inputTarget.html(e.currentTarget.checked ? "YES" : "NO");
        else
            inputTarget.html(inputId === "CHPlayUrl" ? "<a href='" + inputValue + "' target='_blank'>Download on CHPlay</a>" : inputValue);
    });
});
addDownloadBtn.on('click', e => {
    const buttonId = generateUniqueId();
    const completeBtn = $(`
        <button type='button' class="btn btn-success" data-id='${buttonId}'>
            <i class="fas fa-check"></i>
        </button>
    `);
    const cancelBtn = $(`
        <button type='button' class="btn btn-danger" data-id='${buttonId}'>
            <i class="fas fa-times"></i>
        </button>
    `);
    const newRow = $(`
        <tr class='button-row editing' data-id='${buttonId}'>
            <th scope='row'>${buttonId}</th>
            <td class='btn-title'>
                <p contenteditable='true'></p>
            </td>
            <td class='btn-url'>
                <p contenteditable='true'></p>
            </td>
            <td class='action'></td>
        </tr>
    `);
    completeBtn.on('click', e => {
        e.preventDefault();
        const currentId = e.currentTarget.dataset.id;
        const currentRow = downloadPreview.find(`.button-row[data-id="${currentId}"]`);
        const currentActions = currentRow.find('.action');
        const currentTitle = currentRow.find('.btn-title p').text();
        const currentUrl = currentRow.find('.btn-url p').text();
        const urlMatch = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.exec(currentUrl);
        if (!currentTitle.length || !currentUrl.length || !urlMatch) {
            alert("Vui lòng ko bỏ trống và nhập link hợp lệ");
            return;
        }
        // Create new button
        const editButton = $(`<button type='buttom' class="btn btn-warning" data-id='${currentId}'>
            <i class="fas fa-pencil-alt"></i>
        </button>`);
        editButton.on('click', e => {
            $(e.currentTarget).remove();
            currentRow.addClass('editing');
            currentRow.find('p').attr('contenteditable', true);
            currentActions.find('.btn-success').removeClass('d-none');
        });
        currentActions.find('.btn-success').addClass('d-none');
        currentActions.prepend(editButton);
        // Remove edit state
        currentRow.removeClass('editing');
        currentRow.find('p').removeAttr('contenteditable');
        // Complete
        if (!appDownload.find(`.btn-download[data-id="${currentId}"]`).length)
            appDownload.append(`<a data-id="${currentId}" class='btn mb-2 btn-primary btn-download btn-block' data-href="${btoa(currentUrl)}" href='javasript:void(0)'>${currentTitle}</a>`);
        else
            appDownload.find(`.btn-download[data-id="${currentId}"]`).attr('data-href', btoa(currentUrl)).text(currentTitle);
        formatCode(appDetailElem.parent().parent().html());
    })
    cancelBtn.on('click', e => downloadPreview.find('.button-row[data-id="' + e.currentTarget.dataset.id + '"]').remove())
    newRow.find('.action').append(completeBtn).append(cancelBtn);
    downloadPreview.append(newRow);
    formatCode(appDetailElem.parent().parent().html());
});
// Functions
function previewImage(imageUrl) {
    const imageElem = $('<img class="img-thumbnail" src="' + imageUrl + '"/>');
    imagePreview.html(imageElem.hide().fadeIn());
    imageUrlInput.val(imageUrl);
    imageUrlInput.hasClass('mt-2') && imageUrlInput.addClass('mt-2');
    $('.hidden-thumbnail').attr('src', imageUrl);
}
function getFormData(form) {
    const unindexed_array = form.serializeArray();
    const indexed_array = {};
    $.map(unindexed_array, (n, i) => {
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}
function replaceImageApp(imageUrl) {
    const imgSv = ['1.bp.blogspot.com', '4.bp.blogspot.com', '3.bp.blogspot.com', '4.bp.blogspot.com'];
    return imageUrl.replace('play-lh.googleusercontent.com', imgSv[Math.floor(Math.random() * imgSv.length)]);
}
function fillLeechInput(data) {
    // Fill input 
    inputs.each((index, input) => {
        const inputId = input.id;
        switch (inputId) {
            case "appTitle":
                $(input).val(data.title).change();
                break;
            case "appDeveloper":
                $(input).val(data.developer).change();
                break;
            case "appGenre":
                $(input).val(data.genre).change();
                break;
            case "appVersion":
                $(input).val(data.version).change();
                break;
            case "appSize":
                $(input).val(data.size).change();
                break;
            case "CHPlayUrl":
                $(input).val(data.url).change();
                break;
        }
    });
    appImages.html('');
    $(data.screenshots).each((i, img) => {
        const imgUrl = replaceImageApp(img);
        appImages.append(`
            <div class="images-item d-inline-block">
                <img src="${imgUrl}" alt="Ảnh-${i + 1}">
            </div>
        `);
    });
    appDetailElem.html(data.descriptionHTML);
    formatCode(appDetailElem.parent().parent().html());
}
leechForm.on('submit', e => {
    e.preventDefault();
    const form = $(e.currentTarget);
    const formData = getFormData(form);
    const ajaxOptions = {
        type: form.attr('method'),
        url: form.attr('action'),
        data: formData
    }
    if (!leeching)
        $.ajax(ajaxOptions).done(data => {
            // Preview
            console.log(data);
            previewImage(replaceImageApp(data.icon));
            fillLeechInput(data);
            leeching = false;
        });
    leeching = true;
    return false;
});

createForm.on('submit', e => {
    e.preventDefault();
    const form = $(e.currentTarget);
    const formData = getFormData(form);
    const requestUrl = window.location.href + '/execute';
    const sure = confirm('Bạn có chắc muốn đăng bài viết này chứ ? Kiểm tra kĩ chưa ?');
    if (sure)
        $.ajax({
            type: "post",
            url: requestUrl,
            data: {
                title: formData.appName,
                content: formData.appCode,
                labels: formData['hidden-appTags'].split(',')
            },
            success: (data) => {
                alert("Đã đăng thành công");
            },
            error: (err) => alert("Có lỗi xảy ra")
        })
    return false;
});