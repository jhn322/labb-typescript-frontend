// The task for this TS file is to calculate mortgage based on the users preference. Mortgage amount, interest rate and repayment time is at the basis of this calculation. Formula used is M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}.
// Grabbed elements from HTML file by their ID
var mortgageForm = document.getElementById("mortgageForm");
var mortgageAmountInput = document.getElementById("mortgageAmount");
var interestRateInput = document.getElementById("interestRate");
var loanTermInput = document.getElementById("loanTerm");
var resultDisplay = document.getElementById("results");
// Function to calculate the mortgage
function calculateMortgage(event) {
    event.preventDefault();
    var mortgageAmount = parseFloat(mortgageAmountInput.value);
    var interestRate = parseFloat(interestRateInput.value) / 100 / 12;
    var loanTerm = parseFloat(loanTermInput.value) * 12;
    var mortgage = (mortgageAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) /
        (Math.pow(1 + interestRate, loanTerm) - 1);
    resultDisplay.textContent = "Resultat: ".concat(mortgage.toFixed(2), " kr/m\u00E5nad");
}
mortgageForm.addEventListener("submit", calculateMortgage);
