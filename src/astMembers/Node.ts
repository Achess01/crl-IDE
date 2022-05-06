abstract class Node{    
    loc: any
    constructor(loc: any){
        this.loc = loc;
    }

    abstract accept(): void;
}

export class Program extends Node{
    body: Node[];
    constructor(loc: any, body: Node[]){
        super(loc);
        this.body = body;
    }

    accept(): void {
        
    }
}

export class ImportDeclaration extends Node{
    fileId: string;
    constructor(loc: any, fileId: string){
        super(loc);
        this.fileId = fileId;
    }

    accept(): void {
        
    }
}

