import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ConfirmationPopupComponent } from '../shared/confirmation-modal/confirmation-modal-component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userName: string = '';
  public profile_img: string = '';
  public userId: string = '';
  public showConfirmationPopup: boolean = false;
  @ViewChild(ConfirmationPopupComponent) popup!: ConfirmationPopupComponent

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.userEvent.subscribe(userDetails => {
      this.userName = userDetails.user_fname;
      this.profile_img = userDetails.profile_img;
      this.userId = userDetails.userId;
    })
  }
  onDelete() {
    this.popup.openModal('danger', 'Are you sure, you want to delete your profile?');
  }

  onConfirmationEvent(confirm: boolean) {
    if (confirm) {
      this.userService.deleteUser(this.userId)
        .pipe(catchError(err => {
          const title: string = err.error?.errorMessage;
          let message: string = 'Failed t delete user';
          this.toastr.error(message, title);
          return of(null);
        })).subscribe(response => {
          if (response) {
            this.toastr.success('Successfully deleted user', 'Success');
            this.router.navigateByUrl('/');
          }
        });
    }
  }
}
