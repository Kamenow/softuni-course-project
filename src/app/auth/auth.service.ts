import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private HttpClient: HttpClient) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.HttpClient.post(
      'http://localhost:3000/api/user/signup',
      authData
    ).subscribe((response) => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.HttpClient.post<{ token: string }>(
      'http://localhost:3000/api/user/login',
      authData
    ).subscribe((response) => {
      const token = response.token;
      this.token = token;
      this.authStatusListener.next(true);
    });
  }
}
