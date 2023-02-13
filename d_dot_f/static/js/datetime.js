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