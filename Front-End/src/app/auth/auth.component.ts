import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css', '../shared/custom.styles.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  resetForm: FormGroup = new FormGroup({});
  public userId: string | null = null;
  public hide: boolean = false;
  public passwordType: string = 'password'
  public passwordMismatch: boolean = false;

  constructor(public authService: AuthService, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.initializeForm();
    localStorage.clear();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      email: new FormControl<String>('', [Validators.required, Validators.email]),
      password: new FormControl<String>('', Validators.required)
    })
    this.resetForm = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      pass: new FormControl<string>('', Validators.required),
      repass: new FormControl<string>('', Validators.required)
    })
  }

  hidePassword(type: string) {
    this.hide = !this.hide;
    this.passwordType = type;
  }

  onResetPassword() {
    this.authService.showLoginPage = false;
    this.loginForm.reset();
  }

  onRegister() {
    this.loginForm.reset();
  }

  onCancel() {
    this.authService.showLoginPage = true;
    this.resetForm.reset();
  }
  
  onLogin() {
    console.log('here');
    
    if (!this.loginForm.valid) {
      this.toastr.error('Kindly enter email and password to proceed', 'Invalid credentails');
      return;
    }
    const userCredentials = this.loginForm.getRawValue();
    this.authService.login(userCredentials);
  }

  onReset() {
    const payload = this.resetForm.getRawValue();
    
    if (payload.pass !== payload.repass) {
      this.passwordMismatch = true;
      return;
    }
    this.authService.
    resetUserPassword(payload);
  }
}