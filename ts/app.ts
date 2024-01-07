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
const summaryDisplay = document.getElementById("summary") as HTMLDivElement;
const tableElement = document.getElementById(
  "amortizationTable"
) as HTMLTableElement;

// Function to calculate the mortgage
function calculateMortgage(event: Event) {
  event.preventDefault();

  const invalidInput = [];

  const mortgageAmount = parseFloat(mortgageAmountInput.value);
  const interestRate = parseFloat(interestRateInput.value);
  const loanTerm = parseFloat(loanTermInput.value);

  // If statements to prevent negative inputs for mortgage amount
  if (mortgageAmount <= 0) {
    invalidInput.push("Skriv inte in ett negativt lånebelopp.");
  }

  // If statements to prevent negative or unrealistically high inputs for interest rate
  if (interestRate < 0 || interestRate > 100) {
    invalidInput.push("Skriv in ett ränteantal mellan 0-100%.");
  }

  // If statements to prevent negative or unrealistically high inputs for loan term
  if (loanTerm <= 0 || loanTerm > 80) {
    invalidInput.push("Skriv in en realistisk återbetalningsperiod.");
  }

  if (invalidInput.length > 0) {
    const errorMessages = invalidInput
      .map((message) => `<li>${message}</li>`)
      .join("");
    summaryDisplay.innerHTML = `<span class='error-message'>Fel:<br><ul>${errorMessages}</ul></span>`;
    return;
  }

  const monthlyInterestRate = interestRate / 100 / 12;
  const loanTermMonths = loanTerm * 12;

  const mortgage =
    (mortgageAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  const totalPayment = mortgage * loanTermMonths;
  const totalInterest = totalPayment - mortgageAmount;

  let remainingLoan = mortgageAmount;
  const amortizationPlan = [];

  for (let i = 1; i <= loanTermMonths; i++) {
    const interestPayment = remainingLoan * monthlyInterestRate;
    const principalPayment = mortgage - interestPayment;

    remainingLoan -= principalPayment;

    amortizationPlan.push({
      month: i,
      payment: mortgage,
      principal: principalPayment,
      interest: interestPayment,
      remainingLoan: remainingLoan,
    });
  }

  const summaryText = `
    Resultat: <strong>${mortgage.toFixed(2)} kr/månad.</strong><br>
    Totala räntekostnaden: <strong>${totalInterest.toFixed(
      2
    )} kr</strong> över <strong>${loanTerm} år.</strong><br>
    Amorteringsplan:
`;

  summaryDisplay.innerHTML = summaryText;

  let output = "";

  amortizationPlan.forEach((payment) => {
    output += `
      <tr>
        <td>${payment.month}</td>
        <td>${payment.payment.toFixed(2)}</td>
        <td>${payment.interest.toFixed(2)}</td>
        <td>${payment.principal.toFixed(2)}</td>
        <td>${payment.remainingLoan.toFixed(2)}</td>
      </tr>`;
  });

  const tableBody = document.getElementById(
    "tableBody"
  ) as HTMLTableSectionElement;
  tableBody.innerHTML = output;

  tableElement.style.display = "table";
}

mortgageForm.addEventListener("submit", calculateMortgage);
