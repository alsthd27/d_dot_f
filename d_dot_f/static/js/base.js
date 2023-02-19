//
// Notify MS IE not supported
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
// Hide and show header and footer
//
function hideAndShow() {
    if (location.pathname.indexOf("accounts") != -1) {
        navbar.hidden = true;
        footer.hidden = true;
    };
}

hideAndShow();