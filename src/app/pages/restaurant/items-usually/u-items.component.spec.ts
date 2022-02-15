import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UItemsComponent } from './u-items.component';

describe('UItemsComponent', () => {
  let component: UItemsComponent;
  let fixture: ComponentFixture<UItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
