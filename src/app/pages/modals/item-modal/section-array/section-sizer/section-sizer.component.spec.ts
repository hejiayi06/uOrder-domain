import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSizerComponent } from './section-sizer.component';

describe('SectionSizerComponent', () => {
  let component: SectionSizerComponent;
  let fixture: ComponentFixture<SectionSizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionSizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionSizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
