import gql from 'graphql-tag';

export const CategoryQuery = gql`
   query CategoryQuery($_id: String!){
   category(_id:$_id){
    categoryPayload{
      _id
      name
      image
      inputs
      subcategories{
        name
        image
        _id
      }
    }
  }
}`;


export const SubcategoryQuery = gql`
   query SubcategoryQuery($_id: String!){
   subcategory(_id:$_id){
    subcategoryPayload{
      _id
      name
      image
      inputs
      products{
        name
        _id
        image
        price
        description
        amount
        discount
        additionalInfo
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
      image
      inputs
      subcategories{
        _id
        name
      }
    }
  }`;

export const SubcategoriesQuery = gql`
query SubcategoriesQuery
{
  subcategories{
    name
    _id
    image
    inputs
    category{
      _id
    }
    products{
      name
      _id
      image
      price
      description
      amount
      discount
      additionalInfo
    }
  }
}`;

export const ProductsQuery = gql`
query ProductsQuery
{
  products{
    name
    _id
    image
    price
    description
    amount
    discount
    additionalInfo
    subcategory{
      _id
    }
    category{
      _id
    }
  }
}`;

export const ProductQuery = gql`
query ProductQuery ($_id: String!){
  product(_id:$_id){
    productPayload{
      _id
      name
      image
      description
      amount
      discount
      additionalInfo
      user{
        _id
      }
      category{
        _id
        name
      }
      subcategory{
        _id
        name
      }
      questions{
        message
        author
        answers
      }
    }
  }
}`;

export const UsersQuery = gql`
  query UsersQuery{
    users{
      _id
      name
      surrname
      email
      password
      isMailConfirmed
      role
    }
  }
`;

export const UserQuery = gql`
  query UserQuery ($_id: String!){
    user(_id:$_id){
      userPayload{
        _id
        name
        surrname
        email
        password
        isMailConfirmed
        role
      }
    }
  }
`;

export const MeQuery = gql`
  query MeQuery{
    me{
      userPayload{
        name
        surrname
        _id
        email
        password
        isMailConfirmed
        role
      }
      errors{
        message
      }
    }
  }
`;





