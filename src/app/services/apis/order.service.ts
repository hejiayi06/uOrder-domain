import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base, OrderItem, OrderStatus, PageBase } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  getOrderStatus(orderId: string): Observable<OrderStatus> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}orders/order-status/` + orderId)
      .pipe(map((res: any) => res));
  }
  getOrdersList(): Observable<Base<PageBase<OrderStatus[]>>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}orders/order-list`)
      .pipe(map((res: any) => res));
  }
  getOrdersListByPage(page: string): Observable<Base<PageBase<OrderStatus[]>>> {
    return this.http.get(page).pipe(map((res: any) => res));
  }
  getOrderItem(orderId: number): Observable<OrderItem> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}orders/order-item/` + orderId)
      .pipe(map((res: any) => res));
  }
}
