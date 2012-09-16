/*global $: false */
(function () {
    'use strict';
    var textbox, preview, output, format, getNameColour, toHTML, toBBCode, namecolours, coloursbox, nextcolour, icons, useTables;

    icons = {
        post: 'data:image/gif;base64,R0lGODlhFAAUAMQUAKex1Jqjxba5u8bKzb7FyYGIjOPr79Tb3293fVJdgba9waCt0aaxw7K/4q65y/r9/1hXV8vY/FxiZvT7/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABQALAAAAAAUABQAAAWLICWOZGmWkiRC0GlKwyBBANC6onRMkxxFgAROx+P5gDfU7vEoHm3KycPRdEp+UFEBIXXwqFbsrWBAVMFS4xVJIU8QBirTWzysGxAyQsFgTuhFAmsBeXsGfoA8gj+EOQRFiROLEQFCIxKPVYGDSZePRZKDli+foYydpKELlKgnEoIUEI04JCortLgnIQA7',
        steam: 'data:image/gif;base64,R0lGODlhEAAQAIQPAAYGBgoKChsbG1VVVVxcXG5ubnNzc3x8fIyMjJSUlKioqLa2tr6+vsnJydHR0f///////////////////////////////////////////////////////////////////yH5BAEKABAALAAAAAAQABAAAAVjIASM5CgIgzCKJTk0T9wELSnAQf40tfkEiodC8OgBBr9YktBz/ILDB7OFiC1ygUJxUCIqv8yYwcD4KhMqgFlQFrfMD2IjXQp+iUYAwUFYLAQOeXpxgAaCAAcNDQZ0LSyHABAhADs='
    };

    namecolours = {};
    nextcolour = 0;

    getNameColour = function (name) {
        var colours, namecolour;

        colours = coloursbox.value.split(',');
        if (namecolours.hasOwnProperty(name)) {
            namecolour = namecolours[name];
        } else {
            namecolour = (namecolours[name] = colours[nextcolour]);
            nextcolour += 1;
            if (nextcolour >= colours.length) {
                nextcolour = 0;
            }
        }

        return namecolour;
    };

    toHTML = function (parts, target) {
        var part, i, element, targetStack;

        target.innerHTML = '';
        targetStack = [];

        for (i = 0; i < parts.length; i += 1) {
            part = parts[i];

            if (part === 'TABLE_BEGIN') {
                element = document.createElement('table');
                target.appendChild(element);
                targetStack.push(target);
                target = element;
            } else if (part === 'ROW_BEGIN') {
                element = document.createElement('tr');
                target.appendChild(element);
                targetStack.push(target);
                target = element;
            } else if (part === 'CELL_BEGIN') {
                element = document.createElement('td');
                target.appendChild(element);
                targetStack.push(target);
                target = element;
            } else if (part === 'CELL_BEGIN_RALIGN') {
                element = document.createElement('td');
                element.style.textAlign = 'right';
                target.appendChild(element);
                targetStack.push(target);
                target = element;
            } else if (part === 'TABLE_END' || part === 'ROW_END' || part === 'CELL_END' || part === 'CELL_END_RALIGN') {
                target = targetStack.pop();
            } else {
                if (part.text === '\n') {
                    element = document.createElement('br');
                    target.appendChild(element);
                } else if (part.format === false) {
                    element = document.createTextNode(part.text);
                    target.appendChild(element);
                } else {
                    element = document.createElement('span');
                    if (part.format.colour !== false) {
                        element.style.color = part.format.colour;
                    }
                    if (part.format.bold === true) {
                        element.style.fontWeight = 'bold';
                    }
                    if (part.format.italic === true) {
                        element.style.fontStyle = 'italic';
                    }
                    element.innerText = part.text;
                    target.appendChild(element);
                }
            }
        }
    };

    toBBCode = function (parts) {
        var part, i, bbcode, begin, end;

        bbcode = '';

        for (i = 0; i < parts.length; i += 1) {
            part = parts[i];

            if (part === 'TABLE_BEGIN') {
                bbcode += '[table]\n';
            } else if (part === 'TABLE_END') {
                bbcode += '[/table]\n';
            } else if (part === 'ROW_BEGIN') {
                bbcode += '[tr]';
            } else if (part === 'ROW_END') {
                bbcode += '[/tr]\n';
            } else if (part === 'CELL_BEGIN') {
                bbcode += '[td]';
            } else if (part === 'CELL_BEGIN_RALIGN') {
                bbcode += '[td][right]';
            } else if (part === 'CELL_END') {
                bbcode += '[/td]';
            } else if (part === 'CELL_END_RALIGN') {
                bbcode += '[/right][/td]';
            } else {
                if (part.text === '\n') {
                    bbcode += '\n';
                } else if (part.format === false) {
                    bbcode += part.text;
                } else {
                    begin = end = '';
                    if (part.format.colour !== false) {
                        begin += '[color=' + part.format.colour + ']';
                        end = '[/color]' + end;
                    }
                    if (part.format.bold === true) {
                        begin += '[b]';
                        end = '[/b]' + end;
                    }
                    if (part.format.italic === true) {
                        begin += '[i]';
                        end = '[/i]' + end;
                    }
                    bbcode += begin + part.text + end;
                }
            }
        }

        return bbcode;
    };

    format = function (text, type, tables) {
        var parts, lines, i, pos, pos2, line, time, name, namecolour, message;

        lines = text.split('\n');
        parts = [];
        namecolours = {};
        nextcolour = 0;

        if (tables) {
            parts.push('TABLE_BEGIN');
        }
        for (i = 0; i < lines.length; i += 1) {
            line = lines[i];

            if (tables) {
                parts.push('ROW_BEGIN');
            }
            if (type === 'steam') {
                pos = line.indexOf(':');
                if (pos !== -1) {
                    name = line.slice(0, pos);
                    namecolour = getNameColour(name);
                    message = line.slice(pos);
                    if (tables) {
                        parts.push('CELL_BEGIN_RALIGN');
                    }
                    parts.push({ 'text': name, 'format': { 'colour': namecolour, 'bold': true, 'italic': false } });
                    if (tables) {
                        parts.push('CELL_END_RALIGN');
                    }
                    
                    if (tables) {
                        parts.push('CELL_BEGIN');
                    }
                    parts.push({ 'text': message, 'format': false });
                    if (tables) {
                        parts.push('CELL_END');
                    }
                    
                    if (!tables) {
                        parts.push({ 'text': '\n', 'format': false });
                    }
                } else {
                    if (tables) {
                        parts.push('CELL_BEGIN');
                    }
                    parts.push({ 'text': line, 'format': { 'colour': false, 'bold': false, 'italic': true } });
                    if (!tables) {
                        parts.push({ 'text': '\n', 'format': false });
                    }
                    if (tables) {
                        parts.push('CELL_END');
                    }
                }
            } else if (type === 'steam+timestamps') {
                pos = line.indexOf('-');
                if (pos !== -1) {
                    time = line.slice(0, pos + 1);
                    pos2 = line.indexOf(':', pos);
                    if (pos2 !== -1) {
                        name = line.slice(pos + 1, pos2);
                        message = line.slice(pos2);
                        namecolour = getNameColour(name);
                        
                        if (tables) {
                            parts.push('CELL_BEGIN');
                        }
                        parts.push({ 'text': time, 'format': { 'colour': false, 'bold': false, 'italic': false } });
                        if (tables) {
                            parts.push('CELL_END');
                        }
                        
                        if (tables) {
                            parts.push('CELL_BEGIN_RALIGN');
                        }
                        parts.push({ 'text': name, 'format': { 'colour': namecolour, 'bold': true, 'italic': false } });
                        if (tables) {
                            parts.push('CELL_END_RALIGN');
                        }
                        
                        if (tables) {
                            parts.push('CELL_BEGIN');
                        }
                        parts.push({ 'text': message, 'format': false });
                        if (tables) {
                            parts.push('CELL_END');
                        }
                        
                        if (!tables) {
                            parts.push({ 'text': '\n', 'format': false });
                        }
                    } else {
                        if (tables) {
                            parts.push('CELL_BEGIN');
                        }
                        parts.push({ 'text': line, 'format': { 'colour': false, 'bold': false, 'italic': false } });
                        if (tables) {
                            parts.push('CELL_END');
                        }
                        if (!tables) {
                            parts.push({ 'text': '\n', 'format': false });
                        }
                    }
                } else {
                    if (tables) {
                        parts.push('CELL_BEGIN');
                    }
                    parts.push({ 'text': line, 'format': { 'colour': false, 'bold': false, 'italic': true } });
                    if (tables) {
                        parts.push('CELL_END');
                    }
                    if (!tables) {
                        parts.push({ 'text': '\n', 'format': false });
                    }
                }
            }
            if (tables) {
                parts.push('ROW_END');
            }
        }
        if (tables) {
            parts.push('TABLE_END');
        }

        return parts;
    };

    window.onload = function () {
        var buttons, button;

        $('h1')
            .text('Chatlog colour-coder');

        $('span')
            .text('colour selection: ');

        coloursbox = $('input')
            .type('text')
            .value('red,orange,green,blue,indigo,purple,teal,olive,magenta,gray')
            .DOMElement;

        $('p')
            .text('This tool formats chat logs with colour codes for BBCode')
            .clear();

        textbox = $('textarea')
            .size('30%', 400)
            .display('block')
            .left()
            .DOMElement;

        preview = $('div')
            .borderBox()
            .size('30%', 400)
            .border(1, 'gray')
            .display('block')
            .left()
            .margin(4)
            .bg('rgb(236, 237, 243)', 'url(' + icons['post'] + ')', false)
            .style('backgroundPosition', '4px 4px')
            .style('backgroundAttachment', 'local')
            .pad(4)
            .style('paddingTop', '24px')
            .font('Verdana, sans-serif', '13px')
            .overflow('auto')
            .text('(preview will appear here)')
            .DOMElement;

        output = $('textarea')
            .size('30%', 400)
            .display('block')
            .left()
            .margin(4)
            .text('(bbcode will appear here)')
            .DOMElement;

        buttons = $('div')
            .clear();

        button = $('button', buttons)
            .display('block')
            .handle('click', function () {
                var parts;

                parts = format(textbox.value, 'steam', useTables.checked);

                toHTML(parts, preview);
                output.value = toBBCode(parts);
            });
        $('img', button)
            .src(icons['steam'])
            .alt('Steam')
            .valign('bottom');

        button = $('button', buttons)
            .display('block')
            .handle('click', function () {
                var parts;

                parts = format(textbox.value, 'steam+timestamps', useTables.checked);

                toHTML(parts, preview);
                output.value = toBBCode(parts);
            });
        $('img', button)
            .src(icons['steam'])
            .alt('Steam')
            .valign('bottom');
        $('span', button)
            .text(' + timestamps');
            
        useTables = $('input', buttons).DOMElement;
        useTables.type = 'checkbox';
        
        $('span', buttons)
            .text(' table formatted?');
    };
}());
