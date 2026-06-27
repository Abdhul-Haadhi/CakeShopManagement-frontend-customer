import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutOptionComponent } from './checkout-option.component';

describe('CheckoutOptionComponent', () => {
  let component: CheckoutOptionComponent;
  let fixture: ComponentFixture<CheckoutOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckoutOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
