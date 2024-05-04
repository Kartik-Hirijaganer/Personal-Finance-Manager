import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { switchMap } from 'rxjs';

import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public user: string = '';
  public profile_img: string = '';

  constructor( 
    private userService: UserService, 
    private route: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.url.pipe(
      switchMap((event: UrlSegment[]) => {
        // const userId = event[0]?.path;
        const userId = 'username';
        return this.userService.getUser(userId);
      })
    ).subscribe(({user}) => {
      console.log(user);
      
      this.user = user.fname;
      this.profile_img = user?.profile_img || 'https://www.w3schools.com/howto/img_avatar.png';
    })
  }
}
