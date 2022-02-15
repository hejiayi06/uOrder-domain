import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base, DeliveryFeeRes } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeliveryFeeService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  analysisDeliveryFee(destinations: {
    destinations: string;
  }): Observable<DeliveryFeeRes> {
    return this.http
      .post(
        environment.apiUrl + `${this.prefix}maps/distance-matrix`,
        destinations
      )
      .pipe(map((res: any) => res));
  }
}
