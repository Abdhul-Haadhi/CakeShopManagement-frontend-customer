import { Component, OnInit } from '@angular/core';
import { CartService } from '../../servises/cart/cart.service';
import { NgForOf, NgIf } from "@angular/common";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NgForOf, NgIf, MatIcon, MatButtonModule, RouterLink, MatCheckboxModule, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {


  cartItems: any[] = [];
  order: any;
  totalAmount: number = 0;

  constructor(private cartService: CartService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.loadCart();
    localStorage.removeItem('buyNowItem');
    localStorage.removeItem('checkoutItems');
  }

  loadCart() {
    this.cartItems = [];
    this.totalAmount = 0;

    this.cartService.getCartItems().subscribe((response: any) => {
      console.log("CART RESPONSE:", response);

      response.forEach((element: any) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImage;

        element.selected = true;
        this.cartItems.push(element);

        this.calculateTotal();
      });
    })
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.cartItems.forEach(item => {
      if(item.selected){
        this.totalAmount += item.price * item.quantity;
      }
    });
  }

  goToCheckout(){
    const selectedItem = this.cartItems.filter(
      item => item.selected
    );

    localStorage.setItem('checkoutItems',JSON.stringify(selectedItem));
  }


  increaseQuantity(item: any) {
    item.quantity++;
    this.calculateTotal();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

  deleteItem(cartId: number) {

    this.cartService.deleteCartItem(cartId).subscribe({
      next: () => {
        this.snackBar.open('Item removed from cart', 'Close', { duration: 3000 });

        this.loadCart();
      },
      error: () => {
        this.snackBar.open('Failed to remove item', 'Close', { duration: 3000 });
      }
    });

    this.cartItems = this.cartItems.filter(
      item => item.cartId !== cartId
    );
    this.calculateTotal();
  }


}


