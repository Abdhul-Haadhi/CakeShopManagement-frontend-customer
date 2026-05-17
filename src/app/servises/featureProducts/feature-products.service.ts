import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../userStorage/user-storage.service';



const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class FeatureProductsService {

  constructor(private http: HttpClient) { }


  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/public/products');
  }

  getAllProductsByName(productName: any): Observable<any> {
    return this.http.get(BASIC_URL + `api/public/search/${productName}`)
  }



  // private createAuthorizationHeader(): HttpHeaders {
  //   return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  // }

}
