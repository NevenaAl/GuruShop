import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';

import * as mutation from '../../strings/mutations'
import * as query from '../../strings/queries';
import { User } from '../entities/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedUser:  ReplaySubject<User> = new ReplaySubject<User>();
  loading: boolean;
  error: any;

  constructor(private apollo: Apollo) {
   }

  logIn(email: String, password: String){
    return this.apollo.mutate({
      mutation: mutation.LogInUserMutation,
      variables: {
        email,
        password
      }
    });
  }

  signUp(name: String, surrname: String, email: String, password: String){
    return this.apollo.mutate({
      mutation: mutation.SignUpUserMutation,
      variables: {
        name,
        surrname,
        email,
        password
      }
    });
  }
  
  loadLoggedUser() {
    this.apollo
      .watchQuery({
        query: query.MeQuery
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        let user = result.data.me.userPayload;
        this.setLoggedUser(user);
        this.loading = result.loading;
        this.error = result.error;
      });

  }
  
  editUser(_id: String,name: String,surrname: any,email: any,role: String){
    return this.apollo.mutate({
      mutation: mutation.EditUserMutation,
      variables: {
        _id,
        name,
        surrname,
        email,
        role
      },
      context:{
        useMultipart: true
      }
    });
  }

  deleteUser(_id: String){
    return this.apollo.mutate({
      mutation: mutation.DeleteUserMutation,
      variables:{
        _id
      }
    })
  }

  setLoggedUser(user: any){
    if(user==null){
      localStorage.clear();
    }
    this.loggedUser.next(user);
  }

  getLoggedUser() : Observable<User>{
    return this.loggedUser.asObservable();
  }

 
}
