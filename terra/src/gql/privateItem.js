
export const CREATE_ITEM_MUTATION = `
mutation(
    $rentPrice: Decimal,  
    $sellPrice: Decimal,
    $exchangeDescription: String
    $ukDescription: String,
    $enDescription: String,
    $ukTitle: String,
    $enTitle: String,
    $enPreview: String,
    $ukPreview: String,
    $types: [DealType],
    $age: String,
    $language: String,
    $avgGameTime: String,
    $deposit: Decimal,
  ) {
    createItem(data: {
      rentPrice: $rentPrice,
      sellPrice: $sellPrice,
      exchangeDescription: $exchangeDescription,
      description: $ukDescription,
      enDescription: $enDescription,
      title: $ukTitle,
      enTitle: $enTitle,
      preview: $ukPreview,
      enPreview: $enPreview,
      types: $types,
      age: $age,
      language: $language,
      avgGameTime: $avgGameTime,
      deposit: $deposit,
    }) {
      ok
      errors
      item {
        id
        rentPrice
        sellPrice
        exchangeDescription
        enDescription
        ukDescription
        enPreview
        ukPreview
        enTitle
        ukTitle
        age
        language
        avgGameTime
        deposit
        photos {
          id
        }
        owner {
          id
        }
        types
        created
        tags {
          id
        }
      }
  
    }
  }
`;

export const UPDATE_ITEM_PHOTO_MUTATION = `
mutation(
  $id: Int!,
  $main: Boolean
) {
  updateItemPhoto(id: $id, data: {
    main: $main
  }) {
    ok
    errors
    itemPhoto {
      id
      publicId
      main
    }
  }
}
`;


export const UPDATE_ITEM_MUTATION = `
mutation(
    $id: ID!
    $rentPrice: Decimal,  
    $sellPrice: Decimal,
    $exchangeDescription: String,
    $ukDescription: String,
    $enDescription: String,
    $ukTitle: String,
    $enTitle: String,
    $ukPreview: String,
    $enPreview: String,
    $types: [DealType],
    $tags: [ID!],
    $age: String,
    $language: String,
    $avgGameTime: String,
    $deposit: Decimal,
  ) {
    updateItem(
      id: $id,
      data: {
          rentPrice: $rentPrice,
          sellPrice: $sellPrice,
          exchangeDescription: $exchangeDescription,
          description: $ukDescription,
          enDescription: $enDescription,
          preview: $ukPreview,
          enPreview: $enPreview,
          title: $ukTitle,
          enTitle: $enTitle,
          types: $types,
          tags: $tags,
          age: $age,
          language: $language,
          avgGameTime: $avgGameTime,
          deposit: $deposit,
    }) {
      ok
      errors
      item {
        id
        rentPrice
        sellPrice
        exchangeDescription
        enDescription
        ukDescription
        enTitle
        ukTitle
        enPreview
        ukPreview
        age
        language
        avgGameTime
        deposit
        photos {
          id
          publicId
          main
        }
        owner {
          id
        }
        types
        created
      }
  
    }
  }
`;


export const ADD_ITEM_PHOTO_MUTATION = `
mutation (
    $name: String, 
    $guid: String, 
    $item: Int!
  ) {
    createItemPhoto(data: {
      name: $name,
      guid: $guid,
      item: $item
    }) {
      ok
      errors
      itemPhoto {
        id
        publicId
        main
        item {
          id
        }
      }
    }
  }
`;

export const GET_ITEM_INFO_QUERY = `
query ($id: Int!) {
    privateItem(id: $id) {
      id
      rentPrice
      sellPrice
      exchangeDescription
      enDescription
      ukDescription
      enPreview
      ukPreview
      enTitle
      ukTitle
      deposit
      age
      language
      avgGameTime
      owner {
        id
      }
      tags {
        id
        alias
        name
        translatedName
      }
      types
      activated
      lastActivated
      created
      photos {
        id
        main
        publicId
      }
    }
  }
`;


export const ACTIVATE_ITEM_MUTATION = `
mutation (
    $id: ID!,
    $activate: Boolean!
  ) {
    itemActivation (id: $id, activate: $activate) {
      ok
      errors
    }
  }
`;


export const DELETE_ITEM_MUTATION = `
mutation (
  $id: ID!,
) {
  deleteItem (id: $id) {
    ok
    errors
  }
}
`;

export const DELETE_ITEM_PHOTO_MUTATION = `
mutation (
  $id: ID!,
) {
  deleteItemPhoto (id: $id) {
    ok
    errors
  }
}
`;

export const GET_PRIVATE_ITEMS_QUERY = `
query {
  privateItems {
    id
    title
    created
    rentPrice
    sellPrice
    exchangeDescription
    activated
    tags {
      translatedName
    }
    photos {
      id
      publicId
      main
    }
  }
}
`;

export const GAME_TAGS_QUERY = `
query {
  gameTags {
    id
    tagType
    alias
    ukSlug
    enSlug
    ukName
    enName
  }
}
`;
