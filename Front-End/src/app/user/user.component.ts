import { Component } from '@angular/core';

import { User } from './user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css', '../shared/custom.styles.css']
})
export class UserComponent {
  constructor() { }
}