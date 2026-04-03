import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // add roomsReducer, bookingsReducer here later...
});

export default rootReducer;