import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Base, User } from '../../share/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // readonly prefix= 'api/v1/'
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  login(params: Pick<User, 'password' | 'email'>): Observable<any> {
    return this.http
      .post(environment.apiUrl + `${this.prefix}auth/login`, params)
      .pipe(map((res: any) => res));
  }
  register(params: User): Observable<any> {
    return this.http
      .post(environment.apiUrl + `${this.prefix}auth/register`, params)
      .pipe(map((res: any) => res));
  }
  checkEmail(emailString: string): Observable<any> {
    const params = new HttpParams().set('email', emailString);
    // console.log(params)
    return this.http
      .put(environment.apiUrl + `${this.prefix}auth/register/1`, params)
      .pipe(map((res: any) => res));
  }
  logout(userId: string): Observable<any> {
    return this.http
      .delete(environment.apiUrl + `${this.prefix}auth/user/` + userId)
      .pipe(map((res: any) => res));
  }
}
