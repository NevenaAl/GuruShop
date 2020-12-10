import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html'
})
export class LogInComponent implements OnInit {
  email: String = '';
  password: String = '';
  payload: any;
  token: string;

  constructor(private router: Router,private userService: UserService) { }

  ngOnInit(): void {
  }

  logIn() {
    this.userService.logIn(this.email, this.password)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.payload = data;

        if (this.payload.logInUser.errors == null) {
          this.token = this.payload.logInUser.token;
          localStorage.setItem('token', this.token);
          this.userService.setLoggedUser(this.payload.logInUser.userPayload);
          this.router.navigateByUrl('home');
        }else{
          alert(this.payload.logInUser.errors[0].message);
        }

      }, (error) => {
        console.log('there was an error sending the query', error);
      });

  }

}
