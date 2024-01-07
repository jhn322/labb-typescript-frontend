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

  // Extracts values from input field and parsing them as floating point numbers
  const mortgageAmount = parseFloat(mortgageAmountInput.value);
  const interestRate = parseFloat(interestRateInput.value);
  const loanTerm = parseFloat(loanTermInput.value);

  // ---------------------------- //
  // Code for invalid inputs     //
  // -------------------------- //

  // Array to store potential error messages
  const invalidInput = [];

  // If validation with error message to prevent negative or unrealistic numbers for inputs
  if (mortgageAmount <= 0) {
    invalidInput.push("Skriv inte in ett negativt lånebelopp.");
  }

  if (interestRate < 0 || interestRate > 100) {
    invalidInput.push("Skriv in ett ränteantal mellan 0-100%.");
  }

  if (loanTerm <= 0 || loanTerm > 80) {
    invalidInput.push("Skriv in en realistisk återbetalningsperiod.");
  }

  // Validates and displays multiple error messages at once for multiple input fields
  if (invalidInput.length > 0) {
    const errorMessages = invalidInput
      .map((message) => `<li>${message}</li>`)
      .join("");
    summaryDisplay.innerHTML = `<span class='error-message'>Fel:<br><ul>${errorMessages}</ul></span>`;
    return;
  }

  // ---------------------------- //
  // Code for calculations       //
  // -------------------------- //

  // Calculates monthly interest rate and total number for the loan
  const monthlyInterestRate = interestRate / 100 / 12;
  const loanTermMonths = loanTerm * 12;

  // Calculates the monthly mortgage payment using the math formula
  const mortgage =
    (mortgageAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  // Calculates total payment & interest over the loan term
  const totalPayment = mortgage * loanTermMonths;
  const totalInterest = totalPayment - mortgageAmount;

  let remainingLoan = mortgageAmount;
  // Array to store the amortized plan
  const amortizationPlan = [];

  // Calculating payments, principal, interest, and remaining loan balance for each month to generate amort
  for (let i = 1; i <= loanTermMonths; i++) {
    const interestPayment = remainingLoan * monthlyInterestRate;
    const principalPayment = mortgage - interestPayment;

    remainingLoan -= principalPayment;

    // Pushes payment details into the array
    amortizationPlan.push({
      month: i,
      payment: mortgage,
      principal: principalPayment,
      interest: interestPayment,
      remainingLoan: remainingLoan,
    });
  }

  // ---------------------------- //
  // Code for summary displayed  //
  // -------------------------- //

  // Summary text
  const summaryText = `
    Resultat: <strong>${mortgage.toFixed(2)} kr/månad.</strong><br>
    Totala räntekostnaden: <strong>${totalInterest.toFixed(
      2
    )} kr</strong> över <strong>${loanTerm} år.</strong><br>
    Amorteringsplan:
`;

  // Initilize the summary text for display
  summaryDisplay.innerHTML = summaryText;

  // ---------------------------- //
  // Code for amortazation table //
  // -------------------------- //

  // Stores the table
  let output = "";

  // Generates table for amortazation plan
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

  // Retrieves the table from HTML by ID
  const tableBody = document.getElementById(
    "tableBody"
  ) as HTMLTableSectionElement;

  // Sets the HTML content of the table to the generated output
  tableBody.innerHTML = output;

  // Changes the table to visible by setting its display style property to 'table'
  tableElement.style.display = "table";
}

// Adds an eventListener to the mortgage form to trigger the function when user submit
mortgageForm.addEventListener("submit", calculateMortgage);
