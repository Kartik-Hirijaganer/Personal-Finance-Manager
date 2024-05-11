import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ConfirmationPopupComponent } from '../shared/confirmation-modal/confirmation-modal-component';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userName: string | null = null;
  public profile_img: string | null = null;
  public userId: string | null = null;
  public showConfirmationPopup: boolean = false;
  public accountId: string = '';
  @ViewChild(ConfirmationPopupComponent) popup!: ConfirmationPopupComponent

  constructor(
    public userService: UserService,
    public authService: AuthService,
    public dashboardService: DashboardService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id') || '';
    this.userName = localStorage.getItem('user_name');
    this.profile_img = localStorage.getItem('profile_img');
    this.accountId = localStorage.getItem('account_id') || '';    
  }

  onDelete() {
    this.popup.openModal('danger', 'Are you sure, you want to delete your profile?');
  }

  onLogout(): void {
    this.userName = null;
    this.profile_img = null;
    this.userId = null;
    this.authService.logout();
  }

  onConfirmationEvent(confirm: boolean) {
    if (confirm) {
      const userId: string = localStorage.getItem('user_id') || '';
      this.userService.deleteUser(userId)
        .pipe(catchError(err => {
          const title: string = err.error?.errorMessage;
          let message: string = 'Failed to delete user';
          this.toastr.error(message, title);
          return of(null);
        })).subscribe(response => {
          if (response) {
            this.toastr.success('Successfully deleted user', 'Success');
            this.onLogout();
          }
        });
    }
  }
}
