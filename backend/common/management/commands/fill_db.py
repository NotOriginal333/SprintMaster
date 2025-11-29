import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from projects.models import Project
from sprints.models import Sprint
from tasks.models import Task, BugReport

User = get_user_model()


class Command(BaseCommand):
    help = "Populates the database with dummy data for testing"

    def handle(self, *args, **options):
        self.stdout.write('Deleting old data...')
        Task.objects.all().delete()
        Sprint.objects.all().delete()
        Project.objects.all().delete()
        # User.objects.exclude(is_superuser=True).delete()

        self.stdout.write('Creating Users...')
        roles = ['PM', 'DEV', 'QA']
        users = []
        for i in range(5):
            role = random.choice(roles)
            u = User.objects.create_user(
                username=f'user_{role.lower()}_{i}',
                email=f'user{i}@test.com',
                password='password123',
                role=role,
                first_name=f'Name{i}',
                last_name=f'Surname{i}'
            )
            users.append(u)

        admin = User.objects.filter(is_superuser=True).first() or users[0]

        self.stdout.write('Creating Projects...')
        projects = []
        for i in range(3):
            p = Project.objects.create(
                name=f'Project Alpha {i + 1}',
                description=f'This is a test project description {i + 1}',
                start_date=timezone.now().date(),
                manager=admin,
                status=random.choice(['ACTIVE', 'ON_HOLD'])
            )
            p.members.set(users)
            projects.append(p)

        self.stdout.write('Creating Sprints & Tasks...')
        for project in projects:

            s1 = Sprint.objects.create(
                name='Sprint #1 (Closed)',
                project=project,
                start_date=timezone.now().date() - timedelta(days=14),
                end_date=timezone.now().date() - timedelta(days=1),
                is_active=False
            )

            s2 = Sprint.objects.create(
                name='Sprint #2 (Active)',
                project=project,
                start_date=timezone.now().date(),
                end_date=timezone.now().date() + timedelta(days=14),
                is_active=True
            )

            for j in range(10):
                task_status = random.choice(Task.Status.values)
                t = Task.objects.create(
                    title=f'Task {j} for {project.name}',
                    description='Lorem ipsum dolor sit amet...',
                    project=project,
                    sprint=s2,
                    assignee=random.choice(users),
                    status=task_status,
                    priority=random.choice(Task.Priority.values),
                    story_points=random.choice([1, 2, 3, 5, 8])
                )

                if j % 3 == 0:
                    BugReport.objects.create(
                        title=f'Bug in {t.title}',
                        description='Something went wrong here...',
                        project=project,
                        task=t,
                        reporter=random.choice(users),
                        status='NEW',
                        priority='HIGH'
                    )

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))