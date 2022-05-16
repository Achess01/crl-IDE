import {
    Program,
    ImportDeclaration,
    Incerteza,
    Identifier,
    Type,
    VariableDeclarator,    
    BinaryExpression,
    LogicalExpression,
    UnaryExpression,
    Assignment,
    CallFunction,
    functionParam,
    returnStmt,
    continueStmt,
    breakStmt,
    functionDeclaration,
    functionMain,
    IfStmt,
    forStmt,
    whileStmt,
    Mostrar,
    DibujarAST,
    DibujarEXP,
    DibujarTS
} from '../astMembers/Node';

import logError from 'src/errors/LogError';

declare var parser:any;

let yy = parser.yy;

const ast = (code:string, name:string)=>{    
    yy.filename = name;  
    return parser.parse(code + "\n");
}



yy.Program = Program;
yy.ImportDeclaration = ImportDeclaration;
yy.Incerteza = Incerteza;
yy.Identifier = Identifier;
yy.Type = Type;
yy.VariableDeclarator = VariableDeclarator;
yy.BinaryExpression = BinaryExpression;
yy.LogicalExpression = LogicalExpression;
yy.UnaryExpression = UnaryExpression;
yy.Assignment = Assignment;
yy.CallFunction = CallFunction;    
yy.functionParam = functionParam;
yy.returnStmt = returnStmt;
yy.continueStmt = continueStmt;
yy.breakStmt = breakStmt;    
yy.functionDeclaration = functionDeclaration;
yy.functionMain = functionMain;
yy.IfStmt = IfStmt;
yy.forStmt = forStmt;
yy.whileStmt = whileStmt;    
yy.Mostrar = Mostrar;
yy.DibujarAST = DibujarAST;
yy.DibujarEXP = DibujarEXP;
yy.DibujarTS = DibujarTS;

yy.parseError = function(msg:any, hash:any){    
  yy.logError(msg, hash);
}

yy.logError = function(msg:any, hash:any){    
  let info = `${msg}\nArchivo ${yy.filename}.crl`
  logError(hash.loc, info);
}

yy.logLexicalError = function(loc:any, info:string){  
  info = yy.filename + " " + info;
  logError(loc, info);
}
    
export default ast;