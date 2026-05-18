import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeatureProductsService } from '../../servises/featureProducts/feature-products.service';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../servises/cart/cart.service';


@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatCardModule, MatDividerModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent implements OnInit {

  menuOpen = false;
  products: any[] = [];
  searchProductForm!: FormGroup;


  constructor(private productService: FeatureProductsService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {

    this.getAllProducts();

    this.searchProductForm = this.fb.group({
      title: [null]
    });

    localStorage.removeItem('buyNowItem');
    localStorage.removeItem('checkoutItems');
  }


  onSubmit() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.productService.getAllProductsByName(title).subscribe(response => {
      response.forEach((element: any) => {
        element.processedImage = 'data:image/jpeg;base64,' + element.byteImage;
        this.products.push(element);
      })
    })
  }


  getAllProducts() {
    this.products = [];
    this.productService.getAllProducts().subscribe(response => {
      response.forEach((element: any) => {
        element.processedImage = 'data:image/jpeg;base64,' + element.byteImage;
        this.products.push(element);
      })
    })
  }


  addToCart(productId: number) {
    const sessionId = this.cartService.getCartId();

    const data = {
      productId: productId,
      quantity: 1,
      sessionId: sessionId
    };

    this.cartService.addToCart(data).subscribe({
      next:(response)=>{
        console.log("Added to cart", response);

        this.snackBar.open("Product added to cart!",'Close',{duration:5000});
      },
      error:(error)=>{
        console.log(error);

        this.snackBar.open('Failed to add Product','Close',{duration:5000});
      }
    });

  }

  public refreshData(): void {
    this.products = [];               // optinal
    this.searchProductForm.reset();
    this.getAllProducts();
  }


}
