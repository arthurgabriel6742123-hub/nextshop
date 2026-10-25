
const categorias = {
    "Tecnologia": ["Fone Galáctico", "Carregador Estelar", "Tablet Orbital"],
    "Games": ["Controle Cósmico", "Teclado Gamer", "Mouse Nebulosa"],
    "Acessórios": ["Mochila Lunar", "Relógio Solar", "Óculos Eclipse"],
    "Casa": ["Luminária Lunar", "Caneca Astral", "Almofada Nebulosa"],
    "Moda": ["Camiseta Universo", "Tênis Cometa", "Jaqueta Estelar"]
};

const emojis = {
    "Tecnologia": "🎧",
    "Games": "🎮",
    "Acessórios": "🎒",
    "Casa": "🏠",
    "Moda": "👕"
};

const listaCategorias = Object.keys(categorias);
const produtos = [];

for (let i = 1; i <= 1500; i++) {
    const categoria = listaCategorias[(i - 1) % listaCategorias.length];
    const nomes = categorias[categoria];
    const nomeBase = nomes[Math.floor((i - 1) / listaCategorias.length) % nomes.length];

    produtos.push({
        id: i,
        nome: `${nomeBase} ${i}`,
        categoria,
        preco: Number((19.90 + ((i * 37) % 48000) / 100).toFixed(2)),
        icone: emojis[categoria],
        descricao: `Produto ${i} da coleção ${categoria}.`
    });
}

const grade = document.querySelector("#grade-produtos");
const busca = document.querySelector("#busca");
const filtroCategoria = document.querySelector("#categoria");
const resultado = document.querySelector("#resultado-busca");
const paginacao = document.querySelector("#paginacao");
const quantidadeCarrinho = document.querySelector("#quantidade-carrinho");
const botaoCarrinho = document.querySelector("#botao-carrinho");

const itensPorPagina = 24;
let paginaAtual = 1;
const carrinho = [];

function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function produtosFiltrados() {
    const termo = busca.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;

    return produtos.filter(produto => {
        const combinaNome = produto.nome.toLowerCase().includes(termo);
        const combinaCategoria =
            categoria === "Todas" || produto.categoria === categoria;

        return combinaNome && combinaCategoria;
    });
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(item => item.id === id);
    if (!produto) return;

    carrinho.push(produto);
    quantidadeCarrinho.textContent = carrinho.length;
}

function mostrarProdutos() {
    const encontrados = produtosFiltrados();
    const totalPaginas = Math.ceil(encontrados.length / itensPorPagina);

    if (paginaAtual > totalPaginas) {
        paginaAtual = Math.max(1, totalPaginas);
    }

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const pagina = encontrados.slice(inicio, inicio + itensPorPagina);

    resultado.textContent =
        `${encontrados.length} produtos encontrados • Página ${totalPaginas ? paginaAtual : 0} de ${totalPaginas}`;

    grade.innerHTML = pagina.length
        ? pagina.map(produto => `
            <article class="cartao-produto">
                <div class="icone-produto">${produto.icone}</div>
                <small>${produto.categoria}</small>
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <span class="preco">${moeda(produto.preco)}</span>
                <button onclick="adicionarAoCarrinho(${produto.id})">
                    Adicionar ao carrinho
                </button>
            </article>
        `).join("")
        : "<p>Nenhum produto encontrado.</p>";

    paginacao.innerHTML = "";

    if (totalPaginas > 1) {
        const anterior = document.createElement("button");
        anterior.textContent = "← Anterior";
        anterior.disabled = paginaAtual === 1;
        anterior.onclick = () => {
            paginaAtual--;
            mostrarProdutos();
        };

        const proximo = document.createElement("button");
        proximo.textContent = "Próxima →";
        proximo.disabled = paginaAtual === totalPaginas;
        proximo.onclick = () => {
            paginaAtual++;
            mostrarProdutos();
        };

        paginacao.append(anterior);

        const numero = document.createElement("span");
        numero.textContent = ` Página ${paginaAtual} de ${totalPaginas} `;
        paginacao.append(numero, proximo);
    }
}

busca.addEventListener("input", () => {
    paginaAtual = 1;
    mostrarProdutos();
});

filtroCategoria.addEventListener("change", () => {
    paginaAtual = 1;
    mostrarProdutos();
});

botaoCarrinho.addEventListener("click", () => {
    if (!carrinho.length) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    alert(`Itens no carrinho: ${carrinho.length}\nTotal: ${moeda(total)}`);
});

mostrarProdutos();
