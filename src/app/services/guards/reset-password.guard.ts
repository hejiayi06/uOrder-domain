import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { catchError, EMPTY, mergeMap, Observable, of } from 'rxjs';
import { ResetPasswordRes } from 'src/app/share/types';
import { AuthService } from '../apis/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordGuard implements Resolve<ResetPasswordRes> {
  constructor(private authServe: AuthService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<ResetPasswordRes> {
    console.log('route :>> ', route);
    const params = new HttpParams()
      .set('token', route.params['token'])
      .set('signature', route.params['signature']);
    return this.authServe.testTokenAndSignature(params).pipe(
      catchError(() => {
        this.router.navigate(['']);
        return EMPTY;
      }),
      mergeMap((auth) => {
        console.log('auth :>> ', auth);
        if (auth.data) {
          return of(auth.data);
        } else {
          this.router.navigate(['']);
          return EMPTY;
        }
      })
    );
  }
}
