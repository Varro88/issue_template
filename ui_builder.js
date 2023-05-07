function test() {
    alert("OK!");
}

function buildUi(template) {
    template.forEach(element => { 
        switch(element.type) {
            case 'text': addTextInput(element); break;
            case 'radiobutton': addSelector(element, false); break;
            case 'checkbox': addSelector(element, true); break;
            case 'button': addButton(element, true); break;
            default: console.warn("Unknown element type: " + element.type); break;
        }
    });
}

function buildCommonPart(element) {
    let fieldSet = document.createElement("fieldset");
    let legend = document.createElement("legend");
    legend.innerText = element.text;
    fieldSet.appendChild(legend);
    return fieldSet;
}

function addTextInput(element) {
    let fieldSet = buildCommonPart(element);
    let textInput = document.createElement("input");
    textInput.setAttribute("type", "text");
    textInput.setAttribute("id", element.id);
    textInput.setAttribute("name", element.id);
    fieldSet.appendChild(textInput);
    document.querySelector("#template").appendChild(fieldSet);
}

function addSelector(element, isCheckbox) {
    let fieldSet = buildCommonPart(element);

    element.values.forEach(radio => {
        let item = document.createElement("input");
        if(isCheckbox) {
            item.setAttribute("type", "checkbox");
        }
        else {
            item.setAttribute("type", "radio");
        }
        item.setAttribute("id", radio.id);
        item.setAttribute("value", radio.value);
        item.setAttribute("name", element.id);
        fieldSet.appendChild(item);

        let label = document.createElement("label");
        label.setAttribute("for", radio.id);
        label.innerText = radio.value;
        fieldSet.appendChild(label);

        let newLine = document.createElement("br");
        fieldSet.appendChild(newLine);
    });

    document.querySelector("#template").appendChild(fieldSet);
}

function addButton(element) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("id", element.id);
    button.setAttribute("class", element.cssClass);
    button.setAttribute("title", element.comment);
    button.innerText = element.text;
    document.querySelector("#template").appendChild(button);
    document.getElementById(element.id).addEventListener('click', function() {
        generateOutput(element.comment);
    });
}