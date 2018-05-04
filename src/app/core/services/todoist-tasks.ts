import { TaskDetailComponent } from './../../tasks/components/task-detail';
import { GetTaskParameters } from './../../tasks/models/task';
import { Injectable, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap, map, concatMapTo, mergeMap, filter } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { Task, Comment, StrInt, Project } from '../../tasks/models/task';
import 'rxjs/add/observable/fromPromise';
import TodoistApiREST, { TodoistProject } from 'todoist-api-ts';
import { BinaryOperatorToken } from 'typescript';


@Injectable()
export class TodoistTasksService {
  project: any;
  projects: any;
  tasks: any;
  comments: any;
  foobar: any;




  //TODO Make an ENV variable for this
  api = new TodoistApiREST('33d002c531c8868f13535e7a57222d717e0ab5f4');

  constructor() {}

  getProject(id: StrInt): Observable<Project> {
    //
    return fromPromise<Project>(this.api.getProjectById(id))
    .pipe(map(project => project));
  }

  getAllTasks(): Observable<Task[]> {
    return fromPromise<Task[]>(this.api.getAllTasks());
  }

  searchTasks(term: string): Observable<Task[]> {
    return this.getAllTasks().pipe(
      map(tasks => tasks.filter(task => task.content.toLowerCase().indexOf(term.toLowerCase()) > -1)));
  }

  //TODO Back-up plan --- just pull in the tasks labeled "in progress"
  getTasksFiltered(params: {}): Observable<Task[]> {
    return fromPromise<Task[]>(
      this.api.getTasksFiltered({ label_id: 2149154882 }));
  }

  retrieveTask(id: StrInt): Observable<Task> {
    //
    const idToString = (id: StrInt) => id.toString();
    return fromPromise<Task>(this.api.getTaskById(id))
    .pipe(
      map(task => task));
    //this.foobar.map.set(idToString(`${id}`));
    //return this.foobar;
  }
  //task.id.toString()
  //concatMapTo(message, (time, msg) => `${time} ${msg}`);
  getTaskComments(projectId?: StrInt, taskId?: StrInt): Observable<Comment[]> {
    //
    return fromPromise<Comment[]>(this.api.getAllComments(taskId));
  }

  // createComment(taskId?: StrInt, content: string): Observable<Comment> {
  //   return fromPromise<Comment>(this.api.createComment(content, taskId));
  // }
}
