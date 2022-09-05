import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChnageRateComponent } from './chnage-rate.component';

describe('ChnageRateComponent', () => {
  let component: ChnageRateComponent;
  let fixture: ComponentFixture<ChnageRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChnageRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChnageRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
