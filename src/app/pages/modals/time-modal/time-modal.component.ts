import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleTimeService } from 'src/app/services/apis/schedule-time.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { MessageService } from 'src/app/share/components/message/message.service';

@Component({
  selector: 'uo-time-modal',
  templateUrl: './time-modal.component.html',
  styleUrls: ['./time-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeModalComponent implements OnInit {
  loading: boolean = false;
  timeBtnChecked: 'ASAP' | 'Later' = 'ASAP';
  orderType!: string;
  timeStr: string = '';
  selectIndex: number = 0;
  timeList!: { item: Date }[][];
  constructor(
    public activeModal: NgbActiveModal,
    private scheduleServe: ScheduleTimeService,
    private messageServe: MessageService,
    private cdr: ChangeDetectorRef,
    private errorServe: ErrorsService
  ) {}
  ngOnInit(): void {}
  later(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const param = {
      order_type: this.orderType,
    };

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
      (err) => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
  saveTime(): void {
    this.activeModal.close(this.timeStr);
  }
}
