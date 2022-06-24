import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleTimeService } from 'src/app/services/apis/schedule-time.service';
import { MessageService } from 'src/app/share/components/message/message.service';

@Component({
  selector: 'uo-time-modal',
  templateUrl: './time-modal.component.html',
  styleUrls: ['./time-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeModalComponent implements OnInit {
  loading: boolean = false;
  orderScheduleValue!: {
    endHour: number;
    endMinute: number;
    note: string;
    startHour: number;
    startMinute: number;
  };
  restaurantName: string = '';
  timeBtnChecked: 'ASAP' | 'Later' = 'ASAP';
  orderType!: string;
  timeStr: string = '';
  selectIndex: number = 0;
  timeList!: Date[][];
  constructor(
    public activeModal: NgbActiveModal,
    private scheduleServe: ScheduleTimeService,
    private messageServe: MessageService,
    private cdr: ChangeDetectorRef,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {}
  later(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.scheduleServe.getSchedule().subscribe(
      (res) => {
        console.log('getSchedule :>> ', res);
        if (res.data) {
          this.timeList = res.data.values;
        } else {
          this.timeBtnChecked = 'ASAP';
          this.messageServe.warning('No available time!');
          this.timeList = [];
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
  saveTime(): void {
    const time = this.datepipe.transform(this.timeStr, 'M/d/yy, h:mm a');
    this.activeModal.close(this.time);
  }
}
