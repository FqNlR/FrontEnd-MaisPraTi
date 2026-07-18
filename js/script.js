// Elementos usados no JavaScript

const botaoProjetos = document.getElementById("botao-projetos");
const secaoProjetos = document.getElementById("projetos");
const listaProjetos = document.getElementById("lista-projetos");
const mensagemProjetos = document.getElementById("mensagem-projetos");

const formulario = document.getElementById("formulario-contato");
const resultadoFormulario = document.getElementById(
    "resultado-formulario"
);


// Botão da seção inicial

botaoProjetos.addEventListener("click", function () {
    secaoProjetos.scrollIntoView({
        behavior: "smooth"
    });
});


// Busca os repositórios públicos na API do GitHub

async function buscarProjetos() {
    try {
        const resposta = await fetch(
            "https://api.github.com/users/FqNlR/repos?sort=updated"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os projetos.");
        }

        const repositorios = await resposta.json();

        mensagemProjetos.textContent = "";

        // Ignora repositórios que são cópias de outros projetos
        const projetosProprios = repositorios.filter(function (repositorio) {
            return repositorio.fork === false;
        });

        // Mostra no máximo seis projetos
        const projetosExibidos = projetosProprios.slice(0, 12);

        if (projetosExibidos.length === 0) {
            mensagemProjetos.textContent =
                "Nenhum projeto público foi encontrado.";

            return;
        }

        projetosExibidos.forEach(function (repositorio) {
            criarCardProjeto(repositorio);
        });
    } catch (erro) {
        mensagemProjetos.textContent =
            "Não foi possível carregar os projetos.";

        console.log(erro);
    }
}


// Cria um card para cada projeto retornado pela API

function criarCardProjeto(repositorio) {
    const card = document.createElement("article");
    const titulo = document.createElement("h3");
    const descricao = document.createElement("p");
    const linguagem = document.createElement("p");
    const link = document.createElement("a");

    card.classList.add("projeto");
    linguagem.classList.add("linguagem");

    titulo.textContent = repositorio.name;

    if (repositorio.description) {
        descricao.textContent = repositorio.description;
    } else {
        descricao.textContent = "Projeto disponível no meu GitHub.";
    }

    if (repositorio.language) {
        linguagem.textContent =
            "Linguagem principal: " + repositorio.language;
    } else {
        linguagem.textContent = "Linguagem não informada.";
    }

    link.textContent = "Ver no GitHub";
    link.href = repositorio.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.appendChild(titulo);
    card.appendChild(descricao);
    card.appendChild(linguagem);
    card.appendChild(link);

    listaProjetos.appendChild(card);
}


// Envio simples do formulário

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value;

    resultadoFormulario.textContent =
        "Obrigado pelo contato, " + nome +
        "! Responderei assim que possível.";

    formulario.reset();
});


// Executa a busca quando a página é carregada

buscarProjetos();
