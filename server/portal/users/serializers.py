from .models import User, Student, Professor, Staff
from rest_framework import serializers, fields

class StudentSerializer(serializers.ModelSerializer):
    name=serializers.CharField(source='user.name')
    email=serializers.CharField(source='user.email')
    program=serializers.CharField(source='get_program_display')
    department=serializers.SerializerMethodField()

    def get_department(self, obj):
        depts={
            'AM': 'Applied Mechanics',
            'BB': 'Biochemical Engineering and Biotechnology',
            'CH': 'Chemical Engineering',
            'CS': 'Computer Science and Engineering',
            'CE': 'Civil Engineering',
            'DD': 'Design',
            'EE': 'Electrical Engineering',
            'ES': 'Energy Engineering',
            'MS': 'Materials Engineering',
            'MT': 'Mathematics and Computing',
            'ME': 'Mechanical Engineering',
            'PH': 'Engineering Physics',
            'TT': 'Textile Technology'
        }
        if obj.department not in depts:
            return obj.department
        return depts[obj.department]

    class Meta:
        model = Student
        fields = [
            'name',
            'email',
            'entry_number',
            'entry_year',
            'department',
            'program',
            'cgpa',
            'resume',
            'academic_transcript',
        ]

class StudentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'cgpa',
            'resume',
            'academic_transcript',
        ]

class ProfessorSerializer(serializers.ModelSerializer):
    name=serializers.CharField(source='user.name')
    email=serializers.CharField(source='user.email')

    class Meta:
        model = Professor
        fields = [
            'name',
            'email',
            'university',
            'designation',
            'department',
            'contact_email',
            'website'
        ]


class ProfessorUpdateSerializer(serializers.ModelSerializer):
    name=serializers.CharField(source='user.name')

    class Meta:
        model = Professor
        fields = [
            'name',
            'university',
            'designation',
            'department',
            'contact_email',
            'website'
        ]


class StaffSerializer(serializers.ModelSerializer):
    name=serializers.CharField(source='user.name')
    email=serializers.CharField(source='user.email')

    class Meta:
        model = Staff
        fields = [
            'id',
            'name',
            'email',
        ]


class StaffUpdateSerializer(serializers.ModelSerializer):
    name=serializers.CharField(source='user.name')

    class Meta:
        model = Staff
        fields = [
            'name',
        ]