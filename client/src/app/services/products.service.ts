import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as mutation from '../../strings/mutations';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private apollo:Apollo) { }
  
  createProduct(name: String,image: any[],description: String, price: any, discount: any, amount: any, additionalInfo: JSON, subcategory_id: String){
    return this.apollo.mutate({
      mutation: mutation.CreateProductMutation,
      variables: {
        name,
        image,
        description,
        price,
        discount,
        amount,
        additionalInfo,
        subcategory_id
      },
      context:{
        useMultipart: true
      }
    });
  }

  editProduct(_id: String,name: String,newImages: any,deletedImages: any,description: String, price: any, discount: any, amount: any, additionalInfo: JSON, subcategory_id: String){
    return this.apollo.mutate({
      mutation: mutation.EditProductMutation,
      variables: {
        _id,
        name,
        newImages,
        deletedImages,
        description,
        price,
        discount,
        amount,
        additionalInfo,
        subcategory_id
      },
      context:{
        useMultipart: true
      }
    });
  }

  deleteProduct(_id: String){
    return this.apollo.mutate({
      mutation: mutation.DeleteProductMutation,
      variables:{
        _id
      }
    })
  }

}
