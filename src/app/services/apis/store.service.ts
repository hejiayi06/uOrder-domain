import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Base, StoreRes } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}

  getStore(storeId: string): Observable<Base<StoreRes>> {
    const header = new HttpHeaders().set('storeId', storeId);
    return this.http
      .get(environment.apiUrl + `${this.prefix}stores/store/` + storeId, {
        headers: header,
      })
      .pipe(map((res: any) => res));
  }
  getStores(): Observable<Base<{ values: StoreRes[] }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}stores/store`)
      .pipe(map((res: any) => res));
  }
}
