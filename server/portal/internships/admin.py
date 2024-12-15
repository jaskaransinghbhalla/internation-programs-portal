from django.contrib import admin
from .models import Internship, Application, Notification

class InternshipAdmin(admin.ModelAdmin):
    list_display = ('title', 'professor', 'created_at',)
    search_fields = ('title', 'professor__user__name')
    ordering = ('-created_at',)

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'internship',)
    search_fields = ('student__user__name', 'internship__title',)

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', '__str__', 'sent_at')
    search_fields = ('message', 'recipient__name')
    ordering = ('-sent_at',)


admin.site.register(Internship, InternshipAdmin)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(Notification, NotificationAdmin)
