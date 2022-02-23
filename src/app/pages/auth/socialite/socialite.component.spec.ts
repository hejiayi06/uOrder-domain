import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialiteComponent } from './socialite.component';

describe('SocialiteComponent', () => {
  let component: SocialiteComponent;
  let fixture: ComponentFixture<SocialiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
