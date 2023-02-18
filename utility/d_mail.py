import os, sys

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from d_dot_f import settings
from django.core.mail import send_mail as django_send_mail
from django.template.loader import render_to_string
from .d_hangul import handle_hangul


email_host_user = getattr(settings, "EMAIL_HOST_USER", "EMAIL_HOST_USER")


def send_mail(dict_data):
    data = dict_data
    type = data["type"]
    if type == "sign up":
        email_vcode = data["content"]["email_vcode"]
        subject = "[디닷에프] 이메일 주소를 인증해주세요!"
        message = f'회원가입 페이지에서 {handle_hangul(email_vcode, "을를", True)} 입력해주세요.'
        from_email = email_host_user
        recipient_list = [data["email"]]
        html_message = render_to_string(
            "mail_base.html",
            {
                "title": "이메일 주소를 인증해주세요!",
                "body": "회원가입 페이지에서 아래 인증번호를 입력해주세요.",
                "highlighted": email_vcode,
            },
        )
    response = django_send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=recipient_list,
        html_message=html_message,
    )
    return response
