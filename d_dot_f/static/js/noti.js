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