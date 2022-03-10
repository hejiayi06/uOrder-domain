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
    diningTimes.map((dt) => {
      const scope = JSON.parse(dt.scope);
      const openHour = dt.open_hour.split(':');
      const closeHour = dt.close_hour.split(':');
      if (!scope[week]) {
        show = false;
        return;
      } else {
        if (hour < parseInt(openHour[0]) || hour > parseInt(closeHour[0])) {
          show = false;
          return;
        } else if (hour == parseInt(openHour[0])) {
          if (minute < parseInt(openHour[1])) {
            show = false;
            return;
          } else if (minute == parseInt(openHour[1])) {
            if (second < parseInt(openHour[2])) {
              show = false;
              return;
            }
          }
        } else if (hour == parseInt(closeHour[0])) {
          if (minute > parseInt(closeHour[1])) {
            show = false;
            return;
          } else if (minute == parseInt(closeHour[1])) {
            if (second > parseInt(closeHour[2])) {
              show = false;
              return;
            }
          }
        }
      }
    });
    console.log('show :>> ', show);
    return show;
  }
}
