/*Amadeu Carvalho
Entrevista ClassApp*/

const readline = require('readline')
const fs       = require('fs')
const readable = fs.createReadStream('input.csv')

const rl = readline.createInterface({
input: readable,
//output: process.stdout
})

var tags = 0;
var eidAnterior = 0;
var o = {} // empty Object
var key = 'Alunos';
o[key] = [];
var json;
var tagResponsavel = " ";
var colunaAnterior = " ";
var addressRegistros = "";
var classesRegistros = " ";

function normalizaColuna(line,coluna){
	tagColuna = line[coluna].replace("," , "");
	tagColuna = tagColuna.substring(line[coluna].indexOf(" "));
	tagColuna = tagColuna.replace("\"" , "");
	tagColuna = tagColuna.trim();
	tagColuna = tagColuna.split(" ");
	return tagColuna;
}

function normalizaClasse(salas){
	var classes = salas[2] + "," + salas[3].replace("\"","") ;
	classes = classes.trim();
	//classes = classes.split(" / ");
	classes = classes.replace("\"" , "");
	classes = classes.replace(" / " , ",");
	classes = classes.replace(", " , ",");
	classes = classes.split(",")
	return classes;
}

function normalizeTagName(line, coluna){
	var tagName = line[coluna].replace("\"" , "");
	tagName = tagName.split(" ");
	return tagName[0];
}

function splitCsv(str) {
  return str.split(',').reduce((accum,curr)=>{
    if(accum.isConcatting) {
      accum.soFar[accum.soFar.length-1] += ','+curr
    } else {
      accum.soFar.push(curr)
    }
    if(curr.split('"').length % 2 == 0) {
      accum.isConcatting= !accum.isConcatting
    }
    return accum;
  },{soFar:[],isConcatting:false}).soFar
}

rl.on('line', (line) =>{
	

	var colunas = splitCsv(line);
	if (tags == 0){
		tagName_4 = normalizeTagName(colunas, 4); 
		tagType_4 = normalizaColuna(colunas,4);

		tagType_5 = normalizaColuna(colunas,5);	
		tagName_5 = normalizeTagName(colunas, 5); 
		
		tagType_6 = normalizaColuna(colunas,6);	
		tagName_6 = normalizeTagName(colunas, 6); 

		tagName_7 = normalizeTagName(colunas, 7); 
		tagType_7 = normalizaColuna(colunas,7);

		tagName_8 = normalizeTagName(colunas, 8); 
		tagType_8 = normalizaColuna(colunas, 8);
	}else{

		var fullname = colunas[0];
		var eid = colunas[1];
		var invisible = colunas[10] == 1 ? true : false;
		var see_all = colunas[11] == "yes" ? true : false;

        classes = normalizaClasse(colunas);

	    if (eidAnterior == colunas[1] && eidAnterior != 0){
	    	classes =  normalizaClasse(colunas);
	    	classesRegistros = normalizaClasse(colunaAnterior) + "," + classes;
			classesRegistros = classesRegistros.split(",");
		    
		    invisible = colunas[10] == 1 || colunaAnterior[10] == 1 ? true: false;
		    see_all = colunas[11] == "yes" || colunaAnterior[11] == "yes" ? true: false;

		    address = [
		        {type: tagName_6 , tags: tagType_6},
    			{address : colunaAnterior[6]},
    			{type: tagName_7 , tags: tagType_7},
    			{address : colunaAnterior[7]},
    			{type: tagName_8 , tags: tagType_8},
    			{address : colunaAnterior[8]},
    			{type: tagName_4 , tags: tagType_4},
    			{address : colunas[4].split("/")},
    			{type: tagName_5 , tags: tagType_5},
    			{address : colunas[5]},
    			{type: tagName_6 , tags: tagType_6},
    			{address : colunas[6]},

			];
			
			var data = {
    			fullname: fullname,
    			eid: eid,
    			classes: classesRegistros,
    			addresses: address,
    			invisible: invisible,
    			see_all: see_all
			};
			o[key].push(data);	
			json = JSON.stringify(o, null, '\t');
			fs.writeFile('./output.json', json, (err) => {
    			if (!err) {
        			console.log(fullname);
    			}
			});

    	}else if (eidAnterior != 0 && eidAnterior != colunas[1]){
    	
   			var address = [
    			{type: tagName_6 , tags: tagType_6},
    			{address : colunas[6]},
    			{type: tagName_4 , tags: tagType_4},
    			{address : colunas[4]}
			];

    		var data = {
    			fullname: fullname,
    			eid: eid,
    			classes: classes,
    			addresses: address,
    			invisible: invisible,
    			see_all: see_all
			};
	
			o[key].push(data);	
			json = JSON.stringify(o, null, '\t');
	
			fs.writeFile('./output.json', json, (err) => {
    			if (!err) {
        			console.log(fullname);
    			}
			});
    	}/*else if (eidAnterior != colunas[1]){


    	}*/

    eidAnterior = colunas[1];
	}
    colunaAnterior = colunas;
	tags = 1;
}); 
