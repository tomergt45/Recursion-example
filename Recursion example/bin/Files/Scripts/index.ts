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
    $('.code-template').each((i, e) => $(e).replaceWith(createCodeText($(e).text())));

    //- Insert content info dialog button
    $('.stage-content-info').each((i, e) => {
        //- Create local variables
        var parentTarget = $(e).parent()

        //- Set classes
        $(e).addClass('stage').wrapInner($.div('stage-content'))

        //- Clone title
        $(e).siblings('.stage-title').clone(true).prependTo(e)

        //- Create icon element
        var icon1 = $.icon('fal fa-plus fa-fw', 'stage-dialog-button').click(ev => {
            //- Hide stages 
            $('.stages').children().css('display', 'none')

            //- Set info active
            $(e).appendTo('.stages')
        }).attr({ shadow: 1, float: '1-2-3' })
        var icon2 = $.icon('fal fa-minus fa-fw', 'stage-dialog-button').click(ev => {
            //- Set classes
            $(e).addClass('hide').finishCss(ev => {
                //- Remove hide class
                $(ev.currentTarget).removeClass('hide')

                //- Hide stages
                $('.stages').children().css('display', '')

                //- Set info active
                $(e).appendTo(parentTarget)
            })
        }).attr({ shadow: 1, float: '1-2-3' })

        //- Append icon
        icon1.appendTo($(e).siblings('.stage-title'))
        icon2.appendTo($(e).children('.stage-title'))
    })

    //- Insert stage title icon
    $('.stage-title[icon]').each((i, e) => $.icon('fas fa-' + $(e).attr('icon') + ' fa-fw', 'stage-title-icon').prependTo(e))
}

//- Family tree visualization
function initializeVisualization() {
    //- Create local variables
    var lastStage = $('.stages > .stage:last');

    //- Set default CSS
    lastStage.css({
        maxWidth: $('html').width(),
        minWidth: lastStage.width(),
        width: lastStage.width()
    })

    //- Initialize srcoll animation
    $('html').scrollProgress(lastStage, (ev, diff, pos) => {
        //- Set last stage css
        lastStage.css({
            width: pos + "%",
        })
        lastStage.siblings().css({
            opacity: '+=' + (-diff / pos)
        })

        console.log(pos, diff)
    })
}

//- Code text
function createCodeText(codeText: string) {
    //- Create local variables
    var codeElement = $.div('code-container').attr({
        'shadow': '1'
    });

    //- Parse code lines
    var codeLines = codeText.split('\n').map(i => {
        //- Create local variables
        var line = i.trim().replaceAll('\\n', '<br>')
        var tabs = line.matches(/\\T(\d+)/g)[0];

        //- Check if any tabs specified
        if (tabs && tabs.length > 1) {
            //- Create local variables
            var tabstext = "";

            for (var a = 0; a < parseInt(tabs[1]); a++)
                tabstext += "<div style='opacity: .2;user-select:none'>&middot;&middot;&middot;&middot; </div>"; //- &emsp;&emsp;&emsp;&emsp;

            //- Replace line
            line = line.replace(/\\T(\d+)/g, tabstext)
        }

        //- Return line
        return line;
    })

    //- Iterate through the code lines
    codeLines.filter(i => i.trim() != '').forEach((line, i) => {
        //- Create line element
        var codeLineElement = $.div('code-line');

        //- Create line index
        var lineIndex = $.div('code-line-index', i + 1)

        //- Create line code
        var lineText = $.elem('pre', 'code-line-text', line)

        //- Append line element
        codeLineElement.append([lineIndex, lineText]).appendTo(codeElement)
    })

    //- Append copy button
    //$.div('code-container-bottom-text', 'Click anywhere to copy').appendTo(codeElement)

    //- Set events
    codeElement.click(ev => {
        //- Parse code lines
        var codeLines = codeText.split('\n').map(i => {
            //- Create local variables
            var line = i.trim().replaceAll('\\n', '<br>')
            var tabs = line.matches(/\\T(\d+)/g)[0];

            //- Check if any tabs specified
            if (tabs && tabs.length > 1) {
                //- Create local variables
                var tabstext = "";

                for (var a = 0; a < parseInt(tabs[1]); a++)
                    tabstext += "    ";

                //- Replace line
                line = line.replace(/\\T(\d+)/g, tabstext)
            }

            //- Return line
            return line;
        })

        //- Copy to clipboard
        Clipboard.copy(codeLines.join('\r\n'))

        //- Show snackbar
        $.snackbar('Code copied to clipboard')
    })

    //- Set ripple effect
    if (isMobile)
        codeElement.ripple('rgba(0,0,0,.3)', null, null, false)
    else
        codeElement.ripple('rgba(0,0,0,.3)', null, null, true)

    //- Return code element
    return codeElement;
}