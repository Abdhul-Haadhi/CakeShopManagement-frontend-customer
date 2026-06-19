import { CommonModule, NgForOf, DatePipe } from '@angular/common';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../../components/payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, NgForOf, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, DatePipe, MatInputModule, MatRadioModule, MatButtonModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit {

  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  totalAmount = 0;
  quantity = 0;
  isButtonDisabled = false;
  submitted = false;
  minDate: Date;

  paymentId: number | null = null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
    private dialog: MatDialog
  ) {
    this.minDate = new Date();
  }


  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$'),]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'),]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(150),]],
      city: ['', [Validators.required, Validators.maxLength(100),]],
      deliveryDate: ['', [Validators.required,]],
      paymentMethod: ['COD', [Validators.required,]],

      // cardNumber: [''],
      // cardHolderName: [''],
      // expiryMonth: [''],
      // expiryYear: [''],
      // cvv: ['']
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
        response.processedImg = 'data:image/jpeg;base64,' + response.byteImage;

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
      // this.totalAmount += item.quantity * item.price;
      this.totalAmount += item.price;

      this.quantity += item.quantity;
    });
  }


  loadCart() {
    this.cartService.getCartItems().subscribe((response: any) => {

      this.cartItems = response;
      // this.totalAmount = 0;

      console.log("Order Data: ", this.cartItems);

      this.cartItems.forEach((item: any) => {
        item.processedImg = 'data:image/jpeg;base64,' + item.byteImage;

        // this.totalAmount += item.quantity * item.productEntity.price;
      });
      this.calculateTotal();
    });
  }

  placeOrder(paymentId?: number) {
    if (this.checkoutForm.invalid) {
      return;
    }

    if (this.checkoutForm.value.paymentMethod === 'CARD' && !this.paymentId) {
      this.snackBar.open('Please complete payment first', 'Close', { duration: 3000 });

      return;
    }

    const orderData = {
      ...this.checkoutForm.value,
      totalAmount: this.totalAmount,
      quantity: this.quantity,
      cartItemIds: this.cartItems.map(item => item.cartId),
      sessionId: localStorage.getItem('cartId'),
      paymentId: this.paymentId
    };

    console.log("Order Data: ", orderData);

    this.orderService.placeOrder(orderData).subscribe({
      next: (response: any) => {
        console.log(response);

        localStorage.removeItem('buyNowItem');
        localStorage.removeItem('checkoutItems');
        localStorage.removeItem('buyNowCartId');

        this.snackBar.open('Order Placed Successfully!', 'Close', { duration: 3000 });
        this.cartService.updateCartCount();

        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1000);

        // localStorage.removeItem('buyNowItem');
        // localStorage.removeItem('checkoutItems');
        // localStorage.removeItem('buyNowCartId');

        this.isButtonDisabled = true;


      },

      error: (error) => {
        console.log(error);

        this.snackBar.open('Failed to place order', 'Close', { duration: 3000 });
      }
    });

  }


  openPayment() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '500px',
      data: {
        totalAmount: this.totalAmount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Payment Success:", result);

        this.paymentId = result.paymentId;

        this.snackBar.open('Payment completed successfully', 'Close', { duration: 3000 });

        this.placeOrder(result.paymentId);
      }
    });

  }



  closeForm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result && !result.isConfirmed) {
        return;
      }
      this.router.navigate(['/']);
    });
  }



}
