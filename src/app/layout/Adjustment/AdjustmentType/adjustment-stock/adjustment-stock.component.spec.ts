import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentStockComponent } from './adjustment-stock.component';

describe('AdjustmentStockComponent', () => {
  let component: AdjustmentStockComponent;
  let fixture: ComponentFixture<AdjustmentStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
