import uuid from 'uuid';
import { _ } from 'lodash';

let defaultState = [];
let initialState = _.cloneDeep(defaultState);

module.exports = (state=defaultState, action) => {
  switch(action.type) {
    case 'ADD_ALERT':
      let alert;
      for (let i = 0; i < state.length; i++) {
        alert = state[i];
        if (alert.text === action.text) {
          return state;
        }
      }
      return [
        ...state,
        {
          text: action.text,
          id: uuid.v4()
        }
      ];
    case 'REMOVE_ALERT':
      return state.filter((alert) => {
        if (alert.id === action.id) {
          return false;
        } else {
          return true;
        }
      });
    case 'CLEAR_ALERTS':
      return initialState;
    default:
      return state;
  }
};
