import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../servises/cart/cart.service';
import { ProductDetailsService } from '../../servises/productDetails/product-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, NgIf],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  product: any;
  quantity: number = 1;

  selectedCustomizations: any[] = [];

  selectedFile: File | null = null;
  previewImage: string | null = null;


  constructor(private route: ActivatedRoute,
    private router: Router,
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

      console.log("Customizations:", response.customizations);

      this.product = response;

      console.log("this is the response:", response);


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

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.previewImage = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }



  uploadReferenceImage(custom: any, event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];

      this.previewImage = reader.result as string;

      const existing = this.selectedCustomizations.find(
        x => x.optionId === custom.optionId
      );

      if (existing) {
        existing.referenceImage = base64;
        existing.value = file.name;
      } else {
        this.selectedCustomizations.push({
          optionId: custom.optionId,
          optionName: custom.optionName,
          value: file.name,
          referenceImage: base64,
          extraPrice: custom.extraPrice
        });
      }

      console.log(this.selectedCustomizations);
    };

    reader.readAsDataURL(file);
  }


  toggleCustomization(custom: any, event: any) {
    if (event.target.checked) {
      this.selectedCustomizations.push({
        optionId: custom.optionId,
        optionName: custom.optionName,
        value: true,
        extraPrice: custom.extraPrice
      });
    }
    else {
      this.selectedCustomizations = this.selectedCustomizations.filter(
        x => x.optionId != custom.optionId
      );
    }
    console.log(this.selectedCustomizations)
  }

  updateCustomizationText(custom: any, event: any) {
    const value = event.target.value;

    const existing = this.selectedCustomizations.find(
      x => x.optionId === custom.optionId
    );

    if (existing) {
      existing.value = value;
    }
    else {
      this.selectedCustomizations.push({
        optionId: custom.optionId,
        optionName: custom.optionName,
        value: value,
        extraPrice: custom.extraPrice
      });
    }

    console.log(this.selectedCustomizations);
  }

  addToCart() {

    const data = {
      productId: this.product.productId,
      quantity: this.quantity,
      sessionId: localStorage.getItem('cartId'),
      customizations: this.selectedCustomizations
    }

    this.cartService.addToCart(data).subscribe({
      next: (response) => {
        this.cartService.updateCartCount();
        console.log("SUCCESS RESPONSE:", response);
        this.snackBar.open('Item Added to cart', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Item can not be dded to cart', 'Close', { duration: 3000 });
        // console.log("FULL ERROR:", error);
        // console.log("ERROR BODY:", error.error);
      }
    })

  }


  // buyNow() {

  //   const formData = new FormData();

  //   formData.append(
  //     "cartData",
  //     new Blob(
  //       [JSON.stringify({
  //         productId: this.product.productId,
  //         quantity: this.quantity,
  //         sessionId: localStorage.getItem('cartId'),
  //         customizations: this.selectedCustomizations
  //       })],
  //       { type: "application/json" }
  //     )
  //   );

  //   if (this.selectedFile) {
  //     formData.append("referenceImage", this.selectedFile);
  //   }

  //   console.log('BUY NOW DATA:', formData);
  //   this.cartService.addToCart(formData).subscribe({
  //     next: (response: any) => {
  //       localStorage.setItem('buyNowCartId', response.cartId);

  //       this.router.navigate(['/checkout']);
  //     }
  //   })
  // }


  buyNow() {
    const data = {

      productId: this.product.productId,
      quantity: this.quantity,
      sessionId: localStorage.getItem('cartId'),
      customizations: this.selectedCustomizations

    };

    console.log('BUY NOW DATA:', data);
    this.cartService.addToCart(data).subscribe({
      next: (response: any) => {
        localStorage.setItem('buyNowCartId', response.cartId);

        this.router.navigate(['/checkout']);
      }
    })
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
