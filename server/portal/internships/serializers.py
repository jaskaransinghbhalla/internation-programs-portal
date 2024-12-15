from .models import Internship, Application, Notification
from rest_framework import serializers, fields
from users.serializers import StudentSerializer, ProfessorSerializer


class InternshipApplicationSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'student', 'statement_of_purpose', 'is_shortlisted']


class InternshipCreateSerializer(serializers.ModelSerializer):
    eligible_departments = fields.MultipleChoiceField(choices=Internship.Departments.choices, default=Internship.Departments.values)

    class Meta:
        model = Internship
        fields = [
            'title',
            'field',
            'description',
            'expected_skills',
            'type',
            'start_date',
            'end_date',
            'application_deadline',
            'stipend',
            'no_of_offers',
            'eligible_departments',
            'min_cgpa'
        ]


class InternshipStudentSerializer(serializers.ModelSerializer):
    professor = ProfessorSerializer(read_only=True)
    has_applied = serializers.SerializerMethodField()
    application = serializers.SerializerMethodField()
    type = serializers.CharField(source='get_type_display')

    def get_has_applied(self, obj):
        return obj.application_set.filter(student=self.context['student']).exists()

    def get_application(self, obj):
        if self.get_has_applied(obj):
            return InternshipApplicationSerializer(obj.application_set.get(student=self.context['student'])).data
        return None

    class Meta:
        model = Internship
        fields = '__all__'


class InternshipAllSerializer(serializers.ModelSerializer):
    professor = ProfessorSerializer(read_only=True)
    applications = serializers.SerializerMethodField()
    type = serializers.CharField(source='get_type_display')

    def get_applications(self, obj):
        return InternshipApplicationSerializer(obj.application_set.all(), many=True).data

    class Meta:
        model = Internship
        fields = '__all__'


class InternshipUpdateSerializer(serializers.ModelSerializer):
    eligible_departments = fields.MultipleChoiceField(choices=Internship.Departments.choices, default=Internship.Departments.values)

    class Meta:
        model = Internship
        fields = [
            'title',
            'field',
            'description',
            'expected_skills',
            'type',
            'start_date',
            'end_date',
            'application_deadline',
            'stipend',
            'no_of_offers',
            'eligible_departments',
            'min_cgpa',
            # 'is_accepting'
        ]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'sent_at']


class NotificationAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'