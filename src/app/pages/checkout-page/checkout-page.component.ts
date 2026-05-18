import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../servises/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../servises/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, NgForOf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatButtonModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit {

  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  totalAmount = 0;
  quantity = 0;

  constructor(private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
  ) { }


  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email],
      address: ['', Validators.required],
      city: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      notes: [''],
      paymentMethod: ['COD'],
    });


    // const buyNowItem = localStorage.getItem('buyNowItem');

    // const storedItems = localStorage.getItem('checkoutItems');

    // if (buyNowItem) {
    //   this.cartItems = [JSON.parse(buyNowItem)];

    //   this.calculateTotal();
    // }
    // else if (storedItems) {
    //   this.cartItems = JSON.parse(storedItems);
    //   this.calculateTotal();
    // }
    // else {
    //   this.loadCart();
    // }

    const buyNowCartId = localStorage.getItem('buyNowCartId');
    const storedItems = localStorage.getItem('checkoutItems');

    if (buyNowCartId) {
      this.cartService.getCartItemById(buyNowCartId).subscribe((response: any) => {
        response.processedImg = 'data:image/jpeg;base64,' + response.productEntity.image;

        this.cartItems = [response];

        this.calculateTotal();
      });
    }

    else if (storedItems) {
      this.cartItems = JSON.parse(storedItems);

      this.calculateTotal();
    }
    else {
      this.loadCart();
    }
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.quantity = 0;

    this.cartItems.forEach((item: any) => {
      this.totalAmount += item.quantity * item.productEntity.price;

      this.quantity += item.quantity;
    });
  }


  loadCart() {
    this.cartService.getCartItems().subscribe((response: any) => {

      this.cartItems = response;
      // this.totalAmount = 0;

      console.log("Order Data: ", this.cartItems);

      this.cartItems.forEach((item: any) => {
        item.processedImg = 'data:image/jpeg;base64,' + item.productEntity.image;

        // this.totalAmount += item.quantity * item.productEntity.price;
      });
      this.calculateTotal();
    });
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      return;
    }

    const orderData = {
      ...this.checkoutForm.value,
      totalAmount: this.totalAmount,
      quantity: this.quantity,

      cartItemIds: this.cartItems.map(item => item.cartId),

      // sessionId: localStorage.getItem('cartId')
    };

    console.log("Order Data: ", orderData);

    this.orderService.placeOrder(orderData).subscribe({
      next: (response: any) => {
        console.log(response);

        this.snackBar.open('Order Placed Successfully!', 'Close', { duration: 3000 });

        localStorage.removeItem('buyNowItem');
        localStorage.removeItem('checkoutItems');
        localStorage.removeItem('buyNowCartId');

        this.router.navigate(['/']);
      },

      error: (error) => {
        console.log(error);

        this.snackBar.open('Failed to place order', 'Close', { duration: 3000 });
      }
    });

  }



}
