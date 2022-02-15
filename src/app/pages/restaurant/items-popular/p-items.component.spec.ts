import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PItemsComponent } from './p-items.component';

describe('PItemsComponent', () => {
  let component: PItemsComponent;
  let fixture: ComponentFixture<PItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
