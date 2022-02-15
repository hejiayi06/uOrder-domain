import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Base, UserAddress } from 'src/app/share/types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserAddressService {
  readonly prefix = 'api/v1/';
  constructor(private http: HttpClient) {}
  addAddress(address: UserAddress): Observable<Base<{ item: UserAddress }>> {
    return this.http
      .post(environment.apiUrl + `${this.prefix}account/address`, address)
      .pipe(map((res: any) => res));
  }
  getAddresses(): Observable<Base<{ items: UserAddress[] }>> {
    return this.http
      .get(environment.apiUrl + `${this.prefix}account/address`)
      .pipe(map((res: any) => res));
  }
  editAddress(
    addressId: number,
    address: UserAddress
  ): Observable<Base<{ item: UserAddress }>> {
    return this.http
      .put(
        environment.apiUrl + `${this.prefix}account/address/` + addressId,
        address
      )
      .pipe(map((res: any) => res));
  }
  setDefault(
    addressId: number,
    address: UserAddress
  ): Observable<Base<{ item: UserAddress }>> {
    return this.http
      .put(
        environment.apiUrl +
          `${this.prefix}account/address-setting/` +
          addressId,
        address
      )
      .pipe(map((res: any) => res));
  }
  deleteAddress(addressId: number): Observable<Base<any>> {
    return this.http
      .delete(environment.apiUrl + `${this.prefix}account/address/` + addressId)
      .pipe(map((res: any) => res));
  }
}
