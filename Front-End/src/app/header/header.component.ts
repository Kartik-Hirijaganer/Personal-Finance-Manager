import { Component, OnInit } from '@angular/core';

import { UserService } from '../user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userName: string | null = null;
  public profile_img: string = '';
  public userId: string | null = null;

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.userEvent.subscribe(userDetails => {
      this.userName = userDetails.user_fname;
      this.profile_img = userDetails.profile_img;
      this.userId = userDetails.userId;
    })
  }
}
