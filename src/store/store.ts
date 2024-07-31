import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from '../slices/LoadingSlice.ts';
import documentsReducer from "../slices/DocumentSlice.ts"
import foldersReducer from "../slices/FolderSlice.ts"
import { useDispatch } from "react-redux";

const store=configureStore({
    reducer:{
        loading: loadingReducer,
        documents:documentsReducer,
        folders:foldersReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;