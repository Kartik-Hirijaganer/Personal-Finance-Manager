import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css', '../shared/custom.styles.css']
})
export class UserComponent implements OnInit {
  public showPassword: boolean = false;
  public passwordMismatch: boolean = false;
  public userForm: FormGroup = new FormGroup({});
  public editMode: boolean = false;
  public showEditBtn: boolean = false;
  public formLoaded: boolean = false;
  private userId: string | null = null;
  bsConfig?: Partial<BsDatepickerConfig>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false
    })
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.setUserForm(null);
      return;
    }
    this.userService.getUser(this.userId).subscribe((response) => {
      const user = response.user;
      if (user) {
        this.showEditBtn = true;
        this.userService.userEvent.next({ user_fname: user.fname, profile_img: user.profile_img, userId: user.userId })
      }
      delete user.password;
      this.setUserForm(user);
    });
    // this.setUserForm(null); // uncomment if new register form doesn't open
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  setUserForm(data: any | null) {
    this.initializeForm();
    if (data) {
      Object.keys(this.userForm.controls).forEach(field => {
        this.userForm.get(field)?.setValue(data[field]);
        this.userForm.get(field)?.disable();
      });
    } else {
      this.userForm.addControl('repass', new FormControl('', Validators.required));
      this.userService.profile_img = 'https://www.w3schools.com/howto/img_avatar.png';
    }
    this.formLoaded = true;
  }

  initializeForm() {
    this.userForm = new FormGroup({
      fname: new FormControl<string>('', [Validators.required]),
      mname: new FormControl<string>(''),
      lname: new FormControl<string>('', [Validators.required]),
      dob: new FormControl<string>('', Validators.required),
      gender: new FormControl<string>('', Validators.required),
      phone: new FormControl<string>('', [Validators.required, Validators.pattern(/^[0-9+]+$/)]),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', Validators.required),
      profile_img: new FormControl<File | null>(null)
    });
  }

  onEdit() {
    Object.keys(this.userForm.controls).forEach(field => {
      this.userForm.get(field)?.enable();
    });
    this.userForm.addControl('repass', new FormControl('', Validators.required));
    this.editMode = !this.editMode;
    this.showEditBtn = !this.showEditBtn;
  }

  onUpload(event: any) {
    if (event?.target?.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.userForm.patchValue({ profile_img: event.target.result });
        this.userService.profile_img = event.target.result;
      }
    }
  }

  onCancel() {
    if (this.userId === 'null' || !this.userId) {
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit() {
    const payload = this.userForm.getRawValue();
    if (!this.userService.validatePassword(payload.password, payload.repass)) {
      this.passwordMismatch = true;
      return;
    }
    delete payload.repass;
    if (!payload.profile_img) {
      payload.profile_img = 'https://www.w3schools.com/howto/img_avatar.png';
    }
    if (this.editMode) {
      this.userService.updateUser(payload)
        .pipe(catchError(err => {
          this.toastr.error(err.error?.errorMessage || 'Unknown error', 'Database error');
          return of(null);
        }))
        .subscribe(response => {
          this.toastr.success('Successfully updated user details', 'Success');
          return response?.userId;
        })
    } else {
      this.authService.register(payload)
        .pipe(catchError(err => {
          const title: string = err.error?.errorMessage;
          let message: string = 'Database error';
          if (err.error?.error?.errorMessage?.includes('E11000')) {
            message = 'Duplicate key error. Email, phone must be unique';
          }
          this.toastr.error(message, title);
          return of(null);
        }))
        .subscribe((response) => {
          if (response) {
            this.authService.setUser({ token: response.token, userId: response.userId, accountId: response.accountId, user: response.user, profile_img: payload.profile_img });
            this.toastr.success('Registeration successfull', 'Success');
            this.router.navigate(['/dashboard'], { queryParams: { userId: response.userId } })
          }
        })
    }
  }
}