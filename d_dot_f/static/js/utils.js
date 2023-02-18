let onlyHanguls = document.querySelectorAll(".only-hangul");
let onlyNumbers = document.querySelectorAll(".only-number");
let onlyEmails = document.querySelectorAll(".only-email");
let onlyPhones = document.querySelectorAll(".only-phone");
let eventTypes = ["focusin", "focusout", "compositionstart", "compositionupdate", "compositionend", "keydown", "keypress", "keyup", "mouseenter", "mouseover", "mousemove", "mousedown", "mouseup", "click", "contextmenu", "mouseleave", "mouseout", "select"];
let allowedKeys = ["Enter", "Backspace", "Tab", "Shift", "Control", "Alt", "HangulMode", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
let regHangul = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
let regNotHangul = /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g;
let regEmail = /^[0-9a-zA-Z]([\-.\w]*[0-9a-zA-Z\-_+])*@([0-9a-zA-Z][\-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$/g;
let regNotNumber = /[^0-9]/g;
let regNotPhone = /[^0-9\-]/g;
let labels = document.querySelectorAll("label");
let inputs = [];
let buttons = document.querySelectorAll("button");
let spins = document.querySelectorAll(".animate-spin");
let now = new Date();

[String, Number].forEach((object) => {
    object.prototype.getLastNumInKor = function getLastNumInKor() {
        let lastNum = Number(String(this).slice(-1));
        let lastNumInKor;
        lastNum == 0 ? lastNumInKor = "공" : lastNum == 1 ? lastNumInKor = "일" : lastNum == 2 ? lastNumInKor = "이" : lastNum == 3 ? lastNumInKor = "삼" : lastNum == 4 ? lastNumInKor = "사" : lastNum == 5 ? lastNumInKor = "오" : lastNum == 6 ? lastNumInKor = "육" : lastNum == 7 ? lastNumInKor = "칠" : lastNum == 8 ? lastNumInKor = "팔" : lastNum == 9 ? lastNumInKor = "구" : null;
        return lastNumInKor;
    };
});

Number.prototype.toTwoDigits = function toTwoDigits() {
    return String(this).padStart(2, "0");
};

Date.prototype.getKorDay = function getKorDay() {
    let dayNum = this.getDay();
    let korDay;
    dayNum == 0 ? korDay = "일" : dayNum == 1 ? korDay = "월" : dayNum == 2 ? korDay = "화" : dayNum == 3 ? korDay = "수" : dayNum == 4 ? korDay = "목" : dayNum == 5 ? korDay = "금" : null;
    return korDay;
};

function validation() {
    eventTypes.forEach((type) => {
        onlyHanguls.forEach((input) => {
            input.addEventListener(type, () => {
                input.value = input.value.replace(regNotHangul, "");
            });
        });
        onlyNumbers.forEach((input) => {
            input.addEventListener(type, () => {
                input.value = input.value.replace(regNotNumber, "");
            });
        });
        onlyEmails.forEach((input) => {
            input.addEventListener(type, () => {
                input.value = input.value.replace(regHangul, "");
            });
        });
        onlyPhones.forEach((input) => {
            input.addEventListener(type, () => {
                input.value = input.value.replace(regNotNumber, "").replace(/(^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-");
            });
        });
    });
    inputs.forEach((input) => {
        input.addEventListener("keydown", (event) => {
            displayError(false, input);
            manageDescr(input, event);
        });
        input.addEventListener("focusout", () => {
            displayDescr(false, input);
            manageError(input);
        });
        input.addEventListener("focusin", () => {
            displayError(false, input);
        });
    });
}

function manageDescr(input, event) {
    let inputKeyChar = event.key;
    if (input == id_student_id || input == id_email_vcode || input == id_phone_vcode) {
        if (regNotNumber.test(input.value) ||
            (regNotNumber.test(inputKeyChar) && allowedKeys.indexOf(inputKeyChar) == -1)) {
            displayDescr(true, input, "only numbers");
        } else {
            displayDescr(false, input);
        };
    };
    if (input == id_name) {
        if (regNotHangul.test(input.value) ||
            (!event.isComposing && allowedKeys.indexOf(inputKeyChar) == -1)) {
            displayDescr(true, input, "only hanguls");
        } else {
            displayDescr(false, input);
        };
    };
    if (input == id_email) {
        if (event.isComposing && allowedKeys.indexOf(inputKeyChar) == -1) {
            displayDescr(true, input, "no hanguls");
        } else {
            displayDescr(false, input);
        };
    };
    if (input == id_phone) {
        if (regNotPhone.test(input.value) ||
            (regNotPhone.test(inputKeyChar) && allowedKeys.indexOf(inputKeyChar) == -1)) {
            displayDescr(true, input, "only numbers");
        } else {
            displayDescr(false, input);
        };
    };
    if (inputKeyChar == " ") {
        displayDescr(true, input, "no spaces");
    };
}

function displayDescr(boolean, input, descrType) {
    let descrMsg = codeDescr(input);
    if (boolean == true) {
        let sentence;
        if (descrType == "no hanguls") {
            sentence = "로마자, 숫자, 특수문자만 입력해주세요.";
        } else if (descrType == "only numbers") {
            sentence = "숫자만 입력해주세요.";
        } else if (descrType == "only hanguls") {
            sentence = "한글만 입력해주세요.";
        } else if (descrType == "no spaces") {
            sentence = "공백은 입력될 수 없어요.";
        };
        descrMsg.innerText = `${sentence}`;
        descrMsg.hidden = false;
    } else if (boolean == false) {
        descrMsg.innerText = null;
        descrMsg.hidden = true;
    };
}

function codeDescr(id) {
    return eval(String(id.id) + "_description");
}

function manageError(input) {
    if (input == id_agree) {
        if (input.checked == false) {
            displayError(true, input, "unchecked");
        } else {
            return false;
        };
    };
    if (input == id_student_id) {
        if (input.value.length == 0) {
            displayError(true, input, "empty");
        } else if (input.value.length !== 10) {
            displayError(true, input, "insufficient");
        } else if (Number(input.value.substr(0, 4)) > now.getFullYear()) {
            displayError(true, input, "invalid");
        } else {
            return false;
        };
    };
    if (input == id_name) {
        if (input.value.length == 0) {
            displayError(true, input, "empty");
        } else if (input.value.length == 1) {
            displayError(true, input, "insufficient");
        } else {
            return false;
        };
    };
    if (input == id_email) {
        if (input.value.length == 0) {
            displayError(true, input, "empty");
        } else if (input.value.indexOf("@") == -1 ||
            input.value.split("@")[0].length <= 1 ||
            input.value.split("@")[1].indexOf(".") == -1 ||
            input.value.split("@")[1].split(".")[0].length <= 1 ||
            input.value.split("@")[1].split(".")[1].length <= 1 ||
            (input.value.split("@")[1].split(".").length - 1 == 2 && input.value.split("@")[1].split(".")[2].length <= 1 && input.value.substr(-1) != ".")) {
            displayError(true, input, "insufficient");
        } else if (!input.value.match(regEmail)) {
            displayError(true, input, "invalid");
        } else {
            return false;
        };
    };
    if (input == id_phone) {
        if (input.value.length == 0) {
            displayError(true, input, "empty");
        } else if (input.value.length !== 13) {
            displayError(true, input, "insufficient");
        } else if (input.value.indexOf("-") !== 3 && input.value.lastIndexOf("-") !== 8) {
            displayError(true, input, "invalid");
        } else {
            return false;
        };
    };
    if (input == id_email_vcode || input == id_phone_vcode) {
        if (input.value.length == 0) {
            displayError(true, input, "empty");
        } else if (input.value.length !== 6) {
            displayError(true, input, "insufficient");
        } else {
            return false;
        };
    };
    return true;
}

function displayError(boolean, input, errorType) {
    let errorMsg = codeError(input);
    if (boolean == true) {
        let subject;
        let narrativeClause;
        if (input.type != "checkbox") {
            input.classList.remove("border-gray-300");
            input.classList.add("bg-flamingo-50");
            input.classList.add("border-transparent");
        };
        if (errorType == "unchecked") {
            subject = matchJosa(`'${findLabel(input)}'`, "을를", true);
            narrativeClause = "체크해주세요.";
        } else if (errorType == "empty") {
            subject = matchJosa(findLabel(input), "을를", true);
            narrativeClause = "입력해주세요.";
        } else if (errorType == "insufficient") {
            subject = matchJosa(findLabel(input), "이가", true);
            narrativeClause = "덜 입력된 것 같아요.";
        } else if (errorType == "invalid") {
            subject = matchJosa(findLabel(input), "이가", true);
            narrativeClause = "잘못 입력된 것 같아요.";
        };
        errorMsg.innerText = `${subject} ${narrativeClause}`;
        errorMsg.hidden = false;
    } else if (boolean == false) {
        if (input.type != "checkbox") {
            input.classList.add("border-gray-300");
            input.classList.remove("bg-flamingo-50");
            input.classList.remove("border-transparent");
        };
        errorMsg.innerText = null;
        errorMsg.hidden = true;
    };
}

function codeError(id) {
    return eval(String(id.id) + "_error");
}

function displayButtonMsg(boolean, button, type, sentence) {
    let msg;
    if (type == "descr") {
        msg = codeDescr(button);
    } else if (type == "error") {
        msg = codeError(button);
    };
    if (boolean == true) {
        msg.innerText = sentence;
        msg.hidden = false;
    } else if (boolean == false) {
        msg.innerText = null;
        msg.hidden = true;
    };
}

function codeSpin(id) {
    return eval(String(id.id) + "_spin");
}

function makeAjaxCall(callType) {
    let defaultUrl = `${location.protocol}//${location.host}`;
    let data, additionalData, url, status, incomingData;
    if (checkPathname("signup")) {
        data = {
            "agree": `${id_agree.checked}`,
            "student_id": `${id_student_id.value}`,
            "name": `${id_name.value}`,
            "email": `${id_email.value}`,
            "phone": `${id_phone.value}`
        };
        if (callType == "create vcode") {
            url = `${defaultUrl}/utility/create-vcode`;
            codeSpin(id_create_vcode).classList.remove("hidden");
        } else if (callType == "confirm vcode") {
            additionalData = {
                "email_vcode": `${id_email_vcode.value}`,
                "phone_vcode": `${id_phone_vcode.value}`
            };
            data = Object.assign({}, data, additionalData);
            url = `${defaultUrl}/utility/confirm-vcode`;
            codeSpin(id_confirm_vcode).classList.remove("hidden");
        };
    } else if (checkPathname("equipment")) {
        if (callType == "get equip purposes") {
            data = {
                "db_name": "equip-purpose"
            };
            url = `${defaultUrl}/facility/equipment/get-back-office-data`;
        } else if (callType == "get equip work scheds") {
            data = {
                "db_name": "equip-work-schedule"
            };
            url = `${defaultUrl}/facility/equipment/get-back-office-data`;
        } else if (callType == "get equip app scheds") {
            data = {
                "year": `${yearOfThisDate}`,
                "month": `${monthOfThisDate__}`
            };
            url = `${defaultUrl}/facility/equipment/get-equip-app-scheds`;
        };
    };
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            };
            if (checkPathname("signup")) {
                freezeForm(true, inputs);
            };
        },
        success: function (object) {
            status = object.status;
            if (status.includes("succeeded")) {
                incomingData = object.data;
                if (status.includes("schedules")) {
                    incomingData.sort((a, b) => {
                        return a.time > b.time ? 1 : -1;
                    });
                };
            };
            console.log(status);
            handleAjaxCallback(status, incomingData);
        },
        error: function () {
            if (checkPathname("signup")) {
                callType == "create vcode" ?
                    status = "failed to create vcode" :
                    callType == "confirm vcode" ?
                        status = "failed to confirm vcode" :
                        status = "an unknown error occurred";
            } else if (checkPathname("equipment")) {
                callType == "get back office data" ?
                    status = "failed to get back office data" :
                    callType == "get equip app scheds" ?
                        status = "failed to get equip app scheds" :
                        status = "an unknown error occurred";
            };
            console.log(status);
            handleAjaxCallback(status);
        },
        complete: function () {
            if (checkPathname("signup")) {
                spins.forEach((spin) => {
                    spin.classList.add("hidden");
                });
            };
        }
    });
}

function handleAjaxCallback(status, incomingData) {
    if (checkPathname("signup")) {
        if (status == "vcode created and sent via mail, sms") {
            displayButtonMsg(true, id_create_vcode, "descr", "인증번호가 전송되었어요!");
            displayButtonMsg(false, id_create_vcode, "error");
            stepOnes.forEach((input) => {
                input.type == "checkbox" ? input.disabled = true : input.readOnly = true;
            });
            stepTwos.forEach((input) => {
                input.disabled = false;
            });
            id_confirm_vcode.disabled = false;
            initValidation(stepTwos, id_confirm_vcode);
        } else if (status == "failed to create vcode" ||
            status == "vcode created and sent via mail" ||
            status == "vcode created and sent via sms" ||
            status == "vcode created but not sent") {
            freezeForm(false, inputs);
            displayButtonMsg(true, id_create_vcode, "error", "앗, 다시 한 번 시도해주세요!");
            displayButtonMsg(false, id_create_vcode, "descr");
            id_create_vcode.disabled = false;
        } else if (status == "duplicate sign up attempted") {
            freezeForm(false, inputs);
            displayButtonMsg(true, id_create_vcode, "error", `앗, 이미 ${matchJosa(id_student_id.value, "라는이라는", true)} 학번으로 가입된 계정이 있어요!`);
            displayButtonMsg(false, id_create_vcode, "descr");
            id_create_vcode.disabled = false;
        } else if (status == "the student id does not exist") {
            freezeForm(false, inputs);
            displayButtonMsg(true, id_create_vcode, "error", "학번이나 성명이 잘못 입력된 것 같아요.");
            displayButtonMsg(false, id_create_vcode, "descr");
            id_create_vcode.disabled = false;
        } else if (status == "failed to confirm vcode") {
            freezeForm(false, inputs);
            displayButtonMsg(true, id_confirm_vcode, "error", "앗, 다시 한 번 시도해주세요!");
            id_confirm_vcode.disabled = false;
        } else if (status == "invalid vcode") {
            freezeForm(false, inputs);
            displayButtonMsg(true, id_confirm_vcode, "error", "인증번호가 잘못 입력된 것 같아요.");
            id_confirm_vcode.disabled = false;
        } else if (status == "vcode confirmed") {
            displayButtonMsg(false, id_confirm_vcode, "error");
            inputs = document.querySelectorAll("input");
            inputs.forEach((input) => {
                input.disabled = false;
                input.readOnly = true;
            });
            id_confirm_vcode.disabled = true;
            document.querySelector("form").submit();
        };
    } else if (checkPathname("equipment")) {
        if (status == "succeeded in getting equip purposes") {
            renderPurposes(incomingData);
            renderValidDateBtns();
        } else if (status == "succeeded in getting equip work schedules") {
            gottenWorkScheds = incomingData;
        } else if (status == "succeeded in getting equip app schedules") {
            gottenAppScheds = incomingData;
        };
    };
}

function matchJosa(word, josaType, boolean) {
    let lastLetter, hasBatchim, josa, result;
    isNaN(word) == true ? lastLetter = word.substr(-1) : lastLetter = word.getLastNumInKor();
    hasBatchim = (lastLetter.charCodeAt(0) - parseInt("ac00", 16)) % 28 > 0;
    if (josaType == "을를") {
        josa = hasBatchim ? "을" : "를";
    } else if (josaType == "이가") {
        josa = hasBatchim ? "이" : "가";
    } else if (josaType == "은는") {
        josa = hasBatchim ? "은" : "는";
    } else if (josaType == "와과") {
        josa = hasBatchim ? "과" : "와";
    } else if (josaType == "로으로") {
        josa = hasBatchim ? "으로" : "로";
    } else if (josaType == "라는이라는") {
        josa = hasBatchim ? "이라는" : "라는";
    };
    boolean ? result = word + josa : result = josa;
    return result;
}

function formatDate(date, booleanForKor, booleanForDay) {
    let day, format, formattedDate;
    booleanForDay ? day = date.getKorDay() : null;
    if (booleanForKor) {
        format = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    } else {
        format = `${date.getFullYear()}-${(date.getMonth() + 1).toTwoDigits()}-${(date.getDate()).toTwoDigits()}`;
    };
    formattedDate = booleanForDay ? `${format}(${day})` : format;
    return formattedDate;
}

function findLabel(input) {
    let foundLabel;
    labels.forEach((label) => {
        if (label.getAttribute("for") == String(input.id)) {
            foundLabel = label.innerText;
        };
    });
    return foundLabel;
}

function checkPathname(word) {
    let boolean = (window.location.pathname).includes(word);
    return boolean;
}

function freezeForm(boolean, inputs) {
    inputs.forEach((input) => {
        if (input.type == "checkbox") {
            boolean ? input.disabled = true : input.disabled = false;
        } else if (input.disabled == false) {
            boolean ? input.readOnly = true : input.readOnly = false;
        };
    });
    buttons.forEach((button) => {
        button.disabled = true;
    });
}

function submitForm(button) {
    inputs.forEach((input) => {
        input.addEventListener("keypress", (event) => {
            if (event.key == "Enter") {
                button.click();
            };
        });
    });
}

function initValidation(array, button) {
    inputs.length = 0;
    inputs.push(...array);
    validation();
    submitForm(button);
}