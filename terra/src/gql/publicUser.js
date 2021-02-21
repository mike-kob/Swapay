export const PROFILES_QUERY = `
query($ids: [ID]!)
{
    profiles(ids: $ids) {
      id
      username
      firstName
      lastName
      dateJoined
      avatar
      city {
        id
        name
      }
      items {
        id
        rentPrice
        sellPrice
        exchangeDescription
        description
        title
        types
        owner {
          city {
            name
          }
        }
        photos {
          id
          file
          main
        }
        tags {
          id
          alias
          translatedName
        }
      }
    }  
}
`;
