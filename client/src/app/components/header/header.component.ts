import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  loggedUser: Observable<User>;
  constructor(private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
    console.log(this.loggedUser);
  }


  logOut(){
    this.userService.setLoggedUser(null);
    this.router.navigateByUrl('home');
  }

}
