import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(data:any){
    return this.http.post(BASIC_URL+'api/public/place-order',data);
  }

  getOrders(sessionId:any){
    return this.http.get(`${BASIC_URL}api/public/orders/${sessionId}`);
  }
}
