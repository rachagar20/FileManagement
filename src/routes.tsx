import App from './App.tsx'
import Repository from './pages/Repository.tsx'
import { createBrowserRouter } from 'react-router-dom'
export const router=createBrowserRouter([
    {
        element:<App/>,
        children:[
            {
                path:"/",
                element:<Repository/>
            },  
        ]
    }
])