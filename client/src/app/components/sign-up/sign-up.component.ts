import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  
  signUpFormGroup: FormGroup;
  name: String = '';
  surrname: String = '';
  email: String = '';
  password: String = '';
  payload: any;

  constructor(private userService: UserService,private router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }
  
  createForm() {
    this.signUpFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surrname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.minLength(5),Validators.email]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.comparePasswords })
    });
  }

  comparePasswords(formBuilder: FormGroup) {
    let confirmPswrdCtrl = formBuilder.get('confirmPassword');
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (formBuilder.get('password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }
  signUp(){
  this.userService.signUp(this.name,this.surrname,this.email, this.password)
        .subscribe(({ data }) => {
          console.log('got data', data);
          this.payload = data;

          if (this.payload.createUser.errors == null) { 
            this.router.navigateByUrl('logIn');
          }else{
            alert(this.payload.createUser.errors[0].message);
          }

        }, (error) => {
          console.log('there was an error sending the query', error);
        });

  }
}
