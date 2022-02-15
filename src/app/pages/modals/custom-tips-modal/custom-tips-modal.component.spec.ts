import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTipsModalComponent } from './custom-tips-modal.component';

describe('CustomTipsModalComponent', () => {
  let component: CustomTipsModalComponent;
  let fixture: ComponentFixture<CustomTipsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomTipsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTipsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
