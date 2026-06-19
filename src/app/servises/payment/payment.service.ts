import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  processPayment(paymentData:any){

    return this.http.post(BASIC_URL + 'api/public/payment/process',paymentData)

  }
}
