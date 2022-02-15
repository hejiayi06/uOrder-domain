import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Base, Domain } from 'src/app/share/types';
import { DomainService } from '../apis/domain.service';

@Injectable({
  providedIn: 'root'
})
export class HomeResolveService  {

  constructor(
    private domainServe:DomainService,
    private router:Router,
    ) { }
  resolve(route: ActivatedRouteSnapshot): number | null {
    // console.log('route :>> ', route);
    // console.log('route.paramMap :>> ', route.paramMap);
    // console.log('route.params :>> ', route.params);
    // console.log('window.location.hostname :>> ', window.location.hostname);
    let domainRes = true;
    let id = 0;
    this.domainServe.domain(window.location.hostname).subscribe(
      res=> {
        domainRes = false;
        console.log('guard domain res :>> ', res);
        // subject.next(false);
        // this.router.navigate(['restaurant', res.data.store_id]);
        id =  res.data.store_id
        // console.log('res---flag :>> ', this.flag);
      },
      err => {
        console.log('err :>> ', err);
        // this.router.navigate(['restaurant', res.data.store_id]);
      }

    )

    if(!domainRes) {
      this.router.navigate(['restaurant', id]);
      return id;
    } else {
      return null;
    }

  }
}
