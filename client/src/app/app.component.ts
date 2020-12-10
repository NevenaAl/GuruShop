import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as query from '../strings/queries';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs';
import { User } from './entities/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  loggedUser:  Observable<User>;
  loading: boolean;
  error: any;

  title = 'client';
  constructor(private apollo: Apollo,private userService: UserService){

  }
  
  ngOnInit(): void {
     this.userService.loadLoggedUser();
     this.loggedUser = this.userService.getLoggedUser();
    }
  
}
