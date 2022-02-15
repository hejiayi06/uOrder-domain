
  import { Injectable } from '@angular/core';
  import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
  import { EMPTY, of } from 'rxjs';
  import { mergeMap } from 'rxjs/operators';
  import { Item } from 'src/app/share/types';
  import { MenuService } from '../apis/menu.service';

  @Injectable({ providedIn: 'root' })
  export class ItemResolveService implements Resolve<Item> {
    constructor(
      private menuServe: MenuService,
    ) {

    }
    resolve(route: ActivatedRouteSnapshot): any {
      // console.log('route.paramMap :>> ', route.paramMap);
      // console.log('route.params :>> ', route.params);
       this.menuServe.getItem(route.paramMap.get('restaurantId')!,parseInt(route.paramMap.get('item')!)).pipe(
         mergeMap(res => {
           if(res) {
             return of(res)

           } else {
             return EMPTY;
           }
         })
       )
    }
  }
