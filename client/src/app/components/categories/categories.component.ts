import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: any[];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo
    .watchQuery({
      query: gql`
        {
          categories{
            name
            _id
          }
        }
      `,
    })
    .valueChanges.subscribe(result => {
      //@ts-ignore
      this.categories = result.data.categories;
      this.loading = result.loading;
      this.error = result.error;
    });

  }

}
