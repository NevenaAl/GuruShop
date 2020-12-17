import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as mutation from '../../strings/mutations'

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  constructor(private apollo:Apollo) { }
  
  createSubcategory(name: String,image: any,category_id: String){
    console.log(name);
    console.log(category_id);
    console.log(image);
    return this.apollo.mutate({
      mutation: mutation.CreateSubcategoryMutation,
      variables: {
        name,
        image,
        category_id
      },
      context:{
        useMultipart: true
      }
    });
  }
}
