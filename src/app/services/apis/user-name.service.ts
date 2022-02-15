import { NumberSymbol } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base, User } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserNameService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  getName(): Observable<Base<{ item: User }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}account/user`)
      .pipe(map((res: any) => res));
  }
  editName(
    userId: number,
    userName: Pick<User, 'first_name' | 'last_name'>
  ): Observable<Base<{ item: User }>> {
    return this.http
      .put(
        environment.apiUrl + `${this.prefix}account/user/` + userId,
        userName
      )
      .pipe(map((res: any) => res));
  }
}
