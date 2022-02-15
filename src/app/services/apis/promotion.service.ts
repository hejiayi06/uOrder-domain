import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  applyCoupon(coupon: any, merchantId: string): Observable<Base<any>> {
    const headers = new HttpHeaders().set('merchantId', merchantId);
    return this.http
      .post(environment.apiUrl + `${this.prefix}promotions/coupon`, coupon, {
        headers: headers,
      })
      .pipe(map((res: any) => res));
  }
  deleteCoupon(coupon: any, merchantId: string): Observable<Base<any>> {
    const headers = new HttpHeaders().set('merchantId', merchantId);
    return this.http
      .delete(
        environment.apiUrl + `${this.prefix}promotions/coupon/` + coupon,
        {
          headers: headers,
        }
      )
      .pipe(map((res: any) => res));
  }
}
