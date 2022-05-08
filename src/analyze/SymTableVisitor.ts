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
                    logError(variable.id.loc, `El identificador ${variable.id.name} ya está definido`);
                }             
            }else if(child.constructor.name === functionDeclaration.name){
                let func = child as functionDeclaration;
                if(!node.table.addFunc(func)){
                    let funcTypes = func.params.reduce((previus, current) => {
                        if(previus.length === 0){
                            return current.type.toString();
                        }else{
                            return `${previus}, ${current.type.toString()}`;
                        }
                    }, "");
                    logError(func.loc, `La función ${func.id}(${funcTypes}):${func.type.toString()} ya está definida`);
                }            
            }        
        }
    }
}

export default SymTableVisitor;