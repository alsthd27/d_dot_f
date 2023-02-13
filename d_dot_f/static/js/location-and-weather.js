let weatherInfo;
let longitude, latitude, dfsXyConv, x, y;
let cityName;
let requestJson = {};
let responseJson = {};

weatherInfo = navigator.geolocation.watchPosition(getLongAndLatAndXyAndExecute, handleGeolocationError);
setTimeout(() => {
    navigator.geolocation.clearWatch(weatherInfo);
}, 15000);

//
// utility functions
//

function handleGeolocationError(error) {
    const defaultCoords = { coords: { longitude: 126.9996417, latitude: 37.56100278 } };
    if (error.code == 1) {
        controlNoti("locationAccessRequest");
    } else {
        controlNoti("locationAccessError");
    };
    getLongAndLatAndXyAndExecute(defaultCoords);
}

// #SOURCE: https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, latitude:위도, longitude:경도), "toLL"(좌표->위경도,latitude:x, longitude:y) )
function dfs_xy_conv(code, longitude, latitude) {
    // LCC DFS 좌표변환을 위한 기초 자료
    let RE = 6371.00877; // 지구 반경(km)
    let GRID = 5.0; // 격자 간격(km)
    let SLAT1 = 30.0; // 투영 위도1(degree)
    let SLAT2 = 60.0; // 투영 위도2(degree)
    let OLON = 126.0; // 기준점 경도(degree)
    let OLAT = 38.0; // 기준점 위도(degree)
    let XO = 43; // 기준점 X좌표(GRID)
    let YO = 136; // 기준점 Y좌표(GRID)

    let DEGRAD = Math.PI / 180.0;
    let RADDEG = 180.0 / Math.PI;

    let re = RE / GRID;
    let slat1 = SLAT1 * DEGRAD;
    let slat2 = SLAT2 * DEGRAD;
    let olon = OLON * DEGRAD;
    let olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    let rs = {};
    if (code == "toXY") {
        rs["lat"] = latitude;
        rs["lng"] = longitude;
        let ra = Math.tan(Math.PI * 0.25 + (latitude) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        let theta = longitude * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
        rs["x"] = latitude;
        rs["y"] = longitude;
        let xn = latitude - XO;
        let yn = ro - longitude + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        let alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        } else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            } else theta = Math.atan2(xn, yn);
        };
        let alon = theta / sn + olon;
        rs["lat"] = alat * RADDEG;
        rs["lng"] = alon * RADDEG;
    };
    return rs;
}

function sh(hourAndMinute) {
    let hour = hourAndMinute.slice(0, 2);
    let minute = hourAndMinute.slice(2, 4);
    return today.setHours(hour, minute);
}

function getBaseDateTime(apiType) {
    let baseDate = yyyymmdd;
    let baseTime;
    if (apiType == "ultra-short-term") {
        if (sh(hhmm) < sh("0040")) {
            baseDate = yyyymmddOfYesterday;
            baseTime = "2300";
        } else if (sh("0040") <= sh(hhmm) && sh(hhmm) < sh("0140")) {
            baseTime = "0000";
        } else if (sh("0140") <= sh(hhmm) && sh(hhmm) < sh("0240")) {
            baseTime = "0100";
        } else if (sh("0240") <= sh(hhmm) && sh(hhmm) < sh("0340")) {
            baseTime = "0200";
        } else if (sh("0340") <= sh(hhmm) && sh(hhmm) < sh("0440")) {
            baseTime = "0300";
        } else if (sh("0440") <= sh(hhmm) && sh(hhmm) < sh("0540")) {
            baseTime = "0400";
        } else if (sh("0540") <= sh(hhmm) && sh(hhmm) < sh("0640")) {
            baseTime = "0500";
        } else if (sh("0640") <= sh(hhmm) && sh(hhmm) < sh("0740")) {
            baseTime = "0600";
        } else if (sh("0740") <= sh(hhmm) && sh(hhmm) < sh("0840")) {
            baseTime = "0700";
        } else if (sh("0840") <= sh(hhmm) && sh(hhmm) < sh("0940")) {
            baseTime = "0800";
        } else if (sh("0940") <= sh(hhmm) && sh(hhmm) < sh("1040")) {
            baseTime = "0900";
        } else if (sh("1040") <= sh(hhmm) && sh(hhmm) < sh("1140")) {
            baseTime = "1000";
        } else if (sh("1140") <= sh(hhmm) && sh(hhmm) < sh("1240")) {
            baseTime = "1100";
        } else if (sh("1240") <= sh(hhmm) && sh(hhmm) < sh("1340")) {
            baseTime = "1200";
        } else if (sh("1340") <= sh(hhmm) && sh(hhmm) < sh("1440")) {
            baseTime = "1300";
        } else if (sh("1440") <= sh(hhmm) && sh(hhmm) < sh("1540")) {
            baseTime = "1400";
        } else if (sh("1540") <= sh(hhmm) && sh(hhmm) < sh("1640")) {
            baseTime = "1500";
        } else if (sh("1640") <= sh(hhmm) && sh(hhmm) < sh("1740")) {
            baseTime = "1600";
        } else if (sh("1740") <= sh(hhmm) && sh(hhmm) < sh("1840")) {
            baseTime = "1700";
        } else if (sh("1840") <= sh(hhmm) && sh(hhmm) < sh("1940")) {
            baseTime = "1800";
        } else if (sh("1940") <= sh(hhmm) && sh(hhmm) < sh("2040")) {
            baseTime = "1900";
        } else if (sh("2040") <= sh(hhmm) && sh(hhmm) < sh("2140")) {
            baseTime = "2000";
        } else if (sh("2140") <= sh(hhmm) && sh(hhmm) < sh("2240")) {
            baseTime = "2100";
        } else if (sh("2240") <= sh(hhmm) && sh(hhmm) < sh("2340")) {
            baseTime = "2200";
        } else if (sh("2340") <= sh(hhmm)) {
            baseTime = "2300";
        };
    } else if (apiType == "short-term") {
        if (sh(hhmm) < sh("0210")) {
            baseDate = yyyymmddOfYesterday;
            baseTime = "2300";
        } else if (sh("0210") <= sh(hhmm) && sh(hhmm) < sh("0510")) {
            baseTime = "0200";
        } else if (sh("0510") <= sh(hhmm) && sh(hhmm) < sh("0810")) {
            baseTime = "0500";
        } else if (sh("0810") <= sh(hhmm) && sh(hhmm) < sh("1110")) {
            baseTime = "0800";
        } else if (sh("1110") <= sh(hhmm) && sh(hhmm) < sh("1410")) {
            baseTime = "1100";
        } else if (sh("1410") <= sh(hhmm) && sh(hhmm) < sh("1710")) {
            baseTime = "1400";
        } else if (sh("1710") <= sh(hhmm) && sh(hhmm) < sh("2010")) {
            baseTime = "1700";
        } else if (sh("2010") <= sh(hhmm) && sh(hhmm) < sh("2310")) {
            baseTime = "2000";
        } else if (sh("2310") <= sh(hhmm)) {
            baseTime = "2300";
        };
    };
    return { "baseDate": baseDate, "baseTime": baseTime };
}

function editDateInGoodFormat(date) {
    date = String(date);
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

function editTimeInGoodFormat(time) {
    time = String(time);
    return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
}

//
// main functions
//

function getLongAndLatAndXyAndExecute({ coords }) {
    longitude = coords.longitude;
    latitude = coords.latitude;
    dfsXyConv = dfs_xy_conv("toXY", longitude, latitude);
    x = dfsXyConv.x;
    y = dfsXyConv.y;
    getAddress(longitude, latitude);
    getUltraShortTermForecast(x, y);
    getShortTermForecast(x, y);
    getMaxTemperature(x, y);
    getMinTemperature(x, y);
    getSunriseSunset(cityName);
}

function getAddress(longitude, latitude) {
    requestJson.name = "getAddress";
    requestJson.url = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
    requestJson.data = { x: `${longitude}`, y: `${latitude}`, input_coord: "WGS84" };
    requestJson.async = false;
    requestJson.headers = { Authorization: `KakaoAK ${kakaoRestApiKey}` };
    makeAjaxCall(requestJson);
}

function getUltraShortTermForecast(x, y) {
    requestJson.name = "getUltraShortTermForecast";
    requestJson.url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
    requestJson.data = { serviceKey: `${PublicDataServiceKey}`, base_date: getBaseDateTime("ultra-short-term").baseDate, base_time: getBaseDateTime("ultra-short-term").baseTime, nx: x, ny: y };
    requestJson.async = false;
    requestJson.headers = null;
    makeAjaxCall(requestJson);
}

function getShortTermForecast(x, y) {
    requestJson.name = "getShortTermForecast";
    requestJson.url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
    requestJson.data = { serviceKey: `${PublicDataServiceKey}`, base_date: getBaseDateTime("short-term").baseDate, base_time: getBaseDateTime("short-term").baseTime, nx: x, ny: y };
    requestJson.async = false;
    requestJson.headers = null;
    makeAjaxCall(requestJson);
}

function getMaxTemperature(x, y) {
    requestJson.name = "getMaxTemperature";
    requestJson.url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
    requestJson.data = { serviceKey: `${PublicDataServiceKey}`, base_date: getBaseDateTime("short-term").baseDate, base_time: getBaseDateTime("short-term").baseTime, nx: x, ny: y, numOfRows: 290 };
    requestJson.async = false;
    requestJson.headers = null;
    makeAjaxCall(requestJson);
}

function getMinTemperature(x, y) {
    requestJson.name = "getMinTemperature";
    requestJson.url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
    requestJson.data = { serviceKey: `${PublicDataServiceKey}`, base_date: yyyymmddOfBeforeYesterday, base_time: 2300, nx: x, ny: y, numOfRows: 290 };
    requestJson.async = false;
    requestJson.headers = null;
    makeAjaxCall(requestJson);
}

function getSunriseSunset(cityName) {
    requestJson.name = "getSunriseSunset";
    requestJson.url = "http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo";
    requestJson.data = { location: `${cityName}`, locdate: yyyymmdd, ServiceKey: `${PublicDataServiceKey}` };
    requestJson.async = false;
    requestJson.headers = null;
    makeAjaxCall(requestJson);
}

function makeAjaxCall(requestJson) {
    $.ajax({
        url: requestJson.url,
        data: requestJson.data,
        async: requestJson.async,
        headers: requestJson.headers
    }).done(function (response) {
        if (requestJson.name == "getAddress") {
            //
            // getAddress
            //
            let fullAddress, address1Depth, address2Depth, address2DepthSplit, address;
            requestJson = {};
            console.log("location");
            console.log(response);
            fullAddress = response.documents[0].address;
            address1Depth = fullAddress.region_1depth_name;
            address2Depth = fullAddress.region_2depth_name;
            address2DepthSplit = address2Depth.split(" ");
            address = `${address1Depth} ${address2Depth}`;
            if (address2DepthSplit.length > 1) {
                cityName = address2DepthSplit[0].slice(0, -1);
            } else {
                cityName = address1Depth;
            };
            document.querySelector("#address").innerText = address;
        } else if (requestJson.name == "getUltraShortTermForecast") {
            //
            // getUltraShortTermForecast
            //
            let responseLength, category, value;
            requestJson = {};
            responseLength = response.getElementsByTagName("category").length;
            console.log("ultra-short-term forecast");
            console.log(response);
            for (let i = 0; i < responseLength; i++) {
                category = response.getElementsByTagName("category")[i].innerHTML;
                value = response.getElementsByTagName("obsrValue")[i].innerHTML;
                if (category == "T1H") {
                    responseJson.temperature = `${value}℃`;
                } else if (category == "PTY") {
                    let precipitationType;
                    if (value == "0") {
                        precipitationType = "강수 없음";
                    } else if (value == "1") {
                        precipitationType = "비";
                    } else if (value == "2") {
                        precipitationType = "비/눈";
                    } else if (value == "3") {
                        precipitationType = "눈";
                    } else if (value == "4") {
                        precipitationType = "소나기";
                    } else if (value == "5") {
                        precipitationType = "빗방울";
                    } else if (value == "6") {
                        precipitationType = "빗방울/눈날림";
                    } else if (value == "7") {
                        precipitationType = "눈날림";
                    };
                    responseJson.precipitationType = `${precipitationType}`;
                } else if (category == "WSD") {
                    let windName;
                    responseJson.windSpeed = `${value}m/s`;
                    if (0 <= value && value <= 0.2) {
                        windName = "고요";
                    } else if (0.3 <= value && value <= 1.5) {
                        windName = "실바람";
                    } else if (1.6 <= value && value <= 3.3) {
                        windName = "남실바람";
                    } else if (3.4 <= value && value <= 5.4) {
                        windName = "산들바람";
                    } else if (5.5 <= value && value <= 7.9) {
                        windName = "건들바람";
                    } else if (8.0 <= value && value <= 10.7) {
                        windName = "흔들바람";
                    } else if (10.8 <= value && value <= 13.8) {
                        windName = "된바람";
                    } else if (13.9 <= value && value <= 17.1) {
                        windName = "센바람";
                    } else if (17.2 <= value && value <= 20.7) {
                        windName = "큰바람";
                    } else if (20.8 <= value && value <= 24.4) {
                        windName = "큰센바람";
                    } else if (24.5 <= value && value <= 28.4) {
                        windName = "노대바람";
                    } else if (28.5 <= value && value <= 32.6) {
                        windName = "왕바람";
                    } else if (32.7 <= value) {
                        windName = "싹쓸바람";
                    };
                    responseJson.windName = `${windName}`;
                };
            };
            document.querySelector("#temperature").innerText = responseJson.temperature;
            document.querySelector("#precipitationType").innerText = responseJson.precipitationType;
            document.querySelector("#windSpeed").innerText = responseJson.windSpeed;
            document.querySelector("#windName").innerText = responseJson.windName;
        } else if (requestJson.name == "getShortTermForecast") {
            //
            // getShortTermForecast
            //
            let responseLength, category, value;
            requestJson = {};
            responseLength = response.getElementsByTagName("category").length;
            console.log("short-term forecast");
            console.log(response);
            for (let i = 0; i < responseLength; i++) {
                category = response.getElementsByTagName("category")[i].innerHTML;
                value = response.getElementsByTagName("fcstValue")[i].innerHTML;
                if (category == "POP") {
                    responseJson.precipitationProbability = `${value}%`;
                } else if (category == "SKY") {
                    if (value == "1") {
                        responseJson.skyState = "맑음";
                    } else if (value == "3") {
                        responseJson.skyState = "구름 많음";
                    } else if (value == "4") {
                        responseJson.skyState = "흐림";
                    };
                };
            };
            document.querySelector("#precipitationProbability").innerText = responseJson.precipitationProbability;
            document.querySelector("#skyState").innerText = responseJson.skyState;
        } else if (requestJson.name == "getMaxTemperature") {
            //
            // getMaxTemperature
            //
            let responseLength, category, value;
            requestJson = {};
            responseLength = response.getElementsByTagName("category").length;
            console.log("max temperature");
            console.log(response);
            for (let i = 0; i < responseLength; i++) {
                category = response.getElementsByTagName("category")[i].innerHTML;
                value = response.getElementsByTagName("fcstValue")[i].innerHTML;
                if (category == "TMX") {
                    responseJson.temperatureMax = `${value}℃`;
                };
            };
            document.querySelector("#temperatureMax").innerText = responseJson.temperatureMax;
        } else if (requestJson.name == "getMinTemperature") {
            //
            // getMinTemperature
            //
            let responseLength, category, value;
            requestJson = {};
            responseLength = response.getElementsByTagName("category").length;
            console.log("min temperature");
            console.log(response);
            for (let i = 0; i < responseLength; i++) {
                category = response.getElementsByTagName("category")[i].innerHTML;
                value = response.getElementsByTagName("fcstValue")[i].innerHTML;
                if (category == "TMN") {
                    responseJson.temperatureMin = `${value}℃`;
                };
            };
            document.querySelector("#temperatureMin").innerText = responseJson.temperatureMin;
        } else if (requestJson.name == "getSunriseSunset") {
            //
            // getSunriseSunset
            //
            let sunrise, sunset;
            requestJson = {};
            console.log("sunrise and sunset");
            console.log(response);
            sunrise = response.getElementsByTagName("sunrise")[0].innerHTML.trim();
            sunset = response.getElementsByTagName("sunset")[0].innerHTML.trim();
            sunrise = editTimeInGoodFormat(sunrise);
            sunset = editTimeInGoodFormat(sunset);
            document.querySelector("#sunrise").innerText = sunrise;
            document.querySelector("#sunset").innerText = sunset;
        };
        responseJson.baseDateTime = `${editDateInGoodFormat(getBaseDateTime("ultra-short-term").baseDate)} ${editTimeInGoodFormat(getBaseDateTime("ultra-short-term").baseTime)} 발표`;
        document.querySelector("#baseDateTime").innerText = responseJson.baseDateTime;
    }).fail(function (errorThrown, status) {
        console.log(`errorThrown: ${errorThrown}\nstatus: ${status}`);
    });
}