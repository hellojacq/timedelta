function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
}

function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else if (!hasClass(el, className)) {
        el.className += " " + className;
    }
}

function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className=el.className.replace(reg, ' ');
    }
}

function updateDependencies(inputMoment) {
    if (inputMoment) {
        deltaElement.innerText = inputMoment.toString();
        isoElement.innerText = inputMoment.toString();
        localElement.innerText = inputMoment.toString();
        epochElement.innerText = inputMoment.unix();
    }
}

function inputUpdateHandler(event) {
    /* moment is imported as a global */
    removeClass(queryElement, "valid-input");
    removeClass(queryElement, "invalid-input");
    removeClass(queryElement, "no-input");

    var input = event.target.value;
    if (input) {
        var currentMoment = moment(event.target.value);
        if (currentMoment.isValid()) {
            addClass(queryElement, "valid-input");
            updateDependencies(currentMoment);
        } else {
            addClass(queryElement, "invalid-input");
        }
    } else {
        addClass(queryElement, "no-input");
    }
}

var queryElement = document.getElementById('js-query');
queryElement.oninput = inputUpdateHandler;
queryElement.onpropertychange = queryElement.oninput;

var deltaElement = document.getElementById('js-delta');
var isoElement = document.getElementById('js-utc');
var epochElement = document.getElementById('js-epoch');
var localElement = document.getElementById('js-local');

/* begin by running the inputUpdateHandler on the input to ensure
 * any styles that we might want to apply are applied */
inputUpdateHandler({target: queryElement});
