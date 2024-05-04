import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css', '../shared/custom.styles.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  public userId: string = 'username';

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      email: new FormControl<String>('', [Validators.required, Validators.email]),
      password: new FormControl<String>('', Validators.required)
    })
  }

  onRegister() {
    
  }

  login() {
    this.authService.isLoginMode = !this.authService.isLoginMode;
  }

  onSubmit() {
    console.log(this.loginForm);
  }
}