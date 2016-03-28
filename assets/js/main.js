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
    var currentMoment = moment(event.target.value);
    if (currentMoment.isValid()) {
        queryElement.style.borderBottomColor = "white";
        updateDependencies(currentMoment);
    } else {
        queryElement.style.borderBottomColor = "pink";
    }
}

var queryElement = document.getElementById('js-query');
queryElement.oninput = inputUpdateHandler;
queryElement.onpropertychange = queryElement.oninput;

var deltaElement = document.getElementById('js-delta');
var isoElement = document.getElementById('js-utc');
var epochElement = document.getElementById('js-epoch');
var localElement = document.getElementById('js-local');

