import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-full-footer',
  templateUrl: './full-footer.component.html',
  styleUrls: ['./full-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullFooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
