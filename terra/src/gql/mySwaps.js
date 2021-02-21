export const GET_SWAPS_LIST_QUERY = `
query {
    swaps {
      id
      owner {
        id
        firstName
        lastName
        username
        avatar
      }
      client {
        id
        firstName
        lastName
        username
        avatar
      }
      item {
        id
        title
        sellPrice
        rentPrice
        photos {
          id
          main
          publicId
        }
      }
      type
      accepted
      created
      hasUpdates
    }
  }
`;

export const GET_SWAP_QUERY = `
query (
  $id: Int!
) {
  swap (id: $id) {
    id
    clientContacts
    owner {
      id
      firstName
      lastName
      username
      avatar
      city {
        id
        name
      }
    }
    client {
      id
      firstName
      lastName
      username
      avatar
      city {
        id
        name
      }
    }
    item {
      id
      title
      sellPrice
      rentPrice
      photos {
        id
        main
        publicId
      }
    }
    type
    accepted
    created
  }
}
`;

export const CREATE_SWAP_MUTATION = `
mutation (
    $item: ID!,
    $type: String,
    $message: String
  ) {
    createSwap (data: {
      item: $item,
      type: $type,
      message: $message
    }) {
      ok
      errors
      swap {
        id
      }
    }
  }
`;

export const EDIT_SWAP_MUTATION = `
mutation (
    $id: ID!
    $type: String,
    $accepted: Boolean  
  ) {
    updateSwap (
      id: $id,
      data: {
          type: $type,
          accepted: $accepted,
    }) {
      ok
      errors
      swap {
        type
        accepted
        clientContacts
      }
    }
  }
`;


export const MESSAGES_QUERY = `
query ($swapId: Int!) {
  messages (swapId: $swapId) {
    id
    author {
      id
      username
      firstName
      lastName
    }
    timeSent
    seen
    body
  }
}
`;

export const POST_MESSAGE_MUTATION = `
mutation ($swap: Int!, $body: String!) {
  postMessage(data: {swap: $swap, body: $body}) {
    ok
    message {
      id
      author {
        id
        username
        firstName
        lastName
      }
      timeSent
      seen
      body
    }
  }
}
`;
