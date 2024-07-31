import React from "react";

interface GifProps{
    url:string;
}
const GifViewer:React.FC<GifProps> =({url})=>{
    
    return(
            <div className="gifViewer">
                <div>
                <img src={url} alt="GIF" width="400px" height="300px" >
                </img>
                </div>
            </div>
    )
}
export default GifViewer;