from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.core.validators import RegexValidator
import uuid


class UserManager(BaseUserManager):
    def create_user(self, name, email, password=None, type=None, otp=None, otp_valid_till=None, otp_cooldown=None):
        """ Creates and saves a User with the given email, password and type"""
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            name=name,
            email=self.normalize_email(email),
            type=type,
            otp=otp,
            otp_valid_till=otp_valid_till,
            otp_cooldown=otp_cooldown
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, password=None):
        """ Creates and saves a superuser with the given email and password """
        user = self.create_user(
            name=name,
            email=self.normalize_email(email),
            password=password,
            type=User.Types.ADMIN
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    class Types(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        PROFESSOR = 'PROFESSOR', 'Professor'
        STAFF = 'STAFF', 'Staff'
        ADMIN = 'ADMIN', 'Admin'

    type         = models.CharField(max_length=10, choices=Types.choices, blank=True, null=True)
    email        = models.EmailField(max_length=255, unique=True)
    name         = models.CharField(max_length=255)
    otp          = models.CharField(max_length=6, blank=True, null=True)
    otp_valid_till = models.DateTimeField(blank=True, null=True)
    otp_attempts_remaining = models.IntegerField(default=3)
    otp_cooldown = models.DateTimeField(blank=True, null=True)
    is_verified  = models.BooleanField(default=False)

    is_active    = models.BooleanField(default=True)
    is_admin     = models.BooleanField(default=False)
    is_staff     = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email
    
    def profile(self):
        try:
            if self.type == User.Types.STUDENT:
                return self.student
            elif self.type == User.Types.PROFESSOR:
                return self.professor
            elif self.type == User.Types.STAFF:
                return self.staff
        except:
            pass
        return None

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True


MAX_NUMBER_OF_APPLICATIONS = 5

class Student(models.Model):

    PROGRAMS = [
        ('BTECH', 'Bachelor of Technology'),
        ('DUAL', 'Dual Degree - B.Tech + M.Tech'),
        ('MTECH', 'Master of Technology'),
        ('MSC', 'Master of Science'),
        ('MSR', 'Master of Science - Research'),
        ('MDES', 'Master of Design'),
        ('MBA', 'Master of Business Administration'),
        ('MPP', 'Master of Public Policy'),
        ('PGD', 'Post Graduate Diploma'),
        ('PHD', 'Doctor of Philosophy'),
    ]


    def resume_upload_path(instance, filename):
        return f'resumes/{uuid.uuid4()}/{filename}'
    
    def academic_transcript_upload_path(instance, filename):
        return f'academic_transcripts/{uuid.uuid4()}/{filename}'

    user         = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    entry_number = models.CharField(max_length=11, unique=True, validators=[RegexValidator(r'^20\d{2}[A-Z]{2}[0-9A-Z]\d{4}$')])
    entry_year   = models.CharField(max_length=4, blank=True)     # extracted from entry_number
    department   = models.CharField(max_length=2, blank=True)     # extracted from entry_number
    program      = models.CharField(max_length=100, choices=PROGRAMS)
    # TODO: program and full name of department to be extracted from entry_number
    cgpa         = models.DecimalField(max_digits=5, decimal_places=3)
    resume       = models.FileField(upload_to=resume_upload_path)
    academic_transcript = models.FileField(upload_to=academic_transcript_upload_path)
    is_verified  = models.BooleanField(default=False)
    # student should not be allowed to apply until is_verified is set to True by verifiers (staff)

    def __str__(self):
        return self.user.name
    
    def get_first_name(self):
        return self.user.name.split(' ')[0]

    def save(self, *args, **kwargs):
        self.user.type=User.Types.STUDENT
        self.entry_year = self.entry_number[:4]
        self.department = self.entry_number[4:6]
        return super(Student, self).save(*args, **kwargs)

    def verify_student(self):
        self.is_verified = True
        return self.save()



class Professor(models.Model):
    user          = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    university    = models.CharField(max_length=100)
    designation   = models.CharField(max_length=100)
    department    = models.CharField(max_length=100)
    contact_email = models.EmailField(max_length=255, blank=True, null=True)
    website       = models.URLField(max_length=255, blank=True, null=True)
    is_verified   = models.BooleanField(default=False)
    # prof should not be allowed to circulate offers until is_verified is set to True by verifiers (staff)

    def __str__(self):
        return self.user.name

    def get_first_name(self):
        return self.user.name.split(' ')[0]

    def save(self, *args, **kwargs):
        self.user.type=User.Types.PROFESSOR
        return super(Professor, self).save(*args, **kwargs)
    
    def verify_professor(self):
        self.is_verified = True
        return self.save()


class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.user.name

    def get_first_name(self):
        return self.user.name.split(' ')[0]

    def save(self, *args, **kwargs):
        self.user.type = User.Types.STAFF
        self.user.is_staff = True
        return super(Staff, self).save(*args, **kwargs)
