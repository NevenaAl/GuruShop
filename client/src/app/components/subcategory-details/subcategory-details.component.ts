import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { Subcategory } from 'src/app/entities/Subcategory';
import * as query from '../../../strings/queries'

@Component({
  selector: 'app-subcategory-details',
  templateUrl: './subcategory-details.component.html'
})
export class SubcategoryDetailsComponent implements OnInit {
  
  subcategory: Subcategory;
  subcategoryId : string;
  loading : boolean;
  error : any;

  constructor(private apollo: Apollo,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.subcategoryId = params['subcategoryId'];
        this.apollo
        .watchQuery({
         query: query.SubcategoryQuery,
         variables:{
          _id:this.subcategoryId,
           },
        })
        .valueChanges.subscribe(result => {
          //@ts-ignore
          this.subcategory = result.data.subcategory.subcategoryPayload;
          console.log(this.subcategory);
          this.loading = result.loading;
          this.error = result.error;
        });
      }
    ); 
  }
  

}
