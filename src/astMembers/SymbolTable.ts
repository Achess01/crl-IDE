import { functionDeclaration, Identifier, Type, VariableDeclarator } from "./Node";


export class VarSymbol{
    type: Type
    id: Identifier
    value: number | string | boolean | null;
    constructor(type: Type, id: Identifier){
        this.type = type;
        this.id = id;
        this.value = null;
    }
    
}


export class SymTable{
    private symbolVars: { [id: string] : VarSymbol} = {};
    private symbolFuncs: { [id: string] : functionDeclaration[]} = {};



    addVariable(variable: VariableDeclarator, kind:Type): boolean{
        if(this.itExists(variable.id.name)){
            this.symbolVars[variable.id.name] = new VarSymbol(kind, variable.id);
            return true;
        }
        return false;
    }

    addFunc(func: functionDeclaration): boolean{
        if(this.isInsertableFunc(func)){
            let funcs = this.symbolFuncs[func.id];
            funcs.push(func);
            return true;
        }
        return false;
    }

    itExists(id: string): boolean{
        return this.symbolVars[id] === undefined; 
    }

    isInsertableFunc(funcDec: functionDeclaration): boolean{
        let funcs = this.symbolFuncs[funcDec.id];
        if(funcs === undefined) return true;
        let isInsertable = true;
        for(let fn of funcs){
            if(funcDec.params.length == fn.params.length){                
                let repeatedParams = true;
                for(let index in funcDec.params){                    
                    if(
                        funcDec.params[index].type 
                        !==
                        fn.params[index].type
                    )
                    {
                        repeatedParams = false;
                        break;
                    }
                }
                if(repeatedParams) return false;
            }
        }        
        return true;
    }
}
