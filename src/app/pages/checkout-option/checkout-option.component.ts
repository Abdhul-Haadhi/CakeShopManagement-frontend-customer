import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-option',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './checkout-option.component.html',
  styleUrl: './checkout-option.component.scss'
})
export class CheckoutOptionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const customerId = localStorage.getItem('customerId');

    if (customerId) {
      this.router.navigate(['/checkout']);
    }
  }

  continueAsGuest() {
    localStorage.setItem('checkoutMode', 'guest');
    this.router.navigate(['/checkout']);
  }

  goToLogin() {
    localStorage.setItem('checkoutMode', 'customer');
    localStorage.setItem('redirectAfterLogin', '/checkout');
    this.router.navigate(['/login']);
    this.router.navigate(['/login']);
  }

}
