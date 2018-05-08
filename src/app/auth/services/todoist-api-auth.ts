import {NgxOAuthClient, DefaultHeaders, Configuration} from 'ngx-oauth-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';
import { environment } from '../../../../src/environments/environment';

@Configuration(environment.api)
@DefaultHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
})
export class TodoistApiAuth extends NgxOAuthClient {
 requestInterceptor(request) {
   const token = this.fetchToken('access_token');
   if (token) {
     return request.setHeaders({Authorization: 'Bearer ' + token});
   }
   return request;
 }

 errorInterceptor(request, error): Observable<any> {
  if (error.status === 401) {
    const refresh_token = this.fetchToken('refresh_token');
    if (!refresh_token) {
      return Observable.throw(error);
    }
    return this.getToken('refresh_token', {refresh_token}).switchMap(token => {
      localStorage.setItem('auth_token', JSON.stringify(token));
      return this.getClient().request(
        request.method,
        request.url,
        this.requestInterceptor(request.setHeaders({Authorization: 'Bearer ' + token}))
      );
    });
  }
  return Observable.throw(error);
  }
}
