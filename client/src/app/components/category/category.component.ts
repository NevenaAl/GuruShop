import { Component, Input, OnInit } from '@angular/core';
import { Subcategory } from 'src/app/entities/Subcategory';
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';
import {Category} from '../../entities/Category'
import {Observable} from 'rxjs'
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
  @Input() category : any;
  @Input() type: string;
  loggedUser: Observable<User>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
  }

}
