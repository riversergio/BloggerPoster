
const myCodeMirror = CodeMirror.fromTextArea($('#app-content-code')[0], {
    lineNumbers: true,
    mode: 'htmlmixed',
    scrollbarStyle: 'overlay',
    screenReaderLabel: 'Code bài viết'
});
const appContent = $('.app-content-editor');
// Show code and show content
const showCodeBtn = $('#showCode');
const showContentBtn = $('#showContent');
const appEditor = $('.app-editor');

function formatCode(content) {
    myCodeMirror.setValue(content);
    const totalLines = myCodeMirror.lineCount();
    const totalChars = myCodeMirror.getTextArea().value.length;
    // Format
    myCodeMirror.autoFormatRange({ line: 0, ch: 0 }, { line: totalLines, ch: totalChars });
    myCodeMirror.setValue(myCodeMirror.getValue());
    myCodeMirror.refresh();
}

appContent.on('change', e => {
    const content = appContent.html();
    formatCode(content);
});

showCodeBtn.on('click', e => {
    e.preventDefault();
    const self = $(e.currentTarget);
    const content = appContent.html();
    showContentBtn.removeClass('active');
    self.addClass('active');
    appEditor.removeClass('content-mode').addClass('code-mode');
    // Format code
    formatCode(content);
    return false;
});

showContentBtn.on('click', e => {
    e.preventDefault();
    const self = $(e.currentTarget);
    const code = myCodeMirror.getValue();
    showCodeBtn.removeClass('active');
    self.addClass('active');
    appContent.html(code);
    appEditor.removeClass('code-mode').addClass('content-mode');
    return false;
});