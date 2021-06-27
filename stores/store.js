import {combineReducers, createStore} from 'redux';
import generalReducer from './reducers/generalReducer';
import moderatorReducer from './reducers/moderatorReducer';
import suppliersReducer from './reducers/suppliersReducer';
import clientsReducer from './reducers/clientsReducer';
import requestsReducer from './reducers/requestsReducers';
import brandsReducer from './reducers/brandsReducer';

const rootReducer = combineReducers({
    generalReducer: generalReducer,
    moderatorReducer: moderatorReducer,
    suppliersReducer: suppliersReducer,
    clientsReducer: clientsReducer,
    requestsReducer: requestsReducer,
    brandsReducer: brandsReducer
  })

const store = createStore(rootReducer);

export default store;