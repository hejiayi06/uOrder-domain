import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
