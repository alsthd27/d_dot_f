login_google.addEventListener("mousedown", () => {
    var agent = navigator.userAgent.toLowerCase();
    var boolean, app, browser, message;
    if ((agent.indexOf("kakaotalk")) !== -1) {
        boolean = true;
        app = "카카오톡";
        browser = "카카오톡 인앱 브라우저";
    };
    if ((agent.indexOf("naver")) !== -1) {
        boolean = true;
        app = "네이버앱";
        browser = "네이버앱 인앱 브라우저";
    };
    if (boolean == true) {
        message = `앗, ${app}을 통해 들어오셨군요!\nGoogle 정책에 의해 ${browser}에서는 'Google로 로그인'이 불가해요. 😭\n번거로우시겠지만 다음 중 편한 방법을 골라 이용해주세요! 🙏\n\n1) '카카오로 로그인' 또는 '네이버로 로그인'하기\n2) Google Chrome이나 Apple Safari로 들어오기`
        alert(message);
    };
})