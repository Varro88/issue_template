const settingsName = "jiraHelperSettings";
let config = null;

document.addEventListener('DOMContentLoaded', function() {
    initUi();
    // document.getElementById('debug1').addEventListener('click', function() {
    //     saveSettings();
    // });
    loadSettings();

    document.querySelectorAll('input').forEach(item => {
        item.addEventListener('change', event => {
          saveSettings();
        })
    })
});

function initUi() {
    config = JSON.parse(readTemplate());
    buildUi(config.uiElements);
}

function readTemplate() {
    const url = chrome.runtime.getURL('template.json');

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    try {
        xhr.send();
        if (xhr.status == 200) {
            console.log("OK");
            return xhr.responseText;
        } 
        else {
            console.log("NOT OK");
            return "Response error when getting template. Status: " + xhr.status;
        }
    } 
    catch(err) {
        console.log("Error");
        return "Can't get template. Error: " + err;
    }
}

function saveSettings() {
    let settings = {};

    //text inputs
    let textInputs = document.querySelectorAll("input[type='text']");
    if(textInputs.length>0) {
        let savedTexts = {};
        textInputs.forEach(element => {
            savedTexts[element.id] = element.value;
        });
        settings["inputs"] = savedTexts;
    }

    //radioboxes
    let radioboxes = document.querySelectorAll("input[type='radio']:checked");
    if(radioboxes.length > 0) {
        let savedRadioboxes = {};
        radioboxes.forEach(element => {
            savedRadioboxes[element.name] = element.id;
        });
        settings["radioboxes"] = savedRadioboxes;
    }

    //checkboxes
    //NodeList to array
    let checkboxes = [...document.querySelectorAll("input[type='checkbox']")];
    if(checkboxes.length > 0) {
        let savedCheckboxes = {};
        checkboxes.forEach(element => {
            savedCheckboxes[element.id] = document.querySelector("#" + element.id).checked;
        });
        settings["checkboxes"] = savedCheckboxes;
    }
    
    let settingsObj = {};
    settingsObj[settingsName] = settings;
    chrome.storage.sync.set(settingsObj);
}

function loadSettings() {
    chrome.storage.sync.get(settingsName, function(result) {
        if (result == null || result == undefined) {
            return;
        }

        let settings = result[settingsName];
        console.log(settings);
        if(settings == null) {
            return;
        }
        Object.keys(settings).forEach(k => {
            console.log(k + ' - ' + settings[k]);
        });

        let inputs = settings["inputs"];
        Object.keys(inputs).forEach( fieldName => {
            document.querySelector("#" + fieldName).value = inputs[fieldName];
        });

        let radioboxes = settings["radioboxes"];
        Object.keys(radioboxes).forEach( fieldName => {
            document.querySelector("#" + radioboxes[fieldName]).checked = true;
        });

        let checkboxes = settings["checkboxes"];
        Object.keys(checkboxes).forEach( fieldName => {
            document.querySelector("#" + fieldName).checked = checkboxes[fieldName];
        });
    });
}

function generateOutput(additionalText) {
    let result = "";
    config.uiElements.forEach(element => {
        switch(element.type) {
            case 'text': result += processTextInput(element); break;
            case 'radiobutton': result += processRadioboxes(element, false); break;
            case 'checkbox': result += processCheckboxes(element, true); break;
            case 'button': break;
            default: console.warn("Unknown element type: " + element.type); break;
        }
    });
    result += "\n\n\n";
    if(Array.isArray(additionalText)) {
        additionalText.forEach(line => {
            result += line + "\n";
        });
    }
    else {
        result += additionalText;
    }
    console.log(result);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let arg = {action: "sendComment", comment: result, selectors: config.jiraSelectors};
        chrome.tabs.sendMessage(tabs[0].id, arg, function(response) {
        console.log("Response IN popup: " + JSON.stringify(response));
        });
    });
}

function processFormatting(parameters, text) {
    let formatted = "";
    if(parameters.bold) {
        formatted = "*" + text + "*";
    }
    return formatted;
}

function processTextInput(element) {
    let output = processFormatting(element, element.text);
    output += ": " + document.getElementById(element.id).value + "\n";
    return output;
}

function processRadioboxes(element) {
    let output = processFormatting(element, element.text);
    let value = document.querySelector("input[type='radio'][name='" + element.id + "']:checked").value;
    output += ": " + value + "\n";
    return output;
}

function processCheckboxes(element) {
    let output = processFormatting(element, element.text);
    let value = [...document.querySelectorAll("input[name='" + element.id + "']:checked")].map(x =>x.value).join(", ");
    output += ": " + value + "\n";
    return output;
}