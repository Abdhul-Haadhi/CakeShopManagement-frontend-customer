import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { CartService } from '../../servises/cart/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIcon, CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  cartCount: number = 0;
  menuOpen = false;


  constructor(private cartService:CartService){

  }

  ngOnInit(): void {
    // this.loadCartCount();
    this.cartService.cartCount$.subscribe(count=>{
      this.cartCount = count;
    });

    this.cartService.updateCartCount();
  }


  loadCartCount(){
    this.cartService.getCartItems().subscribe((response:any)=>{
      this.cartCount = response.length;
    });
  }

}
