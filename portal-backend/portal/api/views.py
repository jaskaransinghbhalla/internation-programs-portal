from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
import random
import re
from datetime import timedelta
from pytz import UTC

from users.models import User, Student, Professor, MAX_NUMBER_OF_APPLICATIONS
from users.serializers import StudentSerializer, StudentUpdateSerializer, ProfessorSerializer, ProfessorUpdateSerializer, StaffSerializer, StaffUpdateSerializer
from internships.models import Internship, Application, Notification
from internships.serializers import InternshipCreateSerializer, InternshipStudentSerializer, InternshipAllSerializer, InternshipUpdateSerializer, NotificationSerializer, NotificationAllSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adding custom claims:
        token['email'] = user.email
        token['usertype'] = user.type
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def get_routes(request):
    routes = [
        'api/token/',
        'api/token/refresh/',
        'api/logout/',
        'api/verify-otp/',
        'api/resend-otp/',
        'api/register/student/basic/',
        'api/register/student/additional/',
        'api/register/professor/basic/',
        'api/register/professor/additional/',
        'api/profile/',
        'api/profile/update/',
        'api/profile/delete/<email>',
        'api/internship/create/',
        'api/internship/update/',
        'api/internship/delete/<int:id>/',
        'api/internship/all/',
        'api/internship/all/professor/',
        'api/internship/all/student/',
        'api/internship/all/applied/',
        'api/internship/all/shortlisted/',
        'api/internship/<int:id>/',
        'api/internship/apply/',
        'api/internship/unapply/',
        'api/internship/shortlist/',
        'api/internship/unshortlist/',
        'api/notification/create/',
        'api/notification/all/',
        'api/notification/all-unread/',
    ]
    return Response(routes)


