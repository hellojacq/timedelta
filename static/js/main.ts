declare var moment: any;

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

function updateDependencies(timeInfo) {
    deltaElement.innerText = timeInfo.delta;
    utcElement.innerText = timeInfo.utc;
    localElement.innerText = timeInfo.local;
    epochElement.innerText = timeInfo.unix;
    errorElement.innerText = "";
}

function inputUpdateHandler(event) {
    /* moment is imported as a global */
    removeClass(queryElement, "valid-input");
    removeClass(queryElement, "invalid-input");
    removeClass(queryElement, "no-input");

    var input = event.target.value;
    if (input) {
        var timeInfo = getTimeInfo(input);

        if (timeInfo.isValid) {
            addClass(queryElement, "valid-input");
            updateDependencies(timeInfo);
        } else {
            addClass(queryElement, "invalid-input");
            if (timeInfo.error) {
                errorElement.innerText = timeInfo.error;
            }
        }
    } else {
        addClass(queryElement, "no-input");
        errorElement.innerText = "No input";
    }
}

interface TimeInfo {
	utc: string;
	unix: number;
	delta: string;
	local: string;
}

class TimeInfoResult {
	isValid: boolean;
	timeInfo: TimeInfo;
	error: string;
}

function getTimeInfo(rawInput) : TimeInfoResult {
    var momentInput = null;
    var relativeTime = "";

    rawInput = rawInput.trim();
    if (!rawInput) {
        return {
            isValid: false,
            error: "Missing input",
			timeInfo: null,
        }
    } else {
        if (rawInput === "now" || rawInput === "today") {
            momentInput = moment();
            relativeTime = "now";
        } else if (rawInput.match(/^\d+$/)) {
            if (rawInput.length == 13) {
                momentInput = moment(rawInput, "x");
            } else if (rawInput.length === 10) {
                momentInput = moment(rawInput, "X");
            }
        } else if (rawInput.match(/^\d+\.\d*$/)) {
            momentInput = moment(rawInput, "X");
        }

        if (!momentInput) {
            momentInput = moment(rawInput);
        }

        if (momentInput.isValid()) {
            var delta;
            if (relativeTime) {
                delta = relativeTime;
            } else {
                delta = momentInput.fromNow();
                // formatTimeDelta(Math.floor(momentInput.unix() - (Date.now() / 1000.0)));
            }

            return {
                isValid: true,
                timeInfo: {
					utc: momentInput.format(),
					unix: momentInput.unix(),
					delta: delta,
					local: momentInput.format(),
				},
				error: null,
            }
        } else {
            return {
                isValid: false,
                error: "Unable to parse input",
				timeInfo: null,
            }
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
inputUpdateHandler({target: queryElement});
