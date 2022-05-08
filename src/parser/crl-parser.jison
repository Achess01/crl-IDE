/* CRL lexical rules */
%lex

uppercase               [A-Z]
lowercase               [a-z]
digit                   [0-9]

// identifiers
identifier              ({xid_start})({xid_continue})*
xid_start               ("_")|({uppercase})|({lowercase})
xid_continue            {xid_start}|{digit}

// reserved
operators               "++" | "--" |
                        "+" | "-" | "*" | "/" | "%" | "^" |
                        "." | ":" | ";" | "," | "(" | ")" |
                        "==" | "!=" | "<=" | ">=" | "<" | ">" | "~" |
                        "&&" | "||" | "!&" | "!" |
                        "=" 

// strings
string_literal          '"'{string_item}*'"'
string_item             {string_char}|{escapeseq}
string_char             [^\\\n\"]
escapeseq               \\.|\\\n

char_literal            "'"{char_item}"'"
char_char               [^\\\n\']
char_item               {char_char}

// numbers
integer                 {decinteger}
decinteger              (([1-9]{digit}*)|"0")

doubleNumber            {integer}("."{digit}+)?

//Multiline comment
triplesquote            "'''"
multilineComment        {triplesquote}([^(\'\'\')]|\')*{triplesquote}
init_inlineComment      "!!"
inlineComment           {init_inlineComment}[^\n]*
comment                 {multilineComment}|{inlineComment} 



%s INITIAL INLINE DEDENTS

%%

<INITIAL,INLINE><<EOF>> %{ 
                            // if the last statement in indented, need to force a dedent before EOF                            
                            if (this.indents == undefined) { this.indents = [0]; }                            
                            if (this.indents.length > 1) { 
                               this.begin( 'DEDENTS' ); 
                               this.unput(' '); // make sure EOF is not triggered 
                               this.dedents = 1; 
                               this.indents.pop();
                            } else { 
                                return 'EOF'; 
                            } 
                        %}
<INITIAL>\              %{ if (this.indent == undefined) this.indent = 0; this.indent += 1 %}
<INITIAL>\t             %{ if (this.indent == undefined) this.indent = 0; this.indent = ( this.indent + 8 ) & -7 %}
<INITIAL>\n             %{ this.indent = 0 %} // blank line
<INITIAL>{comment}       /* skip comments */
<INITIAL>.              %{ 
                            this.unput( yytext )
                            if (this.indents == undefined) this.indents = [0];
                            var last = this.indents[ this.indents.length - 1 ]
                            if (this.indent == undefined) this.indent = 0;
                            if ( this.indent > last ) {
                                this.begin( 'INLINE' )
                                this.indents.push( this.indent )
                                return 'INDENT'
                            } else if ( this.indent < last ) {
                                this.begin( 'DEDENTS' )
                                this.dedents = 0 // how many dedents occured
                                while( this.indents.length ) {
                                    this.dedents += 1
                                    this.indents.pop()
                                    last = this.indents[ this.indents.length - 1 ]
                                    if ( last == this.indent ) break
                                }
                                if ( !this.indents.length ) {
                                    console.log( "Error de tabulación" )
                                }
                            } else {
                                this.begin( 'INLINE' )
                            }
                        %}
<DEDENTS>.              %{                            
                            this.unput( yytext )
                            if (this.dedents == undefined) this.dedents = 0;                            
                            if ( this.dedents-- > 0 ) {
                                return 'DEDENT'
                            } else {
                                this.begin( 'INLINE' )
                            }
                        %}

<INLINE>\n              %{
                            // implicit line joining
                            if (this.brackets_count == undefined) this.brackets_count = 0;
                            if ( this.brackets_count <= 0 ) {
                                this.indent = 0; 
                                this.begin( 'INITIAL' )
                                return 'NEWLINE'
                            }
                        %}
<INLINE>{comment}        /* skip comments */
<INLINE>\\\n[\ \t\f]*   /* skip line continuations */
<INLINE>[\ \t\f]+       /* skip whitespace, separate tokens */

<INLINE>{char_literal}  return 'CHAR_LITERAL'
<INLINE>{doubleNumber}  return 'NUMBER'
<INLINE>{integer}       return 'NUMBER'
<INLINE>{string_literal} return 'STRING'
<INLINE>{identifier}    %{
                            const keywords = [
                                "Importar", "Incerteza", "crl", 
                                "Double", "Boolean", "String", "Int", "Char", "Void",
                                "true", "false", "Principal", "Retorno", "Para", "Mientras",
                                "Si", "Sino", "Detener", "Continuar", "Mostrar", 
                                "DibujarAST", "DibujarEXP", "DibujarTS"
                            ]
                            return ( keywords.indexOf( yytext ) === -1 )
                                ? 'NAME'
                                : yytext;
                        %}

<INLINE>{operators}     %{
                            if (this.brackets_count == undefined) this.brackets_count = 0;
                            if (yytext == '(' ) {
                                this.brackets_count += 1
                            } else if (yytext == ')' ) {
                                this.brackets_count -= 1
                            }
                            return yytext 
                        %}

<INLINE>.               %{
                            console.log( "Caracter inesperado" + yytext)
                        %}

/lex

%start initialState

%%

initialState
    : file_input
    { return $1 }
    ;

/* file_input
    : EOF
    | file_input0 EOF
    ;  */

file_input    
    : file_input0 EOF
    {         
        $$ = new yy.Program(@$, $1);
    }
    ; 

file_input0
    : header_stmt      
      input_stmt
      {          
          $$ = $1.concat($2);
      }
    ;

header_stmt
    : imports_opt     
      incert_opt
      {          
          $$ = $1.concat($2);
      }
    ;

imports_opt
    : 
    {$$ = []}
    | imports
    {$$ = $1}    
    ;

imports
    : import   
    {$$ = [$1]}  
    | imports import
    {
        $1.push($2);
        $$ = $1;
    }
    ;

import
    : 'Importar' NAME '.' 'crl' new_line_opt   
    {
        $$ = new yy.ImportDeclaration(@$, $2);
    }  
    ;

incert_opt
    : 
    {$$ = []}
    | incert
    {$$ = [$1]}
    ;

incert
    : Incerteza NUMBER new_line_opt    
    {$$ = new yy.Incerteza(@$, Number($2))}
    ;

new_line_opt        
    : 
    | NEWLINE
    ;

input_stmt
    :
    {$$=[]}
    | input_stmt0
    {$$ = $1}
    ;

input_stmt0
    : global_stmt
    { 
        $$ = Array.from($1);
    }
    | input_stmt0 global_stmt
    {        
        if($2.constructor.name === 'Array'){
            $1.push(...$2);
        }else{
            $1.push($2)
        }        
        $$ = $1;
    }
    ;

global_stmt    
    : variable_declarators new_line_opt
    {$$ = $1}
    | variable_assignment new_line_opt
    {$$ = $1}
    | method_declarator new_line_opt
    {$$ = $1}
    ;

variable_declarators
    : type variable_list_declarators
    {
        $2.forEach(v => v.type = $1);
        //$$ = new yy.VariableDeclaration(@$, $2, $1);
        $$ = $2;
    }
    ;

variable_list_declarators
    : variable_declarator
    {$$ = [$1]}
    | variable_list_declarators ',' variable_declarator
    {
        $1.push($3);
        $$ = $1;
    }
    ; 

variable_declarator
    : variable_id
    {         
        $$ = new yy.VariableDeclarator(@$, $1, null);
    }
    | variable_assignment
    {
        $$ = new yy.VariableDeclarator(@$, $1.id, $1.expression);
    }
    ;

variable_id
    : NAME
    {$$ = new yy.Identifier(@$, $1);}
    ;

variable_assignment
    : variable_id '=' expression
    {$$ = new yy.Assignment(@$, $1, $3)}
    ;

type
    : 'Double'
    {$$ = yy.Type.Double}
    | 'Boolean'
    {$$ = yy.Type.Boolean}
    | 'String'
    {$$ = yy.Type.String}
    | 'Int'
    {$$ = yy.Type.Int}
    | 'Char'
    {$$ = yy.Type.Char}
    ;

method_declarator
    : type NAME '(' params_list_opt ')' ':' block   
    {
        $$ = new yy.functionDeclaration(@$, $2, $4, $1, $7);
    } 
    | 'Void' NAME '(' params_list_opt ')' ':' block
    {
        $$ = new yy.functionDeclaration(@$, $2, $4, yy.Type.Void, $7);
    } 
    | 'Void' 'Principal' '(' params_list_opt ')' ':' block
    {
        $$ = new yy.functionMain(@$, $7);
    } 
    ;

params_list_opt
    :
    {$$ = []}
    | params_list
    {$$ = $1}
    ;

params_list
    : param
    {$$ = [$1]}
    | params_list ',' param
    {
        $1.push($3);
        $$ = $1;
    }
    ;

param
    : type variable_id
    {$$ = new yy.functionParam(@$, $1, $2)}
    ;

block
    : NEWLINE INDENT body_block_opt DEDENT
    {$$ = $3}    
    ;

body_block_opt
    :     
    {$$ = []}
    | body_block
    {$$ = $1}
    ;

body_block
    : body_stmt
    {
        $$ = Array.from($1);
    }
    | body_block body_stmt
    {        
        if($2.constructor.name === 'Array'){
            $1.push(...$2);
        }else{
            $1.push($2);
        }                
        $$ = $1;
    }
    ;

body_stmt
    : variable_declarators new_line_opt
    {$$ = $1}
    | variable_assignment new_line_opt
    {$$ = $1}
    | function_call_stmt new_line_opt
    {$$ = $1}
    | if_stmt
    {$$ = $1}
    | for_stmt
    {$$ = $1}
    | while_stmt
    {$$ = $1}
    | drawAST_stmt new_line_opt
    {$$ = $1}
    | drawEXP_stmt new_line_opt
    {$$ = $1}
    | drawTS_stmt new_line_opt
    {$$ = $1}
    | show_stmt new_line_opt
    {$$ = $1}
    | small_stmt
    {$$ = $1}
    ;


small_stmt    
    : break_stmt new_line_opt
    {$$ = $1}
    | continue_stmt new_line_opt
    {$$ = $1}
    | return_stmt NEWLINE
    {$$ = $1}
    ;

function_call_stmt
    : NAME '(' list_values_opt ')'
    {$$ = new yy.CallFunction(@$, $1, $3)}
    ;

list_values_opt
    :
    {$$ = []}
    | list_values
    {$$ = $1}
    ;

list_values
    : expression
    {$$ = [$1]}
    | list_values ',' expression
    {
        $1.push($3);
        $$ = $1;
    }
    ;

if_stmt
    : 'Si' '(' expression ')' ':' block else_opt
    {$$ = new yy.IfStmt(@$, $3, $6, $7)}
    ;

else_opt
    :
    {$$ = []}
    | else_stmt
    {$$ = $1}
    ;

else_stmt
    : 'Sino' ':' block
    {$$ = $3}
    ;

for_stmt
    : 'Para' '(' init_for ';' expression ';' op_for ')' ':' block
    {        
        $$ = new yy.forStmt(@$, $10, $3, $5, $7);
    }
    ;

init_for
    : 'Int' variable_id '=' expression
    {$$ = new yy.VariableDeclarator(@$, $2, $4);}
    ;

op_for
    : '++'
    {$$ = yytext;}
    | '--'
    {$$ = yytext;}
    ;

while_stmt
    : 'Mientras' '(' expression ')' ':' block
    {$$ = new yy.whileStmt(@$, $6, $3);}
    ;

show_stmt
    : 'Mostrar' '(' string_literal ',' format_expressions_opt ')'
    {$$ = new yy.Mostrar(@$, $3, $5);}
    ;

format_expressions_opt
    : 
    {$$ = [];}
    | format_expressions
    {$$ = $1;}
    ;

format_expressions
    : expression
    {$$ = [$1];}
    | format_expressions ',' expression
    {
        $1.push($3);
        $$ = $1;
    }
    ;

drawAST_stmt
    : 'DibujarAST' '(' variable_id ')'
    {$$ = new yy.DibujarAST(@$, $3);}
    ;

drawEXP_stmt
    : 'DibujarEXP' '(' expression ')'
    {$$ = new yy.DibujarEXP($3);}
    ;

drawTS_stmt
    : 'DibujarTS' '(' ')'
    {$$ = new yy.DibujarTS(@$);}
    ;

return_stmt
    : 'Retorno' return_expression_opt
    {$$ = new yy.returnStmt(@$, $2)}
    ;

return_expression_opt
    :
    {$$ = null;}
    | expression
    {$$ = $1;}
    ;

break_stmt
    : 'Detener'
    {$$ = new yy.breakStmt(@$);}
    ;

continue_stmt
    : 'Continuar'
    {$$ = new yy.continueStmt(@$);}
    ;

expression
    : conditional_expression
    {$$ = $1;}
    ;

conditional_expression 
    : conditional_or_expression
    {$$ = $1;}
	;

conditional_or_expression
    : conditional_xor_expression
    {$$ = $1;}
	| conditional_or_expression '||' conditional_xor_expression
    {$$ = new yy.LogicalExpression(@$, yy.Type.Boolean, $1, $2, $3);}
	;

conditional_xor_expression
    : conditional_and_expression
    {$$ = $1;}
    | conditional_xor_expression '!&' conditional_and_expression
    {$$ = new yy.LogicalExpression(@$, yy.Type.Boolean, $1, $2, $3);}
    ;

conditional_and_expression
    : equality_expression
    {$$ = $1;}
	| conditional_and_expression '&&' equality_expression
    {$$ = new yy.LogicalExpression(@$, yy.Type.Boolean, $1, $2, $3);}    
	;

equality_expression
    : relational_expression
    {$$ = $1;}
	| equality_expression '==' relational_expression
    {$$ = new yy.BinaryExpression(@$, yy.Type.Boolean, $1, $2, $3);}
	| equality_expression '!=' relational_expression
    {$$ = new yy.BinaryExpression(@$, yy.Type.Boolean, $1, $2, $3);}
    | equality_expression '~' relational_expression
    {$$ = new yy.BinaryExpression(@$, yy.Type.Boolean, $1, $2, $3);}
	;

relational_expression
	: additive_expression
    {$$ = $1;}
	| relational_expression '<' additive_expression
    {$$ = new yy.BinaryExpression(@$, yy.Type.Boolean, $1, $2, $3);}
	| relational_expression '>' additive_expression
    {$$ = new yy.BinaryExpression(@$, yy.Type.Boolean, $1, $2, $3);}
	| relational_expression '<=' additive_expression
    {$$ = new yy.BinaryExpression(@$, yy.Type.Boolean, $1, $2, $3);}
	| relational_expression '>=' additive_expression	
    {$$ = new yy.BinaryExpression(@$, yy.Type.Boolean, $1, $2, $3);}
	;

additive_expression 
	: multiplicative_expression
    {$$ = $1;}
	| additive_expression '+' multiplicative_expression
    {$$ = new yy.BinaryExpression(@$, null, $1, $2, $3);}    
	| additive_expression '-' multiplicative_expression
    {$$ = new yy.BinaryExpression(@$, null, $1, $2, $3);}
	;

multiplicative_expression 
	: pow_expression
    {$$ = $1;}
	| multiplicative_expression '*' pow_expression
    {$$ = new yy.BinaryExpression(@$, null, $1, $2, $3);}
	| multiplicative_expression '/' pow_expression
    {$$ = new yy.BinaryExpression(@$, null, $1, $2, $3);}
	| multiplicative_expression '%' pow_expression
    {$$ = new yy.BinaryExpression(@$, null, $1, $2, $3);}
	;

pow_expression
    : unary_expression
    {$$ = $1;}
    | unary_expression '^' pow_expression
    {$$ = new yy.BinaryExpression(@$, null, $1, $2, $3);}
    ;

unary_expression	
	: value_literal
    {$$ = $1}
    | variable_id
    {$$ = new yy.UnaryExpression(@$, null, null, $1);}
    | function_call_stmt
    {$$ = new yy.UnaryExpression(@$, null, null, $1);}
	| '-' unary_expression
    {
        $2.operator = $1;
        $$ = $2;
    }
	| '(' expression ')'
    {$$ = $2;}
    | '!' unary_expression    
    {
        $2.operator = $1;
        $$ = $2;
    }
	;

value_literal
    : string_literal
    {$$ = new yy.UnaryExpression(@$, yy.Type.String, null, $1);}
    | NUMBER  
    {
        let tp;
        let num = Number($1);
        num % 1 != 0 ? tp = yy.Type.Double
                            : tp = yy.Type.Int
        $$ = new yy.UnaryExpression(@$, tp, null, num);
    }
    | char_literal
    {$$ = new yy.UnaryExpression(@$, yy.Type.Char, null, $1);}
    | 'true'
    {$$ = new yy.UnaryExpression(@$, yy.Type.Boolean, null, true);}
    | 'false'
    {$$ = new yy.UnaryExpression(@$, yy.Type.Boolean, null, false);}
    ;

string_literal
    : STRING
    {
        let val1 = $1.replaceAll("\"", "");
        $$ = val1;
    }
    ;

char_literal
    : CHAR_LITERAL
    {
        let val2 = $1.replaceAll("'", "");
        $$ = val2;
    }
    ;