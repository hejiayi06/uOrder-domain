import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base, Checkout, CheckoutReq } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  getCheckout(body: CheckoutReq): Observable<Base<Checkout>> {
    return this.http
      .post(environment.apiUrl + `${this.prefix}shopping-cart/checkout`, body)
      .pipe(map((res: any) => res));
  }
  selectTips(tips: any): Observable<any> {
    return this.http
      .post(
        environment.apiUrl + `${this.prefix}shopping-cart/place-order`,
        tips
      )
      .pipe(map((res: any) => res));
  }
  placeOrder(placeOrder: any): Observable<any> {
    return this.http
      .post(
        environment.apiUrl + `${this.prefix}shopping-cart/place-order`,
        placeOrder
      )
      .pipe(map((res: any) => res));
  }
}
