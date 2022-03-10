import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base, ScheduleTime } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleTimeService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  getSchedule(): Observable<Base<{ values: Date[][] }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}shopping-cart/order-schedule`)
      .pipe(map((res: any) => res));
  }
}
