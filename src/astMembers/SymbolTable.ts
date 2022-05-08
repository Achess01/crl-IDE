import { functionDeclaration, VariableDeclarator } from "./Node";

export class SymTable{
    name:string;
    private symbolVars: { [id: string] : VariableDeclarator} = {};
    private symbolFuncs: { [id: string] : functionDeclaration} = {};
    constructor(name:string){
        this.name = name;
    }

    getVariable(id:string): VariableDeclarator | undefined{        
        return this.symbolVars[id];
    }

    getFunction(id:string): functionDeclaration | undefined{
        return this.symbolFuncs[id];
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
