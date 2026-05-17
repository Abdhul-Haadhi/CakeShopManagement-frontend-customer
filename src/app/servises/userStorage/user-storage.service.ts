import { Injectable } from '@angular/core';

const TOKEN = 'cakeShop-token'

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }
}
