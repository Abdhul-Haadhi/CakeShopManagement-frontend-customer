import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../servises/cart/cart.service';
import { ProductDetailsService } from '../../servises/productDetails/product-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule,NgIf],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  product: any;
  quantity: number = 1;

  constructor(private route: ActivatedRoute,
    private productService: ProductDetailsService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.getProductById(productId);
    }
  }


  getProductById(id: any) {
    this.productService.getProductById(id).subscribe((response: any) => {
      this.product = response;

      console.log("this is the response:",response);
      

      this.product.processedImage = 'data:image/jpeg;base64,' + response.byteImage;
    })
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {

    const data = {
      productId: this.product.productId,
      quantity: this.quantity,
      sessionId: localStorage.getItem('cartId')
    }

    this.cartService.addToCart(data).subscribe(()=>{
      this.snackBar.open('Item Added to cart','Close',{duration:3000});
    })

  }


}
