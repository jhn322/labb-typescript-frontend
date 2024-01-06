// The task for this TS file is to calculate mortgage based on the users preference. Mortgage amount, interest rate and repayment time is at the basis of this calculation. Formula used is M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}.

// Grabbed elements from HTML file by their ID
const mortgageForm = document.getElementById("mortgageForm") as HTMLFormElement;
const mortgageAmountInput = document.getElementById(
  "mortgageAmount"
) as HTMLInputElement;
const interestRateInput = document.getElementById(
  "interestRate"
) as HTMLInputElement;
const loanTermInput = document.getElementById("loanTerm") as HTMLInputElement;
const resultDisplay = document.getElementById(
  "results"
) as HTMLParagraphElement;

// Function to calculate the mortgage
function calculateMortgage(event: Event) {
  event.preventDefault();

  const mortgageAmount = parseFloat(mortgageAmountInput.value);
  const interestRate = parseFloat(interestRateInput.value);
  const loanTerm = parseFloat(loanTermInput.value);

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

  const monthlyInterestRate = interestRate / 100 / 12;
  const loanTermMonths = loanTerm * 12;

  const mortgage =
    (mortgageAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) /
    (Math.pow(1 + interestRate, loanTerm) - 1);

  resultDisplay.textContent = `Resultat: ${mortgage.toFixed(2)} kr/månad`;
}

mortgageForm.addEventListener("submit", calculateMortgage);
