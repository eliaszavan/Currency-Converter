// Seleciona os elementos necessários
let amount = document.querySelector(".amount");
let button = document.querySelector("button");
let result = document.querySelector(".result");
let p = document.querySelector(".title-result");
let fromSelector = document.getElementById("from");
let toSelector = document.getElementById("to");

// Função para definir o texto do resultado
async function setText(text) {
    result.textContent = text;
}

// Configura os textos iniciais
let fromCurrency = fromSelector.options[fromSelector.selectedIndex].value;
let toCurrency = toSelector.options[toSelector.selectedIndex].value;
let currencySymbol = getCurrencySymbol(toCurrency);
setText(`${currencySymbol}0.00`);
p.textContent = `Result in ${toCurrency}:`;

// Atualiza o resultado quando os selects mudam
[fromSelector, toSelector].forEach(selector => {
    selector.addEventListener("change", () => {
        fromCurrency = fromSelector.options[fromSelector.selectedIndex].value;
        toCurrency = toSelector.options[toSelector.selectedIndex].value;
        currencySymbol = getCurrencySymbol(toCurrency);
        setText(`${currencySymbol}0.00`);
        p.textContent = `Result in ${toCurrency}:`;
    });
});

// Função para obter o símbolo da moeda
function getCurrencySymbol(currencyCode) {
    const symbols = {
        USD: "$",
        CNY: "¥",
        EUR: "€",
        BRL: "R$"
    };
    return symbols[currencyCode] || "";
}

// Função de conversão
async function convert() {
    try {
        // URL da API com a moeda de origem
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) {
            throw new Error("Error getting exchange rate.");
        }

        const data = await response.json();

        // Obtém a taxa de câmbio para a moeda de destino
        const rate = data.rates[toCurrency];
        if (!rate) {
            setText("Invalid selected currency.");
            return;
        }

        // Converte o valor inserido
        const amountValue = parseFloat(amount.value);
        if (isNaN(amountValue)) {
            setText("Please enter a valid value.");
            return;
        }

        const convertedAmount = amountValue * rate;
        const currencySymbol = getCurrencySymbol(toCurrency);

        // Exibe o resultado formatado
        result.textContent = `${currencySymbol}${convertedAmount.toFixed(2)}`;
    } catch (error) {
        console.error(error);
        setText("Error performing conversion.");
    }
}

// Adiciona evento ao botão
button.addEventListener("click", (e) => {
    e.preventDefault();
    convert();
});

const select1 = document.getElementById("from");
const select2 = document.getElementById("to");

function syncSelectors() {
    // Valores selecionados
    const value1 = select1.value;
    const value2 = select2.value;

    // Atualiza o select1 (origem)
    Array.from(select1.options).forEach(option => {
        option.disabled = option.value === value2;
    });

    // Atualiza o select2 (destino)
    Array.from(select2.options).forEach(option => {
        option.disabled = option.value === value1;
    });
}

// Monitora mudanças em ambos os selects
select1.addEventListener("change", syncSelectors);
select2.addEventListener("change", syncSelectors);

// Executa a sincronização ao carregar a página
document.addEventListener("DOMContentLoaded", syncSelectors);