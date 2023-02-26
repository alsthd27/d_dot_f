from django.urls import path
from .d_utils import *
from .views import test

app_name = "utility"
urlpatterns = [
    path("test", test),
    path("create-vcode", create_vcode, name="create_vcode"),
    path("confirm-vcode", confirm_vcode, name="confirm_vcode"),
    path("update-dmd-cookie", update_dmd_cookie, name="update_dmd_cookie"),
    path("delete-expired-vcodes", delete_expired_vcodes, name="delete_expired_vcodes"),
    path("delete-inactive-users", delete_inactive_users, name="delete_inactive_users")
]
