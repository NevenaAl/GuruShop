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
  userName: String;
  userSurname: String;
  constructor(private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
    this.userService.getLoggedUser().subscribe(res=>{
      if(res ==null){
        return;
      }

      this.userName = res.name;
      this.userSurname = res.surrname;
    });
  }


  logOut(){
    this.userService.setLoggedUser(null);
    this.router.navigateByUrl('home');
  }

}
