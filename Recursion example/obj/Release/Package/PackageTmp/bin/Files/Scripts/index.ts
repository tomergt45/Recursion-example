//- Define classes
class Person {
    constructor(name: string) {
        this.name = name;
        this.childrens = [];
    }

    /**
    * Name of the current person.
    */
    public name: string;
    /**
    * Childrens of the current person.
    */
    public childrens: Person[];
}

//- Define utility functions
function start() {
    //- Initialize styles
    initializeStyles();
}
function initializeStyles() {
}

//- Code text
function createCodeText(codeText: string) {
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

