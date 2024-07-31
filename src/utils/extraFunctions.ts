export function getDate() {
    const today = new Date();
    let month = (today.getMonth() + 1).toString();
    if (parseInt(month) < 10) { month = "0" + month }
    const year = today.getFullYear();
    let date = today.getDate().toString();
    if (parseInt(date) < 10) { date = ("0" + date) }
    return `${date}-${month}-${year}`;
}


export function extractFileType(name: string) {
    const arr = name.split('.');
    return arr[arr.length - 1];
}

export const shortenName=(name:string,maxSize:number)=>{
    if(name.length<maxSize) return name;
    return name.slice(0,13)+"..."+name.slice(-6)

}