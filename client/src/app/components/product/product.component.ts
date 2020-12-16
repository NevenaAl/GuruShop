import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/entities/Product';
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  @Input() product: Product;
  loggedUser: Observable<User>;
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
  }

}
