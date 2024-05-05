import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { catchError, switchMap, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { UserService } from './user.service';

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
    private toastr: ToastrService
  ) {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false
    })
  }

  ngOnInit(): void {
    this.route.url
      .pipe(switchMap((event: UrlSegment[]) => {
        this.userId = event[1].path;
        return this.userService.getUser(this.userId);
      }))
      .subscribe(({ user }) => {
        if (user) {
          this.showEditBtn = true;
          user?.profile_img && (this.userService.profile_img = user.profile_img);
        }
        this.setUserForm(user);
      })
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
      this.userForm.setValue({ profile_img: data.profile_img })
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
      userId: new FormControl<string>('', Validators.required),
      profile_img: new FormControl<File | null>(null, Validators.required)
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
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.userForm.patchValue({ profile_img: event.target.result });
        this.userService.profile_img = event.target.result
      }
    }
  }

  onCancel() {
    if (this.userId === 'null' || this.userId === null) {
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl(`/dashboard/${this.userId}`);
    }
  }

  onSubmit() {
    const payload = this.userForm.getRawValue();
    if (!this.userService.validatePassword(payload.password, payload.repass)) {
      this.passwordMismatch = true;
      return;
    }
    this.userService.addUser(payload)
      .pipe(
        catchError(err => {
          const title: string = err.error?.errorMessage;
          let message: string = 'Database error';
          if (err.error?.error?.errorMessage?.includes('E11000')) {
            message = 'Duplicate key error. Username, email, phone must be unique';
          }
          this.toastr.error(message, title);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.router.navigateByUrl(`/dashboard/${response.userId}`);
        }
      });
  }
}