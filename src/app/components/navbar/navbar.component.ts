import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../servises/cart/cart.service';
import { CustomerAuthService } from '../../servises/CustomerAuth/customer-auth.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIcon, CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  cartCount: number = 0;
  menuOpen = false;
  profileMenuOpen = false;
  isLoggedIn: boolean = false;


  constructor(private cartService: CartService,
    private router: Router,
    private customerAuthService: CustomerAuthService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    // this.loadCartCount();
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.cartService.updateCartCount();

    this.customerAuthService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    })
  }

  goToLogin() {
    localStorage.setItem('redirectAfterLogin', this.router.url);
    this.router.navigate(['/login']);
  }

  // checkLoginStatus() {
  //   this.isLoggedIn = !!localStorage.getItem('customerId')
  // }

  loadCartCount() {
    this.cartService.getCartItems().subscribe((response: any) => {
      this.cartCount = response.length;
    });
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }


  openEditProfile() {
    const customerId = localStorage.getItem('customerId');

    if (!customerId) {
      return;
    }

    this.customerAuthService.getCustomerById(customerId).subscribe((customer) => {
      this.dialog.open(EditProfileDialogComponent, {
        width: '600px',
        minHeight: '500px',
        data: customer,
        panelClass: 'custom-dialog-container'
      });
    });
    this.profileMenuOpen = false;
  }


  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result && !result.isConfirmed) {
        return;
      }

      this.customerAuthService.logout();
      this.profileMenuOpen = false;
      this.cartService.updateCartCount();
      this.router.navigate(['/']);
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.profile-menu')) {
      this.profileMenuOpen = false;
    }
  }

}
