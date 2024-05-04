import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css', '../shared/custom.styles.css']
})
export class AuthComponent {
  constructor( private authService: AuthService ) { }

  login() {
    this.authService.isLoginMode = !this.authService.isLoginMode;
  }
}