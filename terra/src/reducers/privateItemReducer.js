import {itemConstants} from '../constants';

const initialState = {
  currentPhoto: {},
  privateItems: [],
  item: {
    'rentPrice': undefined,
    'deposit': undefined,
    'sellPrice': undefined,
    'exchangeDescription': '',
    'ukDescription': '',
    'ruDescription': '',
    'activated': false,
    'ukTitle': '',
    'ruTitle': '',
    'ukPreview': '',
    'ruPreview': '',
    'age': '',
    'avgGameTime': '',
    'language': '',
    'types': [],
    'photos': [],
    'tags': [],
  },
  gameTags: [],
};

export function item( state = initialState, action ) {
  switch ( action.type ) {
    case itemConstants.MODIFY_ITEM:
      return {
        ...state,
        item: {
          ...state.item,
          ...action.data,
        },
      };
    case itemConstants.GET_ITEM_INFO_SUCCESS:
      return {
        ...state,
        item: action.data,
      };
    case itemConstants.SELECT_PHOTO:
      return {
        ...state,
        currentPhoto: action.data,
      };

    case itemConstants.CREATE_ITEM_SUCCESS:
      return {
        ...state,
        item: action.data,
        privateItems: [
          ...state.privateItems,
          action.data,
        ],
      };

    case itemConstants.UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          ...action.data,
        },
        privateItems: [...state.privateItems.filter( (o) => o.id !== action.data.id ),
          action.data],
      };
    case itemConstants.DELETE_ITEM_SUCCESS:
      return {
        ...state,
        privateItems: state.privateItems.filter( (o) => o.id !== action.data ),
        item: initialState.item,
      };
    case itemConstants.ACTIVATE_ITEM_SUCCES:
      return {
        ...state,
        item: {
          ...state.item,
          activated: action.data,
        },
      };
    case itemConstants.GET_PRIVATE_ITEMS_SUCCESS:
      return {
        ...state,
        privateItems: action.data,
      };
    case itemConstants.CREATE_ITEM_PHOTO_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          photos: [
            ...state.item.photos,
            action.data,
          ],
        },
      };
    case itemConstants.UPDATE_ITEM_PHOTO_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          photos: [
            ...state.item.photos.filter( (o) => o.id !== action.data.id ).map( (o) => {
              o.main = false; return o;
            } ),
            action.data,
          ],
        },
      };
    case itemConstants.DELETE_ITEM_PHOTO_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          photos: state.item.photos.filter( (o) => o.id !== action.data ),
        },
      };
    case itemConstants.GET_GAME_TAGS_SUCCESS:
      return {
        ...state,
        gameTags: action.data,
      };
    default:
      return state;
  }
}
