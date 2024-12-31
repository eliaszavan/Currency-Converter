// Exportando traduções de idiomas
import { translations } from './language_selector.js';

// Variável para armazenar o idioma atual
let currentLanguage = "en"; // Define o idioma padrão como "en"

// Seleciona os elementos necessários
let amount = document.querySelector(".amount");
let button = document.querySelector(".convert-button");
let result = document.querySelector(".result");
let result_p = document.querySelector(".subtitle-result");
let from_p = document.querySelector(".from-p");
let to_p = document.querySelector(".to-p");
let amount_p = document.querySelector(".amount-p");
let title = document.querySelector(".title");
let fromSelector = document.getElementById("from");
let toSelector = document.getElementById("to");

const languageSelectorDesktop = document.getElementById("desktop");
const languageSelectorMobile = document.getElementById("mobile");

let fromCurrency = fromSelector.options[fromSelector.selectedIndex].value;
let toCurrency = toSelector.options[toSelector.selectedIndex].value;

// Função para definir o texto do resultado
async function setText(text) {
    result.textContent = text;
}

function updateCurrenciesName() {
    if (fromSelector && toSelector) {
        const fromOptions = fromSelector.options;
        const toOptions = toSelector.options;

        for (let i = 0; i < fromOptions.length; i++) {
            const fromOption = fromOptions[i];
            const toOption = toOptions[i];
            const optionValue = fromOption.value;

            if (translations[currentLanguage] && translations[currentLanguage][optionValue]) {
                fromOption.text = translations[currentLanguage][optionValue];
                toOption.text = translations[currentLanguage][optionValue];
            } else {
                console.warn(`Tradução não encontrada para ${optionValue} no idioma ${currentLanguage}.`);
            }
        }
    } else {
        console.error('Elementos fromCurrency ou toCurrency não encontrados.');
    }
}

// Função para atualizar o idioma
function updateLanguage() {
    // Alterando pequenos textos para o idioma atual.
    title.textContent = translations[currentLanguage].title;
    amount_p.textContent = translations[currentLanguage].amount_p;
    amount.placeholder = translations[currentLanguage].amountPlaceholder;
    from_p.textContent = translations[currentLanguage].from_p;
    to_p.textContent = translations[currentLanguage].to_p;
    result_p.textContent = `${translations[currentLanguage].resultIn} ${toCurrency}:`;

    // Atualizando nome das moedas
    updateCurrenciesName();

    // Atualiza o botão de conversão, se necessário
    button.textContent = translations[currentLanguage].convertButton;
}

// Configura os textos iniciais
let currencySymbol = getCurrencySymbol(toCurrency);
setText(`${currencySymbol}0.00`);
updateLanguage(); // Atualiza os textos com base no idioma atual

// Atualiza o resultado quando os selects mudam
[fromSelector, toSelector].forEach(selector => {
    selector.addEventListener("change", () => {
        fromCurrency = fromSelector.options[fromSelector.selectedIndex].value;
        toCurrency = toSelector.options[toSelector.selectedIndex].value;
        currencySymbol = getCurrencySymbol(toCurrency);
        setText(`${currencySymbol}0.00`);
        updateLanguage();
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
            throw new Error(translations[currentLanguage].exchangeRateError);
        }

        const data = await response.json();

        // Obtém a taxa de câmbio para a moeda de destino
        const rate = data.rates[toCurrency];
        if (!rate) {
            setText(translations[currentLanguage].invalidCurrency);
            return;
        }

        // Converte o valor inserido
        const amountValue = parseFloat(amount.value);
        if (isNaN(amountValue)) {
            setText(translations[currentLanguage].invalidNumber);
            return;
        }

        const convertedAmount = amountValue * rate;
        const currencySymbol = getCurrencySymbol(toCurrency);

        // Exibe o resultado formatado
        result.textContent = `${currencySymbol}${convertedAmount.toFixed(2)}`;
    } catch (error) {
        console.error(error);
        setText(translations[currentLanguage].conversionError);
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

// Função para atualizar o idioma quando o usuário seleciona uma nova língua
function handleLanguageChange(e) {
    currentLanguage = e.target.value; // Atualiza o idioma atual
    updateLanguage(); // Atualiza os textos da interface
}

// Adiciona evento de mudança para o seletor de idioma no desktop e mobile
languageSelectorDesktop.addEventListener("change", handleLanguageChange);
languageSelectorMobile.addEventListener("change", handleLanguageChange);