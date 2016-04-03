function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    }
    else {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
}
function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    }
    else if (!hasClass(el, className)) {
        el.className += " " + className;
    }
}
function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    }
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}
function updateDependencies(timeInfo) {
    deltaElement.innerText = timeInfo.delta;
    utcElement.innerText = timeInfo.utc;
    localElement.innerText = timeInfo.local;
    epochElement.innerText = timeInfo.unix.toString();
    errorElement.innerText = "";
}
function inputUpdateHandler(event) {
    /* moment is imported as a global */
    removeClass(queryElement, "valid-input");
    removeClass(queryElement, "invalid-input");
    removeClass(queryElement, "no-input");
    var input = event.target.value;
    if (input) {
        var timeInfoResult = getTimeInfo(input);
        if (timeInfoResult.isValid) {
            addClass(queryElement, "valid-input");
            updateDependencies(timeInfoResult.timeInfo);
        }
        else {
            addClass(queryElement, "invalid-input");
            if (timeInfoResult.error) {
                errorElement.innerText = timeInfoResult.error;
            }
        }
    }
    else {
        addClass(queryElement, "no-input");
        errorElement.innerText = "No input";
    }
}
var TimeInfoResult = (function () {
    function TimeInfoResult() {
    }
    return TimeInfoResult;
}());
function getTimeInfo(rawInput) {
    var momentInput = null;
    var relativeTime = "";
    var matches;
    rawInput = rawInput.trim();
    if (!rawInput) {
        return {
            isValid: false,
            error: "Missing input",
            timeInfo: null
        };
    }
    else {
        if (rawInput === "now" || rawInput === "today") {
            momentInput = moment();
            relativeTime = "now";
        }
        else if (rawInput.match(/^\d+$/)) {
            if (rawInput.length >= 13) {
                momentInput = moment(rawInput, "x");
            }
            else {
                momentInput = moment(rawInput, "X");
            }
        }
        else if (matches = rawInput.match(/\s*(-?\.?\d+(\.\d*)?)\s*ye?a?r?.* ago/i)) {
            momentInput = moment(Number(new Date()) - Number(matches[1]) * 365 * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(in\s+)?(-?\.?\d+(\.\d*)?)\s*ye?a?r?.*/i)) {
            momentInput = moment(Number(new Date()) + Number(matches[2]) * 365 * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(-?\.?\d+(\.\d*)?)\s*mon?t?h?.* ago/i)) {
            momentInput = moment(Number(new Date()) - Number(matches[1]) * 30 * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(in\s+)?(-?\.?\d+(\.\d*)?)\s*mon?t?h?.*/i)) {
            momentInput = moment(Number(new Date()) + Number(matches[2]) * 30 * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(-?\.?\d+(\.\d*)?)\s*we?e?k?.* ago/i)) {
            momentInput = moment(Number(new Date()) - Number(matches[1]) * 7 * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(in\s+)?(-?\.?\d+(\.\d*)?)\s*we?e?k?.*/i)) {
            momentInput = moment(Number(new Date()) + Number(matches[2]) * 7 * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(-?\.?\d+(\.\d*)?)\s*da?y?.* ago/i)) {
            momentInput = moment(Number(new Date()) - Number(matches[1]) * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(in\s+)?(-?\.?\d+(\.\d*)?)\s*da?y?.*/i)) {
            momentInput = moment(Number(new Date()) + Number(matches[2]) * 24 * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(-?\.?\d+(\.\d*)?)\s*ho?u?r?.* ago/i)) {
            momentInput = moment(Number(new Date()) - Number(matches[1]) * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(in\s+)?(-?\.?\d+(\.\d*)?)\s*ho?u?r?.*/i)) {
            momentInput = moment(Number(new Date()) + Number(matches[2]) * 60 * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(-?\.?\d+(\.\d*)?)\s*mi?n?.* ago/i)) {
            momentInput = moment(Number(new Date()) - Number(matches[1]) * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(in\s+)?(-?\.?\d+(\.\d*)?)\s*mi?n?.*/i)) {
            momentInput = moment(Number(new Date()) + Number(matches[2]) * 60 * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(-?\.?\d+(\.\d*)?)\s*se?c?.* ago/i)) {
            momentInput = moment(Number(new Date()) - Number(matches[1]) * 1000, "x");
        }
        else if (matches = rawInput.match(/\s*(in\s+)?(-?\.?\d+(\.\d*)?)\s*se?c?.*/i)) {
            momentInput = moment(Number(new Date()) + Number(matches[2]) * 1000, "x");
        }
        else if (rawInput.match(/^\d+\.\d*$/)) {
            momentInput = moment(rawInput, "X");
        }
        if (!momentInput) {
            momentInput = moment(rawInput);
        }
        if (momentInput.isValid()) {
            var delta;
            if (relativeTime) {
                delta = relativeTime;
            }
            else {
                delta = momentInput.fromNow();
            }
            return {
                isValid: true,
                timeInfo: {
                    utc: momentInput.toDate().toUTCString(),
                    unix: momentInput.unix(),
                    delta: delta,
                    local: momentInput.toDate().toString()
                },
                error: null
            };
        }
        else {
            return {
                isValid: false,
                error: "Unable to parse input",
                timeInfo: null
            };
        }
    }
}
var queryElement = document.getElementById('js-query');
queryElement.oninput = inputUpdateHandler;
var deltaElement = document.getElementById('js-delta');
var utcElement = document.getElementById('js-utc');
var epochElement = document.getElementById('js-epoch');
var localElement = document.getElementById('js-local');
var errorElement = document.getElementById('js-error');
/* begin by running the inputUpdateHandler on the input to ensure
 * any styles that we might want to apply are applied */
inputUpdateHandler({ target: queryElement });
