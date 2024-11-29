from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView


urlpatterns = [  
    path('',                               views.get_routes,                               name="routes"),
    path('token/',                         MyTokenObtainPairView.as_view(),                name='token_obtain_pair'),
    path('token/refresh/',                 TokenRefreshView.as_view(),                     name='token_refresh'),
    path('logout/',                        views.logout_view,                              name='logout'),

    path('verify-otp/',                    views.verify_otp_view,                          name='verify_otp'),
    path('resend-otp/',                    views.resend_otp_view,                          name='resend_otp'),
    path('register/student/basic/',        views.pre_register_student_view,                name='pre-register-student'),
    path('register/student/additional/',   views.register_student_view,                    name='register-student'),
    path('register/professor/basic/',      views.pre_register_professor_view,              name='pre-register-professor'),
    path('register/professor/additional/', views.register_professor_view,                  name='register-professor'),

    path('user/',                          views.get_profile_view,                         name='get-profile'),
    path('user/update/',                   views.update_profile_view,                      name='update-profile'),
    path('user/delete/<email>/',           views.delete_user_view,                         name='delete-profile'),

    path('internship/create/',             views.create_internship_view,                   name='create-internship'),
    path('internship/update/',             views.update_internship_view,                   name='update-internship'),
    path('internship/delete/<int:id>/',    views.delete_internship_view,                   name='delete-internship'),
    path('internship/all/',                views.get_all_internships_view,                 name='get-all-internships'),
    path('internship/all/professor/',      views.get_all_internships_prof_view,            name='get-all-internships-professor'),
    path('internship/all/student/',        views.get_eligible_internships_student_view,    name='get-all-internships-student'),
    path('internship/all/applied/',        views.get_applied_internships_student_view,     name='get-applied-internships'),
    path('internship/all/shortlisted/',    views.get_shortlisted_internships_student_view, name='get-shortlisted-internships'),
    path('internship/<int:id>/',           views.get_internship_detail_view,               name='get-internship-detail'),
    path('internship/apply/',              views.apply_internship_view,                    name='apply-internship'),
    path('internship/unapply/',            views.unapply_internship_view,                  name='unapply-internship'),
    path('internship/shortlist/',          views.shortlist_internship_view,                name='shortlist-internship'),
    path('internship/unshortlist/',        views.unshortlist_internship_view,              name='unshortlist-internship'),

    path('notification/create/',           views.create_notification_view,                 name='create-notification'),
    path('notification/all/',              views.get_all_notifications_for_user_view,      name='get-unread-notifications'),
    path('notification/all-unread/',       views.get_unread_notifications_for_user_view,   name='get-unread-notifications'),
]