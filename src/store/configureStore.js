import {configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { initialState, storeReducer } from './store.redux';

const persistConfig = {
	key: 'store',
	storage
}

const persistedReducer = persistReducer(persistConfig, storeReducer)

export default configureStore({
	reducer: { store: persistedReducer },
	preloadedState: {store: initialState},
	devTools: process.env.NODE_ENV !== 'production',
});