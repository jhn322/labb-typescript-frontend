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
    var interestRate = parseFloat(interestRateInput.value);
    var loanTerm = parseFloat(loanTermInput.value);
    // If statements to prevent negative inputs for mortgage amount
    if (mortgageAmount <= 0) {
        resultDisplay.textContent = "Skriv inte in ett negativt lånebelopp.";
        return;
    }
    // If statements to prevent negative or unrealistically high inputs for interest rate
    if (interestRate < 0 || interestRate > 100) {
        resultDisplay.textContent = "Skriv in ett ränteantal mellan 0-100%";
        return;
    }
    // If statements to prevent negative or unrealistically high inputs for loan term
    if (loanTerm <= 0 || loanTerm > 80) {
        resultDisplay.textContent = "Skriv in en realistisk återbetalningsperiod";
        return;
    }
    var monthlyInterestRate = interestRate / 100 / 12;
    var loanTermMonths = loanTerm * 12;
    var mortgage = (mortgageAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) /
        (Math.pow(1 + interestRate, loanTerm) - 1);
    resultDisplay.textContent = "Resultat: ".concat(mortgage.toFixed(2), " kr/m\u00E5nad");
}
mortgageForm.addEventListener("submit", calculateMortgage);
