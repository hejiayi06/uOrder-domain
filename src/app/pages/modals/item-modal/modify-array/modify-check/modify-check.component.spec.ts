import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCheckComponent } from './modify-check.component';

describe('ModifyCheckComponent', () => {
  let component: ModifyCheckComponent;
  let fixture: ComponentFixture<ModifyCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
