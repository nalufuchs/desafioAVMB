const cors = require("cors");
const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Documentação da API usando Swagger  (tive dificuldade em entender o funcionamento, então fiz, mas não é responsivo)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Para acessar: http://localhost:3000/api-docs



var corsOptions = {
    origin: "http://localhost:5174"
  };
var corsOptions = {
origin: "http://localhost:5173"
};
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json())


// Repositórios fixos a serem utilizados no programa 
//P.S.: Sei que o ideal não é utilizar global, porém foi o jeito que consegui.
global.idUsuario = null;
global.idRepositorio = null;


const token = "nIXKkUt1Hn35QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvZIr2VnOlwD32sFsC2mlsuTuxUDFANKvG2UmDu+l-B0xPWrbnT8Z+ngZ71eS7PP6x+";



// Função para fazer as requisições à API da Asten Assinatura
async function fazerRequisicao(nomeDoServico, parametros = {}) {
    const resposta = await axios.post(`https://plataforma.astenassinatura.com.br/api/${nomeDoServico}`, {
        "token" : token,
        params: parametros
    });
    return resposta.data.response;
}

// Fazer uma requisição para obter o identificador do usuário e a partir dali conseguir utilizar os dados.
async function getUsuarioID() {
    const resposta = await fazerRequisicao('getIdentificador');
    global.idUsuario = resposta.Usuario.id;

}

// Função inicializadora onde, ao iniciar, já consigo recuperar a id do usuário e seu repositóro (necessários para as manipulações dos envelopes)
async function init() {
    try {
        await getUsuarioID();

        const repositorios = await fazerRequisicao('getRepositoriosDoUsuario', { "idProprietario": global.idUsuario });

        // Verifica se há repositórios retornados
        if (repositorios.length == 0) {
            throw new Error('Nenhum repositório encontrado para o usuário.');
        }
        global.idRepositorio = repositorios[0].id; // Acessa o ID do primeiro repositório, sendo o único utilizado a fim de facilitar a minha vida
    } catch (erro) {
        console.error('Erro ao obter IDs:', erro);
    }
}

// Consultar Status de todos os envelopes de maneira genérica 
async function consultar_todos_envelopes() {
    const response = await fazerRequisicao('getEnvelopesByRepositorioOuPasta', { "idRepositorio" : global.idRepositorio });

    // Filtra apenas as informações desejadas dos envelopes
    envelopesFiltrados = response.map(envelope => ({
        idEnvelope: envelope.id,
        status:  getStatus(envelope.status),
        descricao: envelope.descricao
    }));
    return envelopesFiltrados;
}

//Retornar a descricao do status de maneira mais visível
function getStatus( i ) {
    if(i == 1) { return 'Em construção'}
    if(i == 2) { return 'Aguardando Assinaturas'}
    if(i == 3) { return 'Concluído'}
    if(i == 4) { return 'Arquivado'}
    if(i == 5) { return 'Cancelado'}
    if(i == 6) { return 'Expirado'}
}


 
// Requisição para postar um envelope
async function inserirEnvelope(descricao, pdf_base64, emailSignatario) {
        const parametros = {
            "Envelope": {
            "descricao": descricao,
            "Repositorio": {
                "id": global.idRepositorio
            },
            "listaDocumentos": {
                "Documento": [
                {
                    "nomeArquivo": "Documento.pdf",
                    "mimeType": "application/pdf",
                    "conteudo": pdf_base64
                },
                ]
            },
            }
          }

    const response = await fazerRequisicao('inserirEnvelope',  parametros);
    const idEnvelope = response.data.idEnvelope
    resposta = response.mensagem
    inserirSignatario(idEnvelope, emailSignatario)
    return resposta
};


// Inserção de signatário
async function inserirSignatario(idEnvelope, emailSignatario) {
    const parametros = {
        "SignatarioEnvelope": {
            "Envelope": {
              "id": idEnvelope
            },
            "ordem": 1,
            "tagAncoraCampos": null,
            "ConfigAssinatura": {
              "emailSignatario": emailSignatario
            }
          }
        }
    const response = await fazerRequisicao('inserirSignatarioEnvelope',  parametros);
    resposta = response.mensagem
    console.log(response.mensagem)
    return resposta
};
  

// Consultar status de um envelope específico e verificar sua situação
async function consultarStatusEnvelope(idEnvelope) {
    const response = await fazerRequisicao("getEventosDoEnvelope", { idEnvelope });

    // Filtra apenas as informações desejadas dos envelopes
    infoImportante = response.map(informacao => ({
        detalhesOperacao: informacao.detalhesOperacao,
        emailDestinatario:  informacao.emailUsuario,
        dataHoraEvento: informacao.dataHoraEvento
    }));

    return infoImportante;
};


// Inicializando o programa com a porta dentro, já para iniciar o programa com as variáveis de repositório e id do usuário.
init().then(() => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
    
});


// REQUISIÇÕES:

//Consultar o status dos envelopes de maneira genérica
app.get('/api/consultar-envelopes', (req, res) => {
    // consultar envelope
     consultar_todos_envelopes().then((envelopes) => {
        res.send(envelopes);
    });
});


// Consultar o status do envelope buscado e suas atualizações feitas desde a criação
app.get('/api/consultar-status-envelope/:idEnvelope', (req, res) => {
    const idEnvelope = req.params.idEnvelope
    consultarStatusEnvelope(idEnvelope).then((resposta) => {
        res.send(resposta);
    });
});




//Criar envelopes:
app.post('/api/criar-envelope', (req, res) => {
    try {
        const { descricao, documento, emailSignatario } = req.body;
        
        // Verifica se os parâmetros necessários foram fornecidos
        if (!descricao || !documento || !emailSignatario) {
            console.log('Parametros invalidos')
            return res.status(400).send('Parâmetros inválidos');
        }

        // Chama a função para inserir o envelope
        const respostaEnvelope = inserirEnvelope(descricao, documento, emailSignatario).then((resposta) =>{
            // Retorna uma resposta de sucesso
            res.send(respostaEnvelope)
        });
    } catch (error) {
        console.error('Erro ao criar envelope:', error);
        res.status(500).send('Erro ao criar envelope');
    }
});
