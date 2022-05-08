import { functionDeclaration, VariableDeclarator } from "./Node";

export class SymTable{
    name:string;
    private symbolVars: { [id: string] : VariableDeclarator} = {};
    private symbolFuncs: { [id: string] : functionDeclaration[]} = {};
    constructor(name:string){
        this.name = name;
    }

    addVariable(variable: VariableDeclarator): boolean{
        if(!this.itExists(variable.id.name)){
            this.symbolVars[variable.id.name] = variable;
            return true;
        }
        return false;
    }

    addFunc(func: functionDeclaration): boolean{
        if(this.isInsertableFunc(func)){
            let funcs = this.symbolFuncs[func.id];
            if(funcs === undefined){
                this.symbolFuncs[func.id] = [func];
            }else{
                funcs.push(func);
            }
            return true;
        }
        return false;
    }

    itExists(id: string): boolean{        
        return this.symbolVars[id] !== undefined; 
    }

    isInsertableFunc(funcDec: functionDeclaration): boolean{
        let funcs = this.symbolFuncs[funcDec.id];
        if(funcs === undefined) return true;        
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
