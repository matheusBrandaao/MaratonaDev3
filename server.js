/*configurando o servidor*/
const express = require("express");
const server = express();

/**configurar o servidor para apresentar arquivos estaticos pois com a 
 * configuracao do nunjucks foi apenas o html
*/
server.use(express.static('public'));

//habilitar body do formulario
server.use(express.urlencoded({extended: true}));

//configurar conexao com o banco de dados
const Pool = require('pg').Pool; //Pool -> tipo de conexao para manter a conexao ativa sem precisar conectar novamente no BD
const db = new Pool(
    {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'doe'
    }
);

/**Configurando a template engine, permite enviar dados para o html*/
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    //objeto
    express: server,
    noCache: true
});

// /**Lista de doadores */
// const donors = [
//     {
//         name: "Diego Fernandes",
//         blood: "AB+"
//     },
//     {
//         name: "Cleiton Souza",
//         blood: "B+"
//     },
//     {
//         name: "Robson Marques",
//         blood: "O+"
//     },
//     {
//         name: "Mayk Brito",
//         blood: "A-"
//     }
// ];

/**Configurar a apresentação da pagina, get pegar dados*/
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err){
            res.send("Erro de banco de dados.");
        }
        const donors = result.rows;
        return res.render("index.html", {donors});
    }); 
});

//post pegar dados 
server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // //colocando valores dentro do array
    // donors.push(
    // {
    //     name: name, 
    //     blood: blood
    // });

    //colocar valores dentro do BD
    const query = `INSERT INTO donors ("name", "email", "blood") 
                   VALUES ($1, $2, $3)`; //referencia os value de name, email e blood

    const values = [name, email, blood];
    
    db.query(query, values, function(err){
        if(err) {
            return res.send("Erro no banco de dados.")
        }
        res.redirect("/")
    });
});

/*Ligar o servidor e permitir o acesso a porta 3000*/
server.listen(3000, function(){ /*Colocando a função apenas para entendimento*/
    console.log("Servidor iniciado");
});