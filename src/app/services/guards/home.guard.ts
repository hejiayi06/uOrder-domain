import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomainService } from '../apis/domain.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  flag!: boolean;
  // subject = new Subject<boolean>();
  constructor(
    private domainServe:DomainService,
    private router:Router
    ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> | boolean {

    // this.domainServe.domain('localhost').subscribe(
    // console.log('router.url :>> ', state.url);
    console.log('this.flag :>> ', this.flag);

    return this.checkDomain(window.location.hostname)
    // console.log('checkDomain object :>> ',this.checkDomain(window.location.hostname));

  }
  checkDomain(hostname:string):boolean {
    // let subject = new Subject<boolean>();

    this.domainServe.domain(hostname).subscribe(
      res=> {
        console.log('guard domain res :>> ', res);
        this.flag = false;
        // subject.next(false);
        this.router.navigate(['restaurant', res.data.store_id]);
        // console.log('res---flag :>> ', this.flag);
      },
      err => {
        this.flag = true;
        // console.log('err :>> ', err);
        // subject.next(true);
      }
    )
    return this.flag;
    // return subject.asObservable();
    // console.log('flag :>> ', this.flag);
    // return this.flag;
  }
}
