import { Injectable } from '@angular/core';
import { DiningTime } from 'src/app/share/types';
import { HttpClient } from '@angular/common/http';
import { WindowService } from './window.service';
import { storageKeys } from 'src/app/share/configs';

@Injectable({
  providedIn: 'root',
})
export class DiningTimeService {
  constructor(public http: HttpClient,private winServe: WindowService,) {
  }
  detectDiningTime(diningTimes: DiningTime[]): boolean {
    const today = new Date();
    const week = today.getDay();
    let show = true;
    const res = diningTimes.map((dt) => {
      const scope = JSON.parse(dt.scope);
      const openHour = dt.open_hour.split(':');
      const closeHour = dt.close_hour.split(':');
      let open = new Date();
      let close = new Date();
      open.setHours(Number(openHour[0]),parseInt(openHour[1]),0);
      close.setHours(Number(closeHour[0]),parseInt(closeHour[1]),0);
      if (!scope[week]) {
        return false;
      } else {
        let now = new Date();
        now = new Date(now.toLocaleString('en', {timeZone: this.winServe.getLocalStorage(storageKeys.timeZone)?.toString()}));
        if(open>=now || close<=now){
          return false;
        }
        return true;
      }
    });
    if (!res.includes(true)) {
      console.log(res)
      show = false;
    }
    return show;
  }
}
