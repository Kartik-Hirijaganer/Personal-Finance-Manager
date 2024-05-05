import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { switchMap, of } from 'rxjs';

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
  public profile_img: string = 'https://www.w3schools.com/howto/img_avatar.png';
  bsConfig?: Partial<BsDatepickerConfig>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false
    })
  }

  ngOnInit(): void {
    this.route.url
      .pipe(switchMap((event: UrlSegment[]) => {
        const userId = event[1].path;
        if (userId === 'null') {
          return of(null);
        }
        return this.userService.getUser(userId);
      }))
      .subscribe((response) => {
        const user = response?.user;
        if (user) {
          this.showEditBtn = true;
          this.profile_img = user?.profile_img && user.profile_img;
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
      id: new FormControl<string>('', Validators.required)
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

  onCancel() {
    this.router.navigateByUrl('/dashboard');
  }

  onSubmit() {
    const payload = this.userForm.getRawValue();
    if (!this.userService.validatePassword(payload.password, payload.repass)) {
      this.passwordMismatch = true;
      return;
    }
    // payload.profile_img = this.profile_img;
    this.userService.addUser(payload).subscribe(response => {
      if (response) {
        this.router.navigateByUrl('/dashboard');
      } else {
        console.log('Error, account not created');
      }
    });
  }
}