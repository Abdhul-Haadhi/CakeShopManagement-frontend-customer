import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    this.loggedIn.next(this.hasCustomer());
  }


  private hasCustomer(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('customerId');
    }
    return false;
  }

  login(customerId: string, phone: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customerId', customerId);
      localStorage.setItem('customerPhone', phone);
    }

    this.loggedIn.next(true);
  }

  register(data: any) {
    return this.http.post(BASIC_URL + 'api/customer/auth/register', data);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customerId');
      localStorage.removeItem('customerPhone');
    }

    this.loggedIn.next(false);
  }

  sendOtp(phone: string) {
    return this.http.post(BASIC_URL + 'api/customer/auth/send-otp', { phone });
  }

  verifyOtp(phone: string, otp: string) {
    return this.http.post(BASIC_URL + 'api/customer/auth/verify-otp', {
      phone, otp
    });
  }

  getCustomerById(customerId: string) {
    return this.http.get(BASIC_URL + `api/customer/auth/get-customer/${customerId}`);
  }

  updateCustomer(customerId: string, data: any) {
    return this.http.put(BASIC_URL + `api/customer/auth/update-customer/${customerId}`, data);
  }

}