@api_view(['POST'])
def logout_view(request):
    """Blacklist the refresh token: extract token from the header
      during logout request user and refresh token is provided"""
    try:
        refresh_token=request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response("Successful Logout", status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(f"Logout Failed: {str(e)}", status=status.HTTP_400_BAD_REQUEST)



def send_otp_mail(otp, email):
    try:
        send_mail(
            subject='Welcome to IITD Internship Portal',
            message=f'Thank You for registering with us. Your OTP is {otp}. It is valid for 10 minutes.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )
    except:
        return Response("Something went wrong while sending email", status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_otp_view(request):
    """Verify the otp sent to the user"""
    data = request.data
    user=User.objects.get(email=data['email'])
    if user.profile() is not None: 
        return Response("User already registered", status=status.HTTP_400_BAD_REQUEST)
    if user.is_verified:
        return Response("User already verified", status=status.HTTP_400_BAD_REQUEST)
    if timezone.now() < user.otp_cooldown:
        return Response("Too many attempts, wait for a few minutes", status=status.HTTP_400_BAD_REQUEST)
    if timezone.now() > user.otp_valid_till:
        return Response("OTP Expired", status=status.HTTP_400_BAD_REQUEST)
    if data['otp'] != user.otp:
        user.otp_attempts_remaining -= 1
        if user.otp_attempts_remaining == 0:
            user.otp_cooldown = timezone.now() + timedelta(minutes=10)
            user.otp_attempts_remaining = 3
            user.save()
            return Response("OTP doesn't match. Too many attempts, wait for a 10 minutes", status=status.HTTP_400_BAD_REQUEST)
        user.save()
        return Response("OTP doesn't match", status=status.HTTP_400_BAD_REQUEST)
    user.is_verified=True
    user.save()
    return Response("OTP Verified", status=status.HTTP_200_OK)

@api_view(['POST'])
def resend_otp_view(request):
    otp=str(random.randint(100000,999999))
    email=request.data['email']
    try:
        user=User.objects.get(email=email)
    except:
        return Response("User doesn't exist", status=status.HTTP_400_BAD_REQUEST)
    if user.profile() is not None:
        return Response("User already registered", status=status.HTTP_400_BAD_REQUEST)
    if user.is_verified:
        return Response("User already verified", status=status.HTTP_400_BAD_REQUEST)
    if user.otp_cooldown > timezone.now():
        return Response("Too many attempts, wait for a few minutes", status=status.HTTP_400_BAD_REQUEST)
    send_otp_mail(otp, email)
    user.otp=otp
    user.otp_valid_till=timezone.now() + timedelta(minutes=10)
    user.otp_cooldown=timezone.now()
    user.otp_attempts_remaining=3
    user.save()
    return Response(email, status=status.HTTP_200_OK)

def pre_register(request, email, type):
    otp=str(random.randint(100000,999999))
    try:
        user=User.objects.get(email=email)
        if user.profile() is not None:
            return Response("User already registered", status=status.HTTP_400_BAD_REQUEST)
        if user.is_verified:
            return Response("User already verified", status=status.HTTP_400_BAD_REQUEST)
        if user.otp_cooldown > timezone.now():
            return Response("Too many attempts, wait for a few minutes", status=status.HTTP_400_BAD_REQUEST)
        send_otp_mail(otp, email)
        user.otp=otp
        user.otp_valid_till=timezone.now() + timedelta(minutes=10)
        user.otp_cooldown=timezone.now()
        user.otp_attempts_remaining=3
        user.save()
    except User.DoesNotExist:
        send_otp_mail(otp, email)
        user= User.objects.create_user(
            name=request.data['name'],
            email=email,
            password=request.data['password'],    # Password matching to be done in frontend
            otp=otp,
            otp_valid_till=timezone.now() + timedelta(minutes=10),
            otp_cooldown=timezone.now(),
            type=type,
        )
        user.save()
    return Response(email, status=status.HTTP_200_OK)

def register(profile, email, type):
    try:
        user=User.objects.get(email=email)
    except:
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
    if not user.is_verified:
        return Response("User not verified", status=status.HTTP_400_BAD_REQUEST)
    if user.type != type:
        return Response("User type not matching", status=status.HTTP_400_BAD_REQUEST)
    if user.profile() is not None:
        return Response("Profile already exists", status=status.HTTP_400_BAD_REQUEST)
    try:
        profile.user=user
        profile.save()
        Notification.objects.create(
            message=f"Welcome to IITD International Internship Portal, {user.name}! Your notifications will appear here.",
            recipient=user
        )
        return Response("Profile Created", status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(f"Profile Not Created: {str(e)}", status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def pre_register_student_view(request):
    """Recieve name, entry_number and password from user and send otp mail"""
    entry = request.data.get('entry_number', '')
    if re.fullmatch(r'20[0-9]{2}[A-Z]{2}[A-Z0-9][0-9]{4}', entry) is None:
        return Response("Invalid Entry Number", status=status.HTTP_400_BAD_REQUEST)
    email = entry[4:7].lower() + entry[2:4] + entry[7:] + "@iitd.ac.in"
    return pre_register(request, email, User.Types.STUDENT)

@api_view(['POST'])
def register_student_view(request):
    """Register a student"""
    data = request.data
    entry = data.get('entry_number', '')
    if re.fullmatch(r'20[0-9]{2}[A-Z]{2}[A-Z0-9][0-9]{4}', entry) is None:
        return Response("Invalid Entry Number", status=status.HTTP_400_BAD_REQUEST)
    email = entry[4:7].lower() + entry[2:4] + entry[7:] + "@iitd.ac.in"
    student= Student(
        entry_number=entry,
        program=data['program'],
        cgpa=data['cgpa'],
        resume=data['resume'],
        academic_transcript=data['academic_transcript'],
    )
    return register(profile=student, email=email, type=User.Types.STUDENT)


@api_view(['POST'])
def pre_register_professor_view(request):
    """Recieve name, email and password from user and send otp mail"""
    return pre_register(request, request.data['email'].lower(), User.Types.PROFESSOR)

@api_view(['POST'])
def register_professor_view(request):
    """Register a professor"""
    data = request.data
    professor= Professor(
        university=data['university'],
        department=data['department'],
        designation=data['designation'],
        contact_email=data.get('contact_email', None),
        website=data.get('website', None),
    )
    return register(profile=professor, email=data['email'].lower(), type=User.Types.PROFESSOR)




def authenticate_user(request):
    try:
        user = request.user
    except:
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
    if not user.is_verified:
        return Response("User not verified", status=status.HTTP_400_BAD_REQUEST)
    if user.profile() is None:
        return Response("Registration incomplete", status=status.HTTP_400_BAD_REQUEST)

def authenticate_and_verify_user(request):
    err=authenticate_user(request)
    if err is not None:
        return err
    if not request.user.profile().is_verified:
        return Response("Profile credentials not verified", status=status.HTTP_400_BAD_REQUEST)

def authenticate_and_verify_professor(request):
    err=authenticate_and_verify_user(request)
    if err is not None:
        return err
    if request.user.type != User.Types.PROFESSOR:
        return Response("Access denied: only a professor can perform this action", status=status.HTTP_400_BAD_REQUEST)

def authenticate_student(request):
    err=authenticate_user(request)
    if err is not None:
        return err
    if request.user.type != User.Types.STUDENT:
        return Response("Access denied: only a student can perform this action", status=status.HTTP_400_BAD_REQUEST)

def authenticate_and_verify_student(request):
    err=authenticate_and_verify_user(request)
    if err is not None:
        return err
    if request.user.type != User.Types.STUDENT:
        return Response("Access denied: only a student can perform this action", status=status.HTTP_400_BAD_REQUEST)

def authenticate_staff(request):
    err=authenticate_user(request)
    if err is not None:
        return err
    if request.user.type != User.Types.STAFF or request.user.type != User.Types.ADMIN:
        return Response("Access denied: only a staff member can perform this action", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_profile_view(request):
    """Get user details"""
    err=authenticate_user(request)
    if err is not None:
        return err
    if request.user.type == User.Types.STUDENT:
        serializer=StudentSerializer(request.user.profile())
    elif request.user.type == User.Types.PROFESSOR:
        serializer=ProfessorSerializer(request.user.profile())
    else:
        serializer=StaffSerializer(request.user.profile())
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_profile_view(request):
    """Update a student. If CGPA is updated, then is_verified set to False. Verifiers must verify again."""
    err=authenticate_user(request)
    if err is not None:
        return err
    if request.user.type == User.Types.STUDENT:
        serializer=StudentUpdateSerializer(request.user.profile(), data=request.data)
        if float(serializer.instance.cgpa)!=float(request.data['cgpa']):
            serializer.instance.is_verified=False
    elif request.user.type == User.Types.PROFESSOR:
        serializer=ProfessorUpdateSerializer(request.user.profile(), data=request.data)
    elif request.user.type == User.Types.STAFF or request.user.type == User.Types.ADMIN:
        return Response("To edit staff or admin, use admin portal", status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response("No user type", status=status.HTTP_400_BAD_REQUEST)
    if serializer.is_valid():
        try:
            serializer.instance.user.name=request.data['name']
            serializer.instance.user.save()
            serializer.save()
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        return Response("Updated Successfully", status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_user_view(request, email):
    """Delete a user"""
    try:
        user=User.objects.get(email=email)
    except:
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def create_internship_view(request):
    """Create an internship"""
    err=authenticate_and_verify_professor(request)
    if err is not None:
        return err
    prof=request.user.profile()
    serializer=InternshipCreateSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save(professor=prof)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_internship_view(request):
    """Update an internship"""
    err=authenticate_and_verify_professor(request)
    if err is not None:
        return err
    prof=request.user.profile()
    internship=Internship.objects.get(id=request.data['id'])
    if internship.professor != prof:
        return Response("Access denied: only the professor who created the internship can update it", status=status.HTTP_400_BAD_REQUEST)
    serializer=InternshipUpdateSerializer(internship, data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_internship_view(request, id):
    """Delete an internship"""
    err=authenticate_and_verify_professor(request)
    if err is not None:
        return err
    prof=request.user.profile()
    internship=Internship.objects.get(id=id)
    if internship.professor != prof:
        return Response("Access denied: only the professor who created the internship can delete it", status=status.HTTP_400_BAD_REQUEST)
    try:
        internship.delete()
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET'])
def get_all_internships_view(request):
    """Get all internships"""
    err=authenticate_staff(request)
    if err is not None:
        return err
    internships=Internship.objects.all()
    serializer=InternshipAllSerializer(internships, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_internships_prof_view(request):
    """Get all internships offered by a professor"""
    err=authenticate_and_verify_professor(request)
    if err is not None:
        return err
    prof=request.user.profile()
    internships=Internship.objects.filter(professor=prof)
    serializer=InternshipAllSerializer(internships, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_eligible_internships_student_view(request):
    """Get all internships for which a student is eligible to apply"""
    err=authenticate_student(request)
    if err is not None:
        return err
    student=request.user.profile()
    internships=Internship.objects.filter(
        ~Q(application__student=student),
        eligible_departments__contains=student.department,
        min_cgpa__lte=student.cgpa,
        is_accepting=True,
        application_deadline__gte=timezone.now().date(),
    )
    serializer=InternshipStudentSerializer(internships, many=True, context={'student': student})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_applied_internships_student_view(request):
    """Get all internships for which a student has applied"""
    err=authenticate_student(request)
    if err is not None:
        return err
    student=request.user.profile()
    internships=Internship.objects.filter(Q(application__student=student))
    serializer=InternshipStudentSerializer(internships, many=True, context={'student': student})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_shortlisted_internships_student_view(request):
    """Get all internships for which a student has been shortlisted"""
    err=authenticate_student(request)
    if err is not None:
        return err
    student=request.user.profile()
    internships=Internship.objects.filter(Q(application__student=student) & Q(application__is_shortlisted=True))
    serializer=InternshipStudentSerializer(internships, many=True, context={'student': student})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_internship_detail_view(request, id):
    """Get deatils of an internship according to the user type"""
    err=authenticate_and_verify_user(request)
    if err is not None:
        return err
    try:
        internship=Internship.objects.get(id=id)
    except:
        return Response("Internship not found", status=status.HTTP_400_BAD_REQUEST)
    if request.user.type == User.Types.PROFESSOR:
        if internship.professor != request.user.profile():
            return Response("Access denied: only the professor who created this internship can view it", status=status.HTTP_400_BAD_REQUEST)
        serializer=InternshipAllSerializer(internship)
    elif request.user.type == User.Types.STUDENT:
        serializer=InternshipStudentSerializer(internship, context={'student': request.user.profile()})
    else:
        serializer=InternshipAllSerializer(internship)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def apply_internship_view(request):
    """Apply for an internship"""
    err=authenticate_and_verify_student(request)
    if err is not None:
        return err
    student=request.user.profile()
    try:
        internship=Internship.objects.get(id=request.data['internship_id'])
    except:
        return Response("Internship not found", status=status.HTTP_400_BAD_REQUEST)
    if internship.application_deadline < timezone.now().date():
        return Response("Application deadline has passed", status=status.HTTP_400_BAD_REQUEST)
    if student.application_set.count() >= MAX_NUMBER_OF_APPLICATIONS:
        return Response(f"Student has already applied to max number of internships, which is {MAX_NUMBER_OF_APPLICATIONS}", status=status.HTTP_400_BAD_REQUEST)
    if not internship.is_accepting:
        return Response("Internship not accepting applications", status=status.HTTP_400_BAD_REQUEST)
    if student.department not in internship.eligible_departments:
        return Response("Student doesn't belong to eligible department", status=status.HTTP_400_BAD_REQUEST)
    if student.cgpa < internship.min_cgpa:
        return Response("Student doesn't meet minimum CGPA requirement", status=status.HTTP_400_BAD_REQUEST)
    application_set=Application.objects.filter(internship=internship, student=student)
    if application_set.exists():
        return Response("Student has already applied", status=status.HTTP_400_BAD_REQUEST)
    Application.objects.create(
        internship=internship,
        student=student,
        statement_of_purpose=request.data['statement_of_purpose']
    )
    if MAX_NUMBER_OF_APPLICATIONS==student.application_set.count():
        msg=f"You have successfully applied to internship '{internship.title}'. You can't apply to any more internships until you withdraw any previous application(s), as you have reached the limit of {MAX_NUMBER_OF_APPLICATIONS}."
    else:
        msg=f"You have successfully applied to internship '{internship.title}'. You can apply to {MAX_NUMBER_OF_APPLICATIONS-student.application_set.count()} more internships."
    Notification.objects.create(
        recipient=student.user,
        message=msg,
    )
    return Response("Application successful", status=status.HTTP_200_OK)


@api_view(['POST'])
def unapply_internship_view(request):
    """Unapply for an internship"""
    err=authenticate_and_verify_student(request)
    if err is not None:
        return err
    student=request.user.profile()
    try:
        internship=Internship.objects.get(id=request.data['internship_id'])
    except:
        return Response("Internship not found", status=status.HTTP_400_BAD_REQUEST)
    if internship.application_deadline < timezone.now().date():
        return Response("Application deadline has passed", status=status.HTTP_400_BAD_REQUEST)
    application_set=Application.objects.filter(internship=internship, student=student)
    if not application_set.exists():
        return Response("Student has not applied for this internship", status=status.HTTP_400_BAD_REQUEST)
    application=application_set.first()
    application.delete()
    Notification.objects.create(
        recipient=student.user,
        message=f"You have successfully withdrawn your application for internship '{internship.title}'. You can now apply to {MAX_NUMBER_OF_APPLICATIONS-student.application_set.count()} more internships.",
    )
    return Response("Application withdrawn successfully", status=status.HTTP_200_OK)


@api_view(['POST'])
def shortlist_internship_view(request):
    """Shortlist student for an internship"""
    err=authenticate_and_verify_professor(request)
    if err is not None:
        return err
    professor=request.user.profile()
    try:
        internship=Internship.objects.get(id=request.data['internship_id'])
    except:
        return Response("Internship not found", status=status.HTTP_400_BAD_REQUEST)
    if internship.professor != professor:
        return Response("Access denied: only the professor who created this internship can shortlist students", status=status.HTTP_400_BAD_REQUEST)
    try:
        user=User.objects.get(email=request.data['email'])
    except:
        return Response("Student user not found", status=status.HTTP_400_BAD_REQUEST)
    if not user.is_verified:
        return Response("Student user not verified", status=status.HTTP_400_BAD_REQUEST)
    if user.profile() is None:
        return Response("Student registration incomplete", status=status.HTTP_400_BAD_REQUEST)
    if not user.profile().is_verified:
        return Response("Student credentials not verified", status=status.HTTP_400_BAD_REQUEST)
    if user.type != User.Types.STUDENT:
        return Response("User is not a student", status=status.HTTP_400_BAD_REQUEST)
    student=user.profile()
    application_set=Application.objects.filter(internship=internship, student=student)
    if not application_set.exists():
        return Response("Student has not applied for this internship", status=status.HTTP_400_BAD_REQUEST)
    application=application_set[0]
    if application.is_shortlisted:
        return Response("Student has already been shortlisted", status=status.HTTP_400_BAD_REQUEST)
    application.is_shortlisted=True
    application.save()
    Notification.objects.create(
        recipient=student.user,
        message=f"Congrats! You have been shortlisted for the internship '{internship.title}' by Prof. {internship.professor.user.name}. Note that this is preliminary and revokable. You will be contacted by the professor if you are selected."
    )
    return Response("Student shortlisted successfully", status=status.HTTP_200_OK)


@api_view(['POST'])
def unshortlist_internship_view(request):
    """Remove student from shortlist for an internship"""
    err=authenticate_and_verify_professor(request)
    if err is not None:
        return err
    professor=request.user.profile()
    try:
        internship=Internship.objects.get(id=request.data['internship_id'])
    except:
        return Response("Internship not found", status=status.HTTP_400_BAD_REQUEST)
    if internship.professor != professor:
        return Response("Access denied: only the professor who created this internship can shortlist students", status=status.HTTP_400_BAD_REQUEST)
    try:
        user=User.objects.get(email=request.data['email'])
    except:
        return Response("Student user not found", status=status.HTTP_400_BAD_REQUEST)
    if not user.is_verified:
        return Response("Student user not verified", status=status.HTTP_400_BAD_REQUEST)
    if user.profile() is None:
        return Response("Student registration incomplete", status=status.HTTP_400_BAD_REQUEST)
    if not user.profile().is_verified:
        return Response("Student credentials not verified", status=status.HTTP_400_BAD_REQUEST)
    if user.type != User.Types.STUDENT:
        return Response("User is not a student", status=status.HTTP_400_BAD_REQUEST)
    student=user.profile()
    application_set=Application.objects.filter(internship=internship, student=student)
    if not application_set.exists():
        return Response("Student has not applied for this internship", status=status.HTTP_400_BAD_REQUEST)
    application=application_set[0]
    if not application.is_shortlisted:
        return Response("Student has not been shortlisted", status=status.HTTP_400_BAD_REQUEST)
    application.is_shortlisted=False
    application.save()
    Notification.objects.create(
        recipient=student.user,
        message=f"You have been removed from the shortlist for {internship.title}"
    )
    return Response("Student removed from shortlist successfully", status=status.HTTP_200_OK)
    

@api_view(['POST'])
def create_notification_view(request):
    """Create a notification"""
    notif=Notification(
        recipient=request.data['recipient_id'],
        message=request.data['message'],
    )
    notif.save()
    return Response("Notification created", status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_all_notifications_for_user_view(request):
    """Get all notifications for a user"""
    err=authenticate_user(request)
    if err is not None:
        return err
    user=request.user
    notifications=Notification.objects.filter(recipient=user)
    serializer=NotificationAllSerializer(notifications, many=True)
    notifications.update(is_read=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_unread_notifications_for_user_view(request):
    """Get all unread notifications for a user"""
    err=authenticate_user(request)
    if err is not None:
        return err
    user=request.user
    notifications=Notification.objects.filter(recipient=user, is_read=False)
    serializer=NotificationSerializer(notifications, many=True)
    notifications.update(is_read=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
