import os, sys

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from d_dot_f import settings
from .d_hangul import handle_hangul
import time, hmac, hashlib, base64, requests, json


ncp_access_key_id = getattr(settings, "NCP_ACCESS_KEY_ID", "NCP_ACCESS_KEY_ID")
ncp_secret_key = getattr(settings, "NCP_SECRET_KEY", "NCP_SECRET_KEY")
ncp_sens_sms_service_id = getattr(
    settings, "NCP_SENS_SMS_SERVICE_ID", "NCP_SENS_SMS_SERVICE_ID"
)
mgt_phone = getattr(settings, "MGT_PHONE", "MGT_PHONE")


def send_sms(dict_data):
    data = dict_data
    type = data["type"]
    if type == "sign up":
        phone_vcode = data["content"]["phone_vcode"]
        raw_content = f'[디닷에프] 휴대전화 번호 인증번호는 {handle_hangul(phone_vcode, "이에요예요", True)}!'
    service = init_service()
    from_no = mgt_phone
    to_no = "".join(filter(str.isalnum, data["phone"]))
    content = raw_content
    msg_data = {
        "type": "SMS",
        "countryCode": "82",
        "from": from_no,
        "contentType": "COMM",
        "content": content,
        "messages": [{"to": to_no}],
    }
    response = requests.post(
        service["sms_url"],
        data=json.dumps(msg_data),
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "x-ncp-apigw-timestamp": service["stime"],
            "x-ncp-iam-access-key": service["acc_key_id"],
            "x-ncp-apigw-signature-v2": service["d_hash"],
        },
    )
    return response.text


def init_service():
    sid = ncp_sens_sms_service_id
    sms_uri = f"/sms/v2/services/{sid}/messages"
    sms_url = f"https://sens.apigw.ntruss.com{sms_uri}"
    acc_key_id = ncp_access_key_id
    acc_sec_key = bytes(ncp_secret_key, "utf-8")
    stime = int(float(time.time()) * 1000)
    hash_str = f"POST {sms_uri}\n{stime}\n{acc_key_id}"
    digest = hmac.new(
        acc_sec_key, msg=hash_str.encode("utf-8"), digestmod=hashlib.sha256
    ).digest()
    d_hash = base64.b64encode(digest).decode()
    service = {
        "sms_url": sms_url,
        "stime": str(stime),
        "acc_key_id": acc_key_id,
        "d_hash": d_hash,
    }
    return service
