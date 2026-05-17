import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  constructor(private http: HttpClient) { }

  getProductById(id: any) {
    return this.http.get(BASIC_URL + `api/public/product/${id}`);
  }
}
