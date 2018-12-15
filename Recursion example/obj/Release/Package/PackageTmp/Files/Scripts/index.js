//- Define classes
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
        this.childrens = [];
    }
    return Person;
}());
//- Define utility functions
function start() {
    //- Initialize styles
    initializeStyles();
}
function initializeStyles() {
}
//- Code text
function createCodeText(codeText) {
    //- Create element
    var codeElement = $.div('text-code');
    //- Set element text
    codeElement.text(codeText);
    //- Return code element
    return codeElement;
}
//- Dialog
function showDialog(content) {
    //- Create element
    var dialog = $.div('dialog-element');
    //- Return dialog element
    return dialog;
}
function closeDialog() {
    //- Remove dialog element
    $('.dialog-element').remove();
}
//# sourceMappingURL=index.js.map