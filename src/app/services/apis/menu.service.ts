import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Base,
  Group,
  Item,
  // ItemGroup,
  // ItemGroups,
  // ItemItem,
} from 'src/app/share/types';
import { environment } from 'src/environments/environment';
import { Base64Service } from '../local/base64.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient, private base64Serve: Base64Service) {}

  // get all groups
  getMenuGroups(storeId: string): Observable<Base<{ items: Group[] }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}menu/menu-group/` + storeId, {
        headers: new HttpHeaders({
          Store: this.base64Serve.encode64(storeId),
        }),
      })
      .pipe(map((res: any) => res));
  }

  // get all menu
  getMenuGroupLists(storeId: string): Observable<Base<{ item: Group[] }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}menu/menu-list`, {
        headers: new HttpHeaders({
          Store: this.base64Serve.encode64(storeId),
        }),
      })
      .pipe(map((res: any) => res));
  }

  // get menu by group id
  getMenuGroupList(
    storeId: string,
    groupId: number
  ): Observable<Base<{ item: Group[] }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}menu/menu-list/${groupId}`, {
        headers: new HttpHeaders({
          Store: this.base64Serve.encode64(storeId),
        }),
      })
      .pipe(map((res: any) => res));
  }

  // get item by id
  getItem(storeId: string, itemId: number): Observable<Base<{ item: Item }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}menu/menu/${itemId}`, {
        headers: new HttpHeaders({
          Store: this.base64Serve.encode64(storeId),
        }),
      })
      .pipe(map((res: any) => res));
  }
}
