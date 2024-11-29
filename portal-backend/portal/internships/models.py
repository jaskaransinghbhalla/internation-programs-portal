from django.db import models
from users.models import Professor, Student, User
from multiselectfield import MultiSelectField
from django.utils import timezone
import uuid

class Internship(models.Model):

    class Type(models.TextChoices):
        ONSITE = 'ONSITE', 'Onsite'
        REMOTE = 'REMOTE', 'Remote'
        HYBRID = 'HYBRID', 'Hybrid'
    
    class Departments(models.TextChoices):
        AM = 'AM', 'Applied Mechanics'
        BB = 'BB', 'Biochemical Engineering and Biotechnology'
        CH = 'CH', 'Chemical Engineering'
        CS = 'CS', 'Computer Science and Engineering'
        CE = 'CE', 'Civil Engineering'
        DD = 'DD', 'Design'
        EE = 'EE', 'Electrical Engineering'
        ES = 'ES', 'Energy Engineering'
        MS = 'MS', 'Materials Engineering'
        MT = 'MT', 'Mathematics and Computing'
        ME = 'ME', 'Mechanical Engineering'
        PH = 'PH', 'Engineering Physics'
        TT = 'TT', 'Textile Technology'


    professor            = models.ForeignKey(Professor, on_delete=models.CASCADE)
    title                = models.CharField(max_length=255)
    field                = models.CharField(max_length=255)
    description          = models.TextField(default='')
    expected_skills      = models.TextField(default='')
    no_of_offers         = models.PositiveIntegerField(default=1)
    stipend              = models.IntegerField(default=0)
    type                 = models.CharField(max_length=10, choices=Type.choices, default=Type.ONSITE)
    # duration             = models.PositiveIntegerField()
    application_deadline = models.DateField()
    start_date           = models.DateField()
    end_date             = models.DateField()
    eligible_departments = MultiSelectField(choices=Departments.choices, max_length=255, default=Departments.values)
    min_cgpa             = models.DecimalField(max_digits=5, decimal_places=3, default=7.000)
    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)
    # applied_students     = models.ManyToManyField(Student, related_name='internships_applied')
    # shortlisted_students = models.ManyToManyField(Student, related_name='internships_shortlisted')
    is_accepting         = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.application_deadline < timezone.now().date():
            raise ValueError('Application deadline cannot be in the past')
        if self.start_date < self.application_deadline:
            raise ValueError('Start date cannot be before application deadline')
        if self.end_date < self.start_date:
            raise ValueError('End date cannot be before start date')
        if self.min_cgpa < 0:
            raise ValueError('Minimum CGPA cannot be less than 0')
        if self.min_cgpa > 10:
            raise ValueError('Minimum CGPA cannot be greater than 10')
        if self.stipend < 0:
            raise ValueError('Stipend cannot be less than 0')
        return super().save(*args, **kwargs)


class Application(models.Model):
    def sop_upload_path(instance, filename):
        return f'sops/{uuid.uuid4()}/{filename}'

    student              = models.ForeignKey(Student, on_delete=models.CASCADE)
    internship           = models.ForeignKey(Internship, on_delete=models.CASCADE)
    statement_of_purpose = models.FileField(upload_to=sop_upload_path)
    is_shortlisted       = models.BooleanField(default=False)


class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    message   = models.TextField()
    sent_at   = models.DateTimeField(auto_now_add=True)
    is_read   = models.BooleanField(default=False)

    def __str__(self):
        if len(self.message) < 50:
            return self.message
        return self.message[:50]+'...'
    