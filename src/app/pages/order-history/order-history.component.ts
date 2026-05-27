import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../servises/order/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, MatCardModule, MatButtonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService,
  ) { }


  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(){
    const sessionId = localStorage.getItem('cartId');

    this.orderService.getOrders(sessionId).subscribe((response:any)=>{
      this.orders = response;

      console.log("getting orderss:",this.orders);
    })
  }

}
