import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base, Checkout, CheckoutReq } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

var md5 = require('md5');
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
    let temp = placeOrder;
    let t = new Date().getTime();
    console.log(new Date(t).toUTCString());
    let s = t.toString() + (localStorage.getItem('storeId') as any).toString();
    temp[md5(s).replace(/[^a-zA-Z]/g, '')] = md5(md5(s).replace(/[^a-zA-Z]/g, '') + (localStorage.getItem('storeId') as any).toString())
    const headers = new HttpHeaders().set('AppId', t.toString());
    return this.http
      .post(
        environment.apiUrl + `${this.prefix}shopping-cart/place-order`,
        placeOrder
        , {
          headers: headers,
        }
      )
      .pipe(map((res: any) => res));
  }
}
