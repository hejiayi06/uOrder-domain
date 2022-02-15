import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  profile(): Observable<any> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}user/profile`)
      .pipe(map((res: any) => res));
  }
}
