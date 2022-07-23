import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPrimeNgComponent } from './test-prime-ng.component';

describe('TestPrimeNgComponent', () => {
  let component: TestPrimeNgComponent;
  let fixture: ComponentFixture<TestPrimeNgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPrimeNgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPrimeNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
