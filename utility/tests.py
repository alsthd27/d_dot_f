from django.test import TestCase
import requests


def test_get_dmd_cookie():
    session = requests.session()
    response = session.get("https://dgufilm.link/get-dmd-cookie")
    return print(response.text)


test_get_dmd_cookie()