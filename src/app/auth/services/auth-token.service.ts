import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { map, filter, tap } from 'rxjs/operators';


@Injectable()
export class AuthTokenService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const dupReq = req.clone();
    return next.handle(dupReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // const elapsed = Date.now() - started;
          console.log('req url', req.urlWithParams);
          console.log('response event', event);
        }
        }, error => {
          console.error('the http error', error);
        })
    );
  }

  constructor() { }
}
