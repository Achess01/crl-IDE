import { functionDeclaration, VariableDeclarator } from "./Node";

export class SymTable{
    name:string;
    private symbolVars: { [id: string] : VariableDeclarator} = {};
    private symbolFuncs: { [id: string] : functionDeclaration} = {};
    upperAmbit: SymTable | null;
    constructor(name:string){
        this.name = name;
        this.upperAmbit = null;
    }

    addUpperAmbit(upperTable:SymTable){        
        this.upperAmbit = upperTable;
    }

    getVariable(id:string): VariableDeclarator | undefined{    
        let variable = this.symbolVars[id];
        if(variable !== undefined){
            return variable;
        }else if(this.upperAmbit !== null){                                    
            let higherVariable = this.upperAmbit.getVariable(id);
            return higherVariable;
        }
        return undefined;
    }

    getFunction(id:string): functionDeclaration | undefined{
        let func  = this.symbolFuncs[id];
        if(func !== undefined){
            return func;
        }else if(this.upperAmbit !== null){
            let higherFunc = this.upperAmbit.getFunction(id);
            return higherFunc;
        }
        return undefined;
    }
    
    addVariable(variable: VariableDeclarator): boolean{
        if(this.isInsertableVar(variable.id.name)){
            this.symbolVars[variable.id.name] = variable;
            return true;
        }
        return false;
    }

    addFunc(func: functionDeclaration): boolean{
        if(this.isInsertableFunc(func.nameForTable)){
            this.symbolFuncs[func.nameForTable] = func;            
            return true;
        }
        return false;
    }

    isInsertableVar(id: string): boolean{        
        return this.symbolVars[id] === undefined; 
    }

    isInsertableFunc(id: string): boolean{
       return this.symbolFuncs[id] === undefined; 
    }
}
