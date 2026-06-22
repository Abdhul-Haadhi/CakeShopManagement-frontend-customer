import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../servises/order/order.service';
import { CartService } from '../../servises/cart/cart.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {

  orders: any[] = [];
  selectedPreviewImage: string = '';

  @ViewChild('imagePreviewDialog') imagePreviewDialog!: TemplateRef<any>;
  constructor(private orderService: OrderService,
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const sessionId = localStorage.getItem('cartId');

    this.orderService.getOrders(sessionId).subscribe((response: any) => {
      console.log("RAW RESPONSE:", response);
      this.orders = response;

      console.log("getting orders:", this.orders);
    })
  }

  openImageLightbox(base64String: string) {
    this.selectedPreviewImage = base64String;
    this.dialog.open(this.imagePreviewDialog, {
      panelClass: 'lightbox-dialog-wrapper',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }

}
