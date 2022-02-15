import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Base, ShoppingCartItem, ShoppingCartRes } from 'src/app/share/types';
import { environment } from 'src/environments/environment';
import { Base64Service } from '../local/base64.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient, private base64Serve: Base64Service) {}
  renewShoppingCart(anonymousId: string): Observable<Base<any>> {
    return this.http
      .post(
        environment.apiUrl + `${this.prefix}shopping-cart/renew`,
        {},
        {
          headers: new HttpHeaders({
            // Store: this.base64Serve.encode64(storeId),
            anonymousId: anonymousId!,
          }),
        }
      )
      .pipe(map((res: any) => res));
  }
  // get all menu
  getShoppingCart(): Observable<Base<ShoppingCartRes>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}shopping-cart/cart`)
      .pipe(map((res: any) => res));
  }
  getAnonymousShoppingCart(
    anonymousId: string
  ): Observable<Base<ShoppingCartRes>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}shopping-cart/cart-anonymous`, {
        headers: new HttpHeaders({
          anonymousId: anonymousId,
          // storeId: store_id,
        }),
      })
      .pipe(map((res: any) => res));
  }

  // post shopping cart
  addToShoppingCart(form: any): Observable<Base<any>> {
    return this.http
      .post(environment.apiUrl + `${this.prefix}shopping-cart/cart`, form)
      .pipe(map((res: any) => res));
  }
  // post anonymous user shopping cart
  addToAnonymousShoppingCart(
    form: any,
    anonymousId: string
  ): Observable<Base<{ values: ShoppingCartItem[] }>> {
    console.log('anonymousId :>> ', anonymousId);
    return this.http
      .post(
        environment.apiUrl + `${this.prefix}shopping-cart/cart-anonymous`,
        form,
        {
          headers: new HttpHeaders({
            anonymousId: anonymousId,
          }),
        }
      )
      .pipe(map((res: any) => res));
  }
  // delete shopping cart item || delete all
  deleteShoppingCart(itemId: string): Observable<Base<any>> {
    return this.http
      .delete(environment.apiUrl + `${this.prefix}shopping-cart/cart/` + itemId)
      .pipe(map((res: any) => res));
  }
  deleteShoppingCartAll(): Observable<Base<any>> {
    return this.http
      .delete(environment.apiUrl + `${this.prefix}shopping-cart/cart/` + 0)
      .pipe(map((res: any) => res));
  }
  // delete shopping cart item || delete all
  deleteAnonymousShoppingCart(
    itemId: string,
    anonymousId: string
  ): Observable<Base<any>> {
    return this.http
      .delete(
        environment.apiUrl +
          `${this.prefix}shopping-cart/cart-anonymous/` +
          itemId,
        {
          headers: new HttpHeaders({
            anonymousId: anonymousId,
          }),
        }
      )
      .pipe(map((res: any) => res));
  }
  deleteAnonymousShoppingCartAll(anonymousId: string): Observable<Base<any>> {
    return this.http
      .delete(
        environment.apiUrl + `${this.prefix}shopping-cart/cart-anonymous/` + 0,
        {
          headers: new HttpHeaders({
            // Store: this.base64Serve.encode64(storeId),
            anonymousId: anonymousId,
          }),
        }
      )
      .pipe(map((res: any) => res));
  }
}
