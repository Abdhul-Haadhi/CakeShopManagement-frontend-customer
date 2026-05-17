import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from './servises/cart/cart.service';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private cartService: CartService){}


  title = 'Cakeshop-customer-frontend';
}
