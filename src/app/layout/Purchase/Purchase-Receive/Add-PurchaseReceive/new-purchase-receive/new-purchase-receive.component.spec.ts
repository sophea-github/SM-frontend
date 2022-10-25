import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseReceiveComponent } from './new-purchase-receive.component';

describe('NewPurchaseReceiveComponent', () => {
  let component: NewPurchaseReceiveComponent;
  let fixture: ComponentFixture<NewPurchaseReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPurchaseReceiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPurchaseReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
