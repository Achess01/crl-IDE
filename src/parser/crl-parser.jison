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

%{
    function Operation(type, args){
        this.type = type;
        if(this.type === 'un'){
            this.value = args.value;
        }else{
            this.left = args.left;
            this.right = args.right;
        }
        
    };

    Operation.prototype.run = function(){
        switch(this.type){
            case 'un':
                return Number(this.value);                
            case '+':
                let val = this.left.run() + this.right.run();
                return val;                
        }            
    };

%}

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
    ; 

file_input0
    : header_stmt
      input_stmt
    ;

header_stmt
    : imports_opt
      incert_opt
    ;

imports_opt
    : 
    | imports    
    ;

imports
    : import     
    | imports import
    ;

import
    : 'Importar' NAME '.' 'crl' new_line_opt     
    ;

incert_opt
    : 
    | incert
    ;

incert
    : Incerteza NUMBER new_line_opt    
    ;

new_line_opt        
    : 
    | NEWLINE
    ;

input_stmt
    :
    | input_stmt0
    ;

input_stmt0
    : global_stmt
    | input_stmt0 global_stmt
    ;

global_stmt    
    : variable_declarators new_line_opt
    | variable_assignment new_line_opt
    | method_declarator new_line_opt
    ;

variable_declarators
    : type variable_list_declarators
    ;

variable_list_declarators
    : variable_declarator
    | variable_list_declarator ',' variable_declarator
    ; 

variable_declarator
    : variable_id
    | variable_assignment
    ;

variable_id
    : NAME
    ;

variable_assignment
    : variable_id '=' expression
    ;

type
    : 'Double'
    | 'Boolean'
    | 'String'
    | 'Int'
    | 'Char'
    ;

method_declarator
    : type NAME '(' params_list_opt ')' ':' block    
    | 'Void' NAME '(' params_list_opt ')' ':' block
    | 'Void' 'Principal' '(' params_list_opt ')' ':' block
    ;

params_list_opt
    :
    | params_list
    ;

params_list
    : param
    | params_list ',' param
    ;

param
    : type variable_id
    ;

block
    : NEWLINE INDENT body_block_opt DEDENT    
    ;

body_block_opt
    :     
    | body_block
    ;

body_block
    : body_stmt
    | body_block body_stmt
    ;

body_stmt
    : variable_declarators new_line_opt
    | variable_assignment new_line_opt
    | function_call_stmt new_line_opt
    | if_stmt
    | for_stmt
    | while_stmt
    | drawAST_stmt new_line_opt
    | drawEXP_stmt new_line_opt
    | drawTS_stmt new_line_opt
    | show_stmt new_line_opt
    | small_stmt
    ;


small_stmt    
    : break_stmt new_line_opt
    | continue_stmt new_line_opt
    | return_stmt NEWLINE
    ;

function_call_stmt
    : NAME '(' list_values_opt ')'
    ;

list_values_opt
    :
    | list_values
    ;

list_values
    : expression
    | list_values ',' expression
    ;

if_stmt
    : 'Si' '(' expression ')' ':' block else_opt
    ;

else_opt
    :
    | else_stmt
    ;

else_stmt
    : 'Sino' ':' block
    ;

for_stmt
    : 'Para' '(' 'Int' NAME '=' expression ';' expression ';' op_for ')' ':' block
    ;

op_for
    : '++'
    | '--'
    ;

while_stmt
    : 'Mientras' '(' expression ')' ':' block
    ;

show_stmt
    : 'Mostrar' '(' STRING ',' format_expressions_opt ')'
    ;

format_expressions_opt
    : 
    | format_expressions
    ;

format_expressions
    : expression
    | format_expressions ',' expression
    ;

drawAST_stmt
    : 'DibujarAST' '(' NAME ')'
    ;

drawEXP_stmt
    : 'DibujarEXP' '(' expression ')'
    ;

drawTS_stmt
    : 'DibujarTS' '(' ')'
    ;

return_stmt
    : 'Retorno' return_expression_opt
    ;

return_expression_opt
    :
    | expression
    ;

break_stmt
    : 'Detener'
    ;

continue_stmt
    : 'Continuar'
    ;

expression
    : conditional_expression
    ;

conditional_expression 
    : conditional_or_expression
	;

conditional_or_expression
    : conditional_xor_expression
	| conditional_or_expression '||' conditional_xor_expression
	;

conditional_xor_expression
    : conditional_and_expression
    | conditional_xor_expression '!&' conditional_and_expression
    ;

conditional_and_expression
    : equality_expression
	| conditional_and_expression '&&' equality_expression
	;

equality_expression
    : relational_expression
	| equality_expression '==' relational_expression
	| equality_expression '!=' relational_expression
    | equality_expression '~' relational_expression
	;

relational_expression
	: additive_expression
	| relational_expression '<' additive_expression
	| relational_expression '>' additive_expression
	| relational_expression '<=' additive_expression
	| relational_expression '>=' additive_expression	
	;

additive_expression 
	: multiplicative_expression
	| additive_expression '+' multiplicative_expression
    {
        let obj = new Operation($2, {left:$1, right:$3});        
        console.log(obj.run());
        $$ = obj;        
    }
	| additive_expression '-' multiplicative_expression
	;

multiplicative_expression 
	: pow_expression
	| multiplicative_expression '*' pow_expression
	| multiplicative_expression '/' pow_expression
	| multiplicative_expression '%' pow_expression
	;

pow_expression
    : unary_expression
    | unary_expression '^' pow_expression
    ;

unary_expression	
	: value_literal
    | NAME
    | function_call_stmt
	| MINUS unary_expression
	| '(' expression ')'
    | '!' unary_expression    
	;

value_literal
    : STRING
    | NUMBER
    {$$ = new Operation("un", {value: yytext})}
    | CHAR_LITERAL
    | 'true'
    | 'false'
    ;