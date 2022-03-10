import { Injectable } from '@angular/core';
import { DiningTime } from 'src/app/share/types';

@Injectable({
  providedIn: 'root',
})
export class DiningTimeService {
  detectDiningTime(diningTimes: DiningTime[]): boolean {
    console.log('123 :>> ', 123);
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
    if (res.every((a) => a == false)) {
      show = false;
    }
    return show;
  }
}
