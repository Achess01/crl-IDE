import {
    Node,
    Program,
    ImportDeclaration,
    Incerteza,
    Identifier,
    Type,
    VariableDeclarator,
    VariableDeclaration,
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
    DibujarTS,
  } from '../astMembers/Node';
import Visitor from "./Visitor";

class SymTableVisitor extends Visitor{
    
}