import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import {router} from "./routes.tsx"
import { Provider } from 'react-redux';
import store from './store/store.ts';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
)
