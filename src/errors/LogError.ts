class ErrorLog{
  static errors:string[] = [];
  static logError(loc: any, info:string){
    let message = "";
    if(loc.first_line && loc.first_column){
      message = `Error ln:${loc.first_line} col:${loc.first_column} ${info}`;
    }else{
      message = info;
    }
      // console.log(message);
      ErrorLog.errors.push(message);
  }
   
  static clear(){
    ErrorLog.errors = [];
  }
}



/* function logError(loc: any, info:string){
  let message = "";
  if(loc.first_line && loc.first_column){
    message = `Error ln:${loc.first_line} col:${loc.first_column} ${info}`;
  }else{
    message = info;
  }
    console.log(message);
} */

export default ErrorLog;