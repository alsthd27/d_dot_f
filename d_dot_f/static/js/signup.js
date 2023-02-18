let fullName = id_first_name.value;
let extraData = id_last_name.value.split("#");
let pictureUrl = extraData[0];
let providerName = extraData[1];
let providerNames = document.querySelectorAll(".provider-name");
let stepOnes = document.querySelectorAll(".step-one");
let stepTwos = document.querySelectorAll(".step-two");
let filteredInputs = [];

id_picture.setAttribute("src", pictureUrl);
id_picture.setAttribute("alt", `${providerName} 계정 프로필 사진`);
providerNames.forEach((blank) => {
    blank.innerText = providerName;
});
id_name.value = fullName;

initValidation(stepOnes, id_create_vcode);
id_create_vcode.addEventListener("click", () => {
    filteredInputs = inputs.filter(isValid);
    if (filteredInputs.length == inputs.length) {
        makeAjaxCall("create vcode");
        displayButtonMsg(false, id_create_vcode, "descr");
        displayButtonMsg(false, id_create_vcode, "error");
    } else {
        inputs.forEach((input) => {
            manageError(input);
        });
    };
    ["keydown", "focusin"].forEach((type) => {
        inputs.forEach((input) => {
            input.addEventListener(type, () => {
                displayButtonMsg(false, id_create_vcode, "error");
            });
        });
    });
});
id_confirm_vcode.addEventListener("click", () => {
    filteredInputs = inputs.filter(isValid);
    if (filteredInputs.length == inputs.length) {
        makeAjaxCall("confirm vcode");
        displayButtonMsg(false, id_confirm_vcode, "error");
    } else {
        inputs.forEach((input) => {
            manageError(input);
        });
    };
    ["keydown", "focusin"].forEach((type) => {
        inputs.forEach((input) => {
            input.addEventListener(type, () => {
                displayButtonMsg(false, id_confirm_vcode, "error");
            });
        });
    });
});

function isValid(input) {
    return input.type == "checkbox" ? input.checked : manageError(input) == false && codeDescr(input).hidden && codeError(input).hidden;
}