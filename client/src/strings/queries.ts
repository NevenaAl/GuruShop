import gql from 'graphql-tag';
export const CategoryQuery = gql`
   query CategoryQuery($_id: String!){
   category(_id:$_id){
    categoryPayload{
      _id
      name
      image
      subcategories{
        name
        image
        _id
      }
    }
  }
}`;

export const CategoriesQuery = gql`
  query CategoriesQuery
  {
    categories{
      name
      _id
    }
  }`;
