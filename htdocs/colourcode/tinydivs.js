// TinyDivs - a simple UI library
// https://github.com/TazeTSchnitzel/TinyDivs
// Copyright (c) 2012 Andrew Faulds

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
(function () {
    'use strict';
    var Element, addUnit;

    Element = function (domelement) {
        this.DOMElement = domelement;
    };

    addUnit = function (input, unit) {
        if (typeof input === 'number') {
            return input + unit;
        }
        return input;
    };

    Element.prototype.id = function (id) {
        this.DOMElement.id = id;
        return this;
    };
    Element.prototype.text = function (string) {
        //this.DOMElement.innerText = string;#
        this.DOMElement.innerHTML = '';
        this.DOMElement.appendChild(document.createTextNode(string));
        return this;
    };
    Element.prototype.html = function (string) {
        this.DOMElement.innerHTML = string;
        return this;
    };
    Element.prototype.type = function (string) {
        this.DOMElement.type = string;
        return this;
    };
    Element.prototype.value = function (string) {
        this.DOMElement.value = string;
        return this;
    };
    Element.prototype.src = function (string) {
        this.DOMElement.src = string;
        return this;
    };
    Element.prototype.title = function (string) {
        this.DOMElement.title = string;
        return this;
    };
    Element.prototype.alt = function (string) {
        this.DOMElement.alt = string;
        return this;
    };
    Element.prototype.valign = function (type) {
        this.DOMElement.style.verticalAlign = type;
        return this;
    };
    Element.prototype.size = function (width, height) {
        width = addUnit(width, 'px');
        this.DOMElement.style.width = width;
        if (height !== null) {
            height = addUnit(height, 'px');
            this.DOMElement.style.height = height;
        }
        return this;
    };
    Element.prototype.pos = function (type, x, y) {
        this.DOMElement.style.position = type;
        if (x !== null) {
            x = addUnit(x, 'px');
            this.DOMElement.style.left = x;
        }
        if (y !== null) {
            y = addUnit(y, 'px');
            this.DOMElement.style.top = y;
        }
        return this;
    };
    Element.prototype.borderBox = function () {
        this.DOMElement.style.boxSizing = 'border-box';
        return this;
    };
    Element.prototype.display = function (type) {
        this.DOMElement.style.display = type;
        return this;
    };
    Element.prototype.overflow = function (type) {
        this.DOMElement.style.overflow = type;
        return this;
    };
    Element.prototype.clear = function () {
        this.DOMElement.style.clear = 'both';
        return this;
    };
    Element.prototype.left = function () {
        this.DOMElement.style.float = 'left';
        return this;
    };
    Element.prototype.right = function () {
        this.DOMElement.style.float = 'right';
        return this;
    };
    Element.prototype.centre = function () {
        this.DOMElement.style.marginLeft = 'auto';
        this.DOMElement.style.marginRight = 'auto';
        return this;
    };
    Element.prototype.pad = function (amount) {
        amount = addUnit(amount, 'px');
        this.DOMElement.style.padding = amount;
        return this;
    };
    Element.prototype.margin = function (amount) {
        amount = addUnit(amount, 'px');
        this.DOMElement.style.margin = amount;
        return this;
    };
    Element.prototype.border = function (width, colour, type, radius) {
        width = width || '1px';
        width = addUnit(width, 'px');
        colour = colour || 'black';
        type = type || 'solid';
        this.DOMElement.style.border = width + ' ' + type + ' ' + colour;
        if (radius !== null) {
            radius = addUnit(radius, 'px');
            this.DOMElement.style.borderRadius = radius;
        }
        return this;
    };
    Element.prototype.sprite = function (file, x, y, width, height) {
        this.DOMElement.style.backgroundImage = 'url(' + file + ')';
        this.DOMElement.style.backgroundRepeat = 'no-repeat';
        this.DOMElement.style.backgroundPosition = '-' + addUnit(x, 'px') + ' -' + addUnit(y, 'px');
        this.DOMElement.style.width = addUnit(width, 'px');
        this.DOMElement.style.height = addUnit(height, 'px');
        return this;
    };
    Element.prototype.bg = function (colour, image, repeat) {
        this.DOMElement.style.backgroundColor = colour;
        if (image !== null) {
            this.DOMElement.style.backgroundImage = image;
            if (repeat === false) {
                this.DOMElement.style.backgroundRepeat = 'no-repeat';
            } else if (repeat === true) {
                this.DOMElement.style.backgroundRepeat = 'repeat';
            } else if (repeat === 'x') {
                this.DOMElement.style.backgroundRepeat = 'repeat-x';
            } else if (repeat === 'y') {
                this.DOMElement.style.backgroundRepeat = 'repeat-y';
            }
        }
        return this;
    };
    Element.prototype.font = function (name, size, weight) {
        this.DOMElement.style.fontFamily = name;
        if (size !== null) {
            size = addUnit(size, 'pt');
            this.DOMElement.style.fontSize = size;
            if (weight === false) {
                this.DOMElement.style.fontWeight = 'bold';
            } else if (weight === true) {
                this.DOMElement.style.fontWeight = 'normal';
            }
        }
        return this;
    };
    Element.prototype.overflow = function (type) {
        this.DOMElement.style.overflow = type;
        return this;
    };
    Element.prototype.style = function (name, value) {
        this.DOMElement.style[name] = value;
        return this;
    };
    Element.prototype.handle = function (name, func) {
        this.DOMElement['on' + name] = func;
        return this;
    };

    window.$ = function (tag, parent) {
        var element;

        parent = parent || document.body;
        if (parent.hasOwnProperty('DOMElement')) {
            parent = parent.DOMElement;
        }
        tag = tag || 'div';

        element = new Element(document.createElement(tag));
        parent.appendChild(element.DOMElement);
        return element;
    };
}());
