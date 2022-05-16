import { Program } from 'src/astMembers/Node';

class CRLFile {
  name: string;
  content: string;
  program?: Program;  
  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}

export default CRLFile;
