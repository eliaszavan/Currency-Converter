let amount = document.querySelector(".amount");
let button = document.querySelector("button");
let result = document.querySelector(".result");

async function convert() {
    try {
        // URL da API para obter a taxa de câmbio de BRL para USD
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL");
        if (!response.ok) {
            throw new Error("Erro ao obter a taxa de câmbio.");
        }

        const data = await response.json();

        // Obtendo a taxa de conversão BRL para USD
        const rate = data.rates.USD;

        // Convertendo o valor inserido
        const brlAmount = parseFloat(amount.value);
        if (isNaN(brlAmount)) {
            result.textContent = "Por favor, insira um valor válido.";
            return;
        }

        const convertedAmount = brlAmount * rate;

        // Exibindo o resultado formatado
        result.textContent = `$${convertedAmount.toFixed(2)}`;
    } catch (error) {
        console.error(error);
        result.textContent = "Erro ao realizar a conversão. Tente novamente mais tarde.";
    }
    result.textContent = `$` + data.result.toFixed(2);
}

button.addEventListener("click", (e) => {
    e.preventDefault();
    convert();
});