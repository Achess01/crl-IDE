function logError(loc: any, info:string){
    let message = `Error ln:${loc.first_line} col:${loc.first_column} ${info}`;
    console.log(message);
}

 export default logError;