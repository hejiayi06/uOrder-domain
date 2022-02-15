import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyBagModalComponent } from './empty-bag-modal.component';

describe('EmptyBagModalComponent', () => {
  let component: EmptyBagModalComponent;
  let fixture: ComponentFixture<EmptyBagModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyBagModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyBagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
