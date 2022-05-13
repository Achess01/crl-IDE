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

const ast = (code:string)=>{    
    return parser.parse(code + "\n");
}

let yy = parser.yy;

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
yy.correct = true;

yy.parseError = function(msg:any, hash:any){  
  yy.correct = false;
  yy.logError(msg, hash);
}

yy.logError = function(msg:any, hash:any){  
  logError(hash.loc, msg);
}


    
export default ast;