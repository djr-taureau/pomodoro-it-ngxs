import { TaskService } from './task-service';
import { PomoTimerService } from './pomo-timer';
import { TodoistTasksService } from './todoist-tasks';

export const services: any[] = [TaskService, PomoTimerService];

export * from './task-service';
