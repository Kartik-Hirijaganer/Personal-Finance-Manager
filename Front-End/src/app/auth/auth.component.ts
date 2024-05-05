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
  public userId: string | null = null;

  constructor(private authService: AuthService, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      email: new FormControl<String>('', [Validators.required, Validators.email]),
      password: new FormControl<String>('', Validators.required)
    })
  }
  
  onSubmit() {
    if (!this.loginForm.valid) {
      this.toastr.error('Kindly enter email and password to proceed', 'Invalid credentails');
      return;
    }
    const userCredentials = this.loginForm.getRawValue();
    this.authService.login(userCredentials);
  }
}