import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, EMPTY, mergeMap, Observable, of } from 'rxjs';
import { storageKeys } from 'src/app/share/configs';
import { Domain } from 'src/app/share/types';
import { DomainService } from '../apis/domain.service';
import { WindowService } from '../local/window.service';

@Injectable({
  providedIn: 'root',
})
export class DomainGuard implements Resolve<Domain> {
  constructor(
    private domainServe: DomainService,
    private winServe: WindowService
  ) {}
  resolve(): Observable<Domain> {
    return this.domainServe
      .postDomain({ Domain: window.location.hostname })
      .pipe(
        catchError((error) => {
          console.log('error :>> ', error);
          window.location.href = 'https://www.uorder.io';
          return EMPTY;
        }),
        mergeMap((domain) => {
          if (domain.data) {
            const d = domain.data.item;
            this.winServe.setLocalStorage(
              storageKeys.store,
              d.store_id.toString()
            );
            this.winServe.setLocalStorage(
              storageKeys.merchant,
              d.merchant_id.toString()
            );
            return of(d);
          } else {
            window.location.href = 'https://www.uorder.io';
            return EMPTY;
          }
        })
      );
  }
}
