import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-simple-header',
  templateUrl: './simple-header.component.html',
  styleUrls: ['./simple-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
