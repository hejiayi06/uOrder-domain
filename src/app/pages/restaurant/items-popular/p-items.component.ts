import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-p-items',
  templateUrl: './p-items.component.html',
  styleUrls: ['./p-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PItemsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
