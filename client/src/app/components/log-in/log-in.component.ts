import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html'
})
export class LogInComponent implements OnInit {
  
  logInFormGroup: FormGroup;
  message: String = '';

  email: String = '';
  password: String = '';
  payload: any;
  token: string;

  constructor(private router: Router,private userService: UserService,private formBuilder: FormBuilder,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.message = params['confirm'];
    })
    this.createForm();
  }

  createForm() {
    this.logInFormGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
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
          //this.userService.loadLoggedUser();
          this.router.navigateByUrl('home');
        }else{
          alert(this.payload.logInUser.errors[0].message);
        }

      }, (error) => {
        console.log('there was an error sending the query', error);
      });

  }

}
