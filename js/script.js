let amount = document.querySelector(".amount");
let button = document.querySelector("button");
let result = document.querySelector(".result");
let p = document.querySelector(".title-result");

let selector = document.querySelector(".currency-selector");

async function setText(text) {
    result.textContent = text;
}

let currencySelected = selector.options[selector.selectedIndex].value;
let currencySymbol = getCurrencySymbol(currencySelected);

//Configurando textos
setText(`${currencySymbol}0.00`);
p.textContent = `Resultado em ${currencySelected}:`;

selector.addEventListener("change", (s) => {
    //Atualizando variáveis
    currencySelected = selector.options[selector.selectedIndex].value;
    currencySymbol = getCurrencySymbol(currencySelected);
    setText(`${currencySymbol}0.00`);
    p.textContent = `Resultado em ${currencySelected}:`;
});

//Funções
function getCurrencySymbol(currencyCode) {
    const symbols = {
        USD: "$",
        CNY: "¥",
        EUR: "€",
        BRL: "R$"
    };
    return symbols[currencyCode] || "";
}

async function convert() {
    currencySelected = selector.options[selector.selectedIndex].value

    try {
        // URL da API para obter a taxa de câmbio de BRL para USD
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL");
        if (!response.ok) {
            throw new Error("Erro ao obter a taxa de câmbio.");
        }

        const data = await response.json();

        //Obtendo a conversão
        const rate = data.rates[currencySelected];
        if (!rate) {
            setText("Moeda selecionada inválida.");
            return;
        }

        // Convertendo o valor inserido
        const brlAmount = parseFloat(amount.value);
        if (isNaN(brlAmount)) {
            setText("Por favor, insira um valor válido.");
            return;
        }

        const convertedAmount = brlAmount * rate;
        const currencySymbol = getCurrencySymbol(currencySelected);

        // Exibindo o resultado formatado
        result.textContent = `${currencySymbol}${convertedAmount.toFixed(2)}`;
    } catch (error) {
        console.error(error);
        setText("Erro ao realizar a conversão. Tente novamente mais tarde.");
    }
}

button.addEventListener("click", (e) => {
    e.preventDefault();
    convert();
});