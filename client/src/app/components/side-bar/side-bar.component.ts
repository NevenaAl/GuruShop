import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit {
  loggedUser: Observable<User>;
  role: String = "";
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
    this.userService.getLoggedUser().subscribe(res=>{
      if(res ==null){
        return;
      }

      this.role = res.role;
    });
  }
}
