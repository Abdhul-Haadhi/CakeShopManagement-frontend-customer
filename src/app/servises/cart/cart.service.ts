import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private platformId = inject(PLATFORM_ID);

  private cartCountSource = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSource.asObservable();

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.createCartSession();
    }
  }

  createCartSession(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let sessionId = localStorage.getItem('cartId');

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      localStorage.setItem('cartId', sessionId);

      console.log('New Cart Session Created:', sessionId);

    }
  }

  getCartId(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('cartId');
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/public/cart', data);

  }

  getCartItems() {
    const sessionId = this.getCartId();

    return this.http.get(BASIC_URL + `api/public/cart/${sessionId}`);
  }

  getCartItemById(cartId: any) {
    return this.http.get(`${BASIC_URL}api/public/cart/item/${cartId}`);
  }

  updateQuantity(cartId: number, quantity: number) {
    console.log("qua::", quantity, cartId)
    return this.http.put(`${BASIC_URL}api/public/cart/${cartId}/quantity`, { quantity: quantity })
  }

  deleteCartItem(cartId: number) {
    return this.http.delete(BASIC_URL + `api/public/cart/${cartId}`);
  }

  updateCartCount(){
    this.getCartItems().subscribe((items:any)=>{
      this.cartCountSource.next(items.length);
    });
  }

}
