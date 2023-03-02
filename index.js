const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//Database
connection.authenticate().then(() => {
    console.log("Conexão feita com o banco de dados!")
}).catch(err => {
    console.log(`${err.message} Falha ao conectar com banco de dados!`)
})

// Estou dizenddo para o express usar o EJS como view engine
app.set('view engine', 'ejs');
// Arquivos estaticos
app.use(express.static('public'));

// Permite que o backend leia os dados do frontend
app.use(bodyParser.urlencoded({ extended: false }));
// Permite que o backend leia os dados de uma API
app.use(bodyParser.json());

app.get('/', (req, res) => {
    // Pergunta.findAll() = SELECT * ALL FROM perguntas
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC'] // ASC = crescente || DESC = Descrescente
        ]
    }).then(perguntas => {
        res.render('index', {
            // pra mostrar as pergunta no frontEnd
            perguntas: perguntas
        });
    });

});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

//recebendo os dados do front
app.post('/salvarpergunta', (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    // Create e o mesmo que INSERT INTO 'nome da variavel' para inserir no banco de dados
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {
    const id = req.params.id;
    Pergunta.findOne({
        where: { id: id },
    }).then(pergunta => {
        if (pergunta != undefined) { // Pergunta encontrada

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
        } else { // Não encontrada
            res.redirect('/');
        }
    });
});

app.post("/responder", (req, res) => {
    const corpo = req.body.corpo;
    const perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId,
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`); // res.redirect("/pergunta/4")
    })
});

app.listen(3000, () => {
    console.log("http://localhost:3000/");
    console.log("Servidor iniciado");
});