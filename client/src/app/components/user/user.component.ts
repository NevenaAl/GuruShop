import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/entities/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  
  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
