function logError(loc: any, info:string){
  let message = "";
  if(loc !== {}){
    message = `Error ln:${loc.first_line} col:${loc.first_column} ${info}`;
  }else{
    message = info;
  }
    console.log(message);
}

 export default logError;