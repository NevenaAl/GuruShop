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
    //this.loadLoggedUser();
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

 
  loadLoggedUser() {
    this.apollo
      .watchQuery({
        query: query.MeQuery
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        let user = result.data.me.userPayload;
        this.setLoggedUser(user);
        console.log(this.loggedUser);

        console.log(this.loggedUser);
        this.loading = result.loading;
        this.error = result.error;
      });

  }
  
  setLoggedUser(user: any){
    if(user==null){
      localStorage.clear();
    }
    this.loggedUser.next(user);
    
    console.log(this.loggedUser);
  }

  getLoggedUser() : Observable<User>{
    return this.loggedUser.asObservable();
  }

}
