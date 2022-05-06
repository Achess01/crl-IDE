import {
    Program,
    ImportDeclaration,
    Incerteza,
    Identifier,
    Type,
    VariableDeclarator,
    VariableDeclaration,
    BinaryExpression,
    LogicalExpression,
    UnaryExpresion,
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
    Mostar,
    DibujarAST,
    DibujarEXP,
    DibujarTS
} from '../astMembers/Node';
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
yy.VariableDeclaration = VariableDeclaration;
yy.BinaryExpression = BinaryExpression;
yy.LogicalExpression = LogicalExpression;
yy.UnaryExpresion = UnaryExpresion;
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
yy.Mostar = Mostar;
yy.DibujarAST = DibujarAST;
yy.DibujarEXP = DibujarEXP;
yy.DibujarTS = DibujarTS;    
    
export default ast;