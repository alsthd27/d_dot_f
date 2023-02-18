from django.http import JsonResponse
from django.utils import timezone
from member.models import Vcode
from .d_discord import send_msg
from .d_mail import send_mail
from .d_sms import send_sms
import json, re, datetime, random, string


def create_vcode(request):
    if request.method == "POST":
        raw_data = json.loads(request.body)
        if validation(raw_data, "sign up"):
            student_id = parse_json(raw_data, "student_id")
            email = parse_json(raw_data, "email")
            phone = parse_json(raw_data, "phone")
            email_vcode = ""
            phone_vcode = ""
            will_expire_on = timezone.now() + datetime.timedelta(minutes=20)
            for i in range(6):
                email_vcode += random.choice(string.digits)
                phone_vcode += random.choice(string.digits)
            try:
                vcode = Vcode.objects.get(student_id=student_id)
                vcode.delete()
            except:
                pass
            Vcode.objects.create(
                student_id=student_id,
                email_vcode=email_vcode,
                phone_vcode=phone_vcode,
                will_expire_on=will_expire_on,
            )
            data_to_send = {
                "type": "sign up",
                "email": email,
                "phone": phone,
                "content": {"email_vcode": email_vcode, "phone_vcode": phone_vcode},
            }
            mail_response = send_mail(data_to_send)
            sms_response = json.loads(send_sms(data_to_send))
            status = (
                "vcode created and sent via mail, sms"
                if mail_response == 1 and sms_response["statusCode"] == "202"
                else "vcode created and sent via mail"
                if mail_response == 1
                else "vcode created and sent via sms"
                if sms_response["statusCode"] == "202"
                else "vcode created but not sent"
            )
            context = {"status": status}
        else:
            context = {"status": "server-side validation failed"}
            send_msg(request, "server-side validation failed")
    else:
        context = {"status": "unexpected request"}
        send_msg(request, "unexpected request")
    return JsonResponse(context)


def confirm_vcode(request):
    if request.method == "POST":
        raw_data = json.loads(request.body)
        if validation(raw_data, "sign up"):
            student_id = parse_json(raw_data, "student_id")
            email_vcode = parse_json(raw_data, "email_vcode")
            phone_vcode = parse_json(raw_data, "phone_vcode")
            try:
                vcode = Vcode.objects.get(
                    student_id=student_id,
                    email_vcode=email_vcode,
                    phone_vcode=phone_vcode,
                )
                context = {"status": "vcode confirmed"}
                vcode.delete()
            except:
                context = {"status": "invalid vcode"}
        else:
            context = {"status": "server-side validation failed"}
            send_msg(request, "server-side validation failed")
    else:
        context = {"status": "unexpected request"}
        send_msg(request, "unexpected request")
    return JsonResponse(context)


def validation(
    dict_raw_data,
    str_validation_type,
):
    data = dict_raw_data
    type = str_validation_type
    result = False
    if type == "sign up":
        agree = parse_json(data, "agree")
        student_id = parse_json(data, "student_id")
        name = parse_json(data, "name")
        email = parse_json(data, "email")
        phone = "".join(filter(str.isalnum, parse_json(data, "phone")))
        try:
            if (
                agree == "true"
                and student_id[4:7] == "113"
                and reg_test(student_id, "number")
                and reg_test(name, "hangul")
                and reg_test(email, "email")
                and reg_test(phone, "number")
            ):
                result = True
        except:
            pass
    boolean_result = result
    return boolean_result


def parse_json(dict_raw_data, str_key):
    str_value = json.dumps(dict_raw_data[str_key], ensure_ascii=False).strip('"')
    return str_value


def reg_test(str_raw_data, str_test_type):
    data = str_raw_data
    type = str_test_type
    reg_hangul = re.compile("[가-힣]+")
    reg_number = re.compile("[0-9]")
    reg_email = re.compile(
        "^[0-9a-zA-Z]([\-.\w]*[0-9a-zA-Z\-_+])*@([0-9a-zA-Z][\-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$"
    )
    try:
        if type == "hangul":
            tested_data = "".join(re.findall(reg_hangul, data))
        elif type == "number":
            tested_data = "".join(re.findall(reg_number, data))
        elif type == "email":
            tested_data = reg_email.match(data).group()
    except:
        tested_data = None
    if data == tested_data:
        result = True
    else:
        result = False
    boolean_result = result
    return boolean_result
