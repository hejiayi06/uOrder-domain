import { Injectable } from '@angular/core';
import { DiningTime } from 'src/app/share/types';
import { WindowService } from './window.service';
import { HttpClient } from '@angular/common/http';
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
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();
    let show = true;
    const res = diningTimes.map((dt) => {
      const scope = JSON.parse(dt.scope);
      const openHour = dt.open_hour.split(':');
      const closeHour = dt.close_hour.split(':');
      let open = new Date();
      let close = new Date();
      open.setHours(parseInt(openHour[0]),parseInt(openHour[1]),0);
      close.setHours(parseInt(closeHour[0]),parseInt(closeHour[1]),0);
      let tempOpen = open.toLocaleString('en', {timeZone: this.winServe.getLocalStorage(storageKeys.timeZone)?.toString()});
      let tempClose = close.toLocaleString('en', {timeZone: this.winServe.getLocalStorage(storageKeys.timeZone)?.toString()});
      if (!scope[week]) {
        return false;
      } else {
        if (hour < parseInt(openHour[0]) || hour > parseInt(closeHour[0])) {
          return false;
        } else if (hour == parseInt(openHour[0])) {
          if (minute < parseInt(openHour[1])) {
            return false;
          } else if (minute == parseInt(openHour[1])) {
            if (second < parseInt(openHour[2])) {
              return false;
            }
          }
        } else if (hour == parseInt(closeHour[0])) {
          if (minute > parseInt(closeHour[1])) {
            return false;
          } else if (minute == parseInt(closeHour[1])) {
            if (second > parseInt(closeHour[2])) {
              return false;
            }
          }
        }
        return true;
      }
    });
    if (!res.includes(true)) {
      show = false;
    }
    return show;
  }
}
