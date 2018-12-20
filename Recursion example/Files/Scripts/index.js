//- Define classes
var Person = /** @class */ (function () {
    function Person(index, parent) {
        if (parent === void 0) { parent = null; }
        var _this = this;
        //- Set local variables
        this.element = $('.visual-cell:eq(' + index + ')');
        this.name = this.element.text();
        this.parent = parent;
        this.childrens = $('.visual-cell[tree-parent="' + index + '"]').get().map(function (e) { return new Person($(e).index('.visual-cell'), _this); });
        this.index = index;
        //- Set element data
        this.element.data('person', this);
    }
    /**
    * Retrives the current person hierarchy path
    */
    Person.prototype.onParents = function (handler) {
        //- Call handler on current person
        handler(this);
        //- Check if parent is not null
        if (this.parent != null)
            this.parent.onParents(handler);
    };
    return Person;
}());
//- Create global variables
var tree, current, targetName = "Trump";
//- Define functions
function start() {
    //- Initialize
    initialize();
    //- Initialize visualization
    initializeVisualization();
}
function initialize() {
    //- Set 0 scroll
    $('html').get(0).scrollTop = 0;
    //- Replace code templates with code text
    $('.code-template').each(function (i, e) { return $(e).replaceWith(createCodeText($(e).text())); });
    //- Replace input templates
    $('.input-template').each(function (i, e) {
        //- Create local variables
        var input = $('<div class="user-input"></div>').append($.textinput($(e).attr('title'))).find('input').change(function (ev) {
            //- Create local variables
            var text = $(ev.currentTarget).val();
            text = parseInt(text);
            //- Define utility functions
            function fibonacci(index) {
                var x1 = 1, x2 = 0, x = 0;
                for (var i = 0; i < index; i++) {
                    x = x1 + x2;
                    x1 = x2;
                    x2 = x;
                }
                return x;
            }
            //- Check if text is bigger then 0
            if (text >= 0)
                $('.input-text').text(fibonacci(text));
            else
                $('.input-text').text('...');
        }).attr('type', 'number').end();
        //- Replace input with element
        $(e).replaceWith(input);
    });
    //- Insert content info dialog button
    $('.stage-content-info').each(function (i, e) {
        //- Create local variables
        var parentTarget = $(e).parent(), offsetTop = 0;
        //- Set classes
        $(e).addClass('stage').wrapInner($.div('stage-content'));
        //- Clone title
        $(e).siblings('.stage-title').clone(true).prependTo(e);
        //- Create icon element
        var icon1 = $.icon('fal fa-plus fa-fw', 'stage-dialog-button').click(function (ev) {
            //- Set offset top
            offsetTop = $('html').get(0).scrollTop;
            //- Hide stages 
            $('.stages').children().css('display', 'none');
            //- Set info active
            $(e).appendTo('.stages');
            $('html').get(0).scrollTop = 0;
        }).attr({ shadow: 1, float: '1-2-3' });
        var icon2 = $.icon('fal fa-minus fa-fw', 'stage-dialog-button').click(function (ev) {
            //- Set classes
            $(e).addClass('hide').finishCss(function (ev) {
                //- Remove hide class
                $(ev.currentTarget).removeClass('hide').finishCss(function (ev) {
                    //- Scroll into target
                    $('html').get(0).scrollTop = offsetTop;
                });
                //- Hide stages
                $('.stages').children().css('display', '');
                //- Set info active
                $(e).appendTo(parentTarget);
            });
        }).attr({ shadow: 1, float: '1-2-3' });
        //- Append icon
        icon1.appendTo($(e).siblings('.stage-title'));
        icon2.appendTo($(e).children('.stage-title'));
    });
    //- Insert stage title icon
    $('.stage-title[icon]').each(function (i, e) { return $.icon('fas fa-' + $(e).attr('icon') + ' fa-fw', 'stage-title-icon').prependTo(e); });
    //- Insert step icons
    $('.step-button').each(function (i, e) {
        //- Set icon
        $.icon('fas fa-' + $(e).attr('icon') + ' fa-fw').appendTo(e);
        //- Set icon attributes
        $(e).attr({
            shadow: '1',
            float: '1-2-3'
        });
    });
    //- Iterate through each cell
    $('.visual-cell').each(function (i, e) {
        var text = $(e).text();
        $(e).text('');
        $.icon('fas fa-child fa-fw', 'visual-cell-icon').appendTo(e);
        $.div('visual-cell-text', text).appendTo(e);
    });
}
//- Family tree visualization
function initializeVisualization() {
    //- Create local variables
    var lastStage = $('.stages > .stage:last');
    //- Set default CSS
    lastStage.css({
        width: $('html').width(),
    });
    //- Initialize srcoll animation
    $('html').scrollProgress(lastStage, function (ev, diff, pos) {
        lastStage.css({
            width: $('html').width(),
        });
        //- Set last stage css
        //lastStage.css({ width: pos + "%", })
        //lastStage.siblings().css({ opacity: '+=' + -(diff / 70) })
    });
    //- Set events
    $('.next-step-button').click(nextStep);
    $('.prev-step-button').click(prevStep);
    //- Create family tree
    tree = current = new Person(0);
    //- Set next step
    nextStep();
}
function nextStep() {
    //- Create local variables
    var currentStep = $('.visual-cell.active');
    //- Find next cell
    if (currentStep.length == 0) {
        //- Get next step
        var nextStep = $('.visual-cell:eq(0)').addClass('active');
        //- Verbose step
        verboseStep(nextStep.data('person'));
    }
    else if (currentStep.is('.target')) {
        return;
    }
    else {
        //- Get next step element
        var nextStep = $('.visual-cell[cell-index="' + (parseInt(currentStep.attr('cell-index')) + 1) + '"]');
        //- Check if has next step
        if (nextStep.length > 0) {
            //- Remove current step class
            currentStep.removeClass('active');
            //- Add current step class
            nextStep.addClass('active');
            //- Verbose step
            verboseStep(nextStep.data('person'));
        }
    }
    //- Check if new step is target
    if (nextStep.text() == targetName)
        nextStep.addClass('target');
}
function prevStep() {
    //- Create local variables
    var currentStep = $('.visual-cell.active');
    //- Check if current step is target
    if (currentStep.is('.target'))
        currentStep.removeClass('target');
    //- Find next cell
    if (currentStep.length == 0)
        $('.visual-cell:eq(0)').addClass('active');
    else {
        //- Get next step element
        var nextStep = $('.visual-cell[cell-index="' + (parseInt(currentStep.attr('cell-index')) - 1) + '"]');
        //- Check if has next step
        if (nextStep.length > 0) {
            //- Remove current step class
            currentStep.removeClass('active');
            //- Add current step class
            nextStep.addClass('active');
            //- Remove last verbose step
            $('.verbose-step:last').remove();
        }
    }
}
function verboseStep(child) {
    //- Create local variables
    var parents = [];
    child.onParents(function (p) { return parents.push(p.name); });
    parents.reverse();
    //- Create step element
    var step = $.div('verbose-step').attr({
        shadow: 1
    });
    //- Create step heirarchy path
    var path = $.div('verbose-step-path');
    parents.forEach(function (v, i) {
        //- Append parent name
        path.append(v);
        //- Append arrow right
        if (parents.length - 1 > i)
            path.append($.icon('fa fa-angle-right fa-fw', 'verbose-step-path-arrow'));
    });
    //- Create step text
    var text = $.div('verbose-step-text');
    if (child.name != targetName)
        text.append([
            $.div('', child.name).css({ display: 'inline-block', color: '#F44336' }),
            ' is not "' + targetName + '"'
        ]);
    else
        text.append([
            $.div('', child.name).css({ display: 'inline-block', color: '#00c5ae' }),
            ' is "' + targetName + '"!'
        ]);
    //- append step element
    step.append([path, text]).appendTo('.verbose-steps');
    if (child.parent != null)
        step.get(0).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
}
//- Code text
function createCodeText(codeText) {
    //- Create local variables
    var codeElement = $.div('code-container').attr({
        'shadow': '1'
    });
    //- Parse code lines
    var codeLines = codeText.split('\n').map(function (i) {
        //- Create local variables
        var line = i.trim().replaceAll('\\n', '<br>');
        var tabs = line.matches(/\\T(\d+)/g)[0];
        //- Check if any tabs specified
        if (tabs && tabs.length > 1) {
            //- Create local variables
            var tabstext = "";
            for (var a = 0; a < parseInt(tabs[1]); a++)
                tabstext += "<div style='opacity: .2;user-select:none'>&middot;&middot;&middot;&middot; </div>"; //- &emsp;&emsp;&emsp;&emsp;
            //- Replace line
            line = line.replace(/\\T(\d+)/g, tabstext);
        }
        //- Return line
        return line;
    });
    //- Iterate through the code lines
    codeLines.filter(function (i) { return i.trim() != ''; }).forEach(function (line, i) {
        //- Create line element
        var codeLineElement = $.div('code-line');
        //- Create line index
        var lineIndex = $.div('code-line-index', i + 1);
        //- Create line code
        var lineText = $.elem('pre', 'code-line-text', line);
        //- Append line element
        codeLineElement.append([lineIndex, lineText]).appendTo(codeElement);
    });
    //- Append copy button
    //$.div('code-container-bottom-text', 'Click anywhere to copy').appendTo(codeElement)
    //- Set events
    codeElement.click(function (ev) {
        //- Parse code lines
        var codeLines = codeText.split('\n').map(function (i) {
            //- Create local variables
            var line = i.trim().replaceAll('\\n', '#');
            var tabs = line.matches(/\\T(\d+)/g)[0];
            //- Check if any tabs specified
            if (tabs && tabs.length > 1) {
                //- Create local variables
                var tabstext = "";
                for (var a = 0; a < parseInt(tabs[1]); a++)
                    tabstext += "    ";
                //- Replace line
                line = line.replace(/\\T(\d+)/g, tabstext);
            }
            //- Return line
            return line;
        });
        //- Copy to clipboard
        Clipboard.copy(codeLines.join('\r\n'));
        //- Show snackbar
        $.snackbar('Code copied to clipboard');
    });
    //- Set ripple effect
    if (isMobile)
        codeElement.ripple('rgba(0,0,0,.3)', null, null, false);
    else
        codeElement.ripple('rgba(0,0,0,.3)', null, null, true);
    //- Return code element
    return codeElement;
}
//# sourceMappingURL=index.js.map