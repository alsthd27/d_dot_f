//
// MS IE not supported
//
(function () {
    let agent = navigator.userAgent.toLowerCase();
    if ((agent.indexOf("trident") || agent.indexOf("msie")) !== -1) {
        alert("앗, 디닷에프는 MS Internet Explorer를 지원하지 않아요. 😭\n번거로우시겠지만 디닷에프에 최적화된 브라우저로 이용해주세요! 🙏\n\n권장 브라우저: Google Chrome, MS Edge");
        document.body.setAttribute("style", "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);");
        document.body.innerHTML = "<img src='{% static 'images/d_dot_f_logo.svg' %}' style='height: 3rem; text-align: center;' /><p style='margin-top: 1rem;'>앗, 디닷에프는 MS Internet Explorer를 지원하지 않아요. 😭<br>번거로우시겠지만 디닷에프에 최적화된 브라우저로 이용해주세요! 🙏<br><br>권장 브라우저: <a href='https://www.google.com/chrome/' style='color: #F15922;'>Google Chrome</a>, <a href='microsoft-edge:{{ request.build_absolute_uri }}' style='color: #F15922;'>MS Edge</a></p>";
    };
})();

//
// Ajax setup
//
let csrftoken = getCookie("csrftoken");

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            };
        };
    };
    return cookieValue;
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

//
// Hide and show header and footer
//
function hideAndShow() {
    if (location.pathname.indexOf("accounts") != -1) {
        navbar.hidden = true;
        footer.hidden = true;
    };
}

hideAndShow();

//
// Date and Time
//
const today = new Date();
const yesterday = new Date(Date.parse(today) - 1 * 1000 * 60 * 60 * 24);
const beforeYesterday = new Date(Date.parse(yesterday) - 1 * 1000 * 60 * 60 * 24);
const yyyymmdd = getYyyymmdd(today);
const yyyymmddOfYesterday = getYyyymmdd(yesterday);
const yyyymmddOfBeforeYesterday = getYyyymmdd(beforeYesterday);
const h = today.getHours();
const m = today.getMinutes();
const hhmm = padTo2Digits(h) + padTo2Digits(m);
const hhmmWithColon = padTo2Digits(h) + ":" + padTo2Digits(m);

function getYyyymmdd(date) {
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
}

function padTo2Digits(num) {
    return String(num).padStart(2, "0");
}

//
// Notification
//
function controlNoti(notiType) {
    if (notiType == "locationAccessRequest") {
        notiIconLocation.classList.remove("hidden");
        notiTitle.innerText = "지금 계신 지역의 기상정보를 받아보세요.";
        notiContent.innerText = "사용 중인 브라우저에서 위치 액세스를 허용해주세요. 새로고침도 잊지 마시구요!";
    } else if (notiType == "locationAccessError") {
        notiIconLocation.classList.remove("hidden");
        notiTitle.innerText = "혹시 기상정보가 부정확한가요?";
        notiContent.innerText = "위치 액세스가 허용되었는지 확인해주세요. 새로고침도 잊지 마시구요!";
    }
    setTimeout(() => {
        noti.setAttribute("x-data", "{ show: true }");
    }, 2000);
}