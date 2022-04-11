import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoading: boolean = false;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    // console.log(form.value);
    if (!form.value) {
      return;
    }

    this.authService.login(form.value.email, form.value.password);
  }
}
