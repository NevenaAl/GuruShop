import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as mutation from '../../strings/mutations'

import * as Scalars from '../../strings/scalar';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private apollo:Apollo) { }
  
  createCategory(name: String,image: any){
    console.log(image);
    return this.apollo.mutate({
      mutation: mutation.CreateCategoryMutation,
      variables: {
        name,
        image
      }
    });
  }
}
