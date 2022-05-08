import {    
    Program,
    ImportDeclaration,
    Incerteza,
    Identifier,    
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
    DibujarTS,
  } from '../astMembers/Node';
import Visitor from "./Visitor";
import logError from '../errors/LogError';

class SymTableVisitor extends Visitor{

    
    override visitProgram(node: Program): void {
        for(let child of node.body){
            if(child.constructor.name === VariableDeclarator.name){
                let variable = child as VariableDeclarator;
                if(!node.table.addVariable(variable)){
                    logError(variable.id.loc, `El identificador '${variable.id.name}' ya está definido`);
                }             
            }else if(child.constructor.name === functionDeclaration.name){
                let func = child as functionDeclaration;
                if(!node.table.addFunc(func)){                    
                    logError(func.loc, `La función ${func.nameForTable}:${func.type.toString()} ya está definida`);
                }            
            }else if(child.constructor.name === functionMain.name){
                let func = child as functionMain;
                if(node.main !== null){                    
                    logError(func.loc, "Este archivo ya tiene una función Principal():Void");
                }else{
                    node.main = func;
                }
            }
        }
    }


}

export default SymTableVisitor;