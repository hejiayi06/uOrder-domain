import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPasswordService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  editPassword(
    userId: number,
    password: {
      old_password: string;
      password: string;
      password_confirmation: string;
    }
  ): Observable<Base<any>> {
    return this.http
      .put(
        environment.apiUrl + `${this.prefix}account/password/` + userId,
        password
      )
      .pipe(map((res: any) => res));
  }
}
