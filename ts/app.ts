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

// Interface for amortization plan
interface AmortizationPlan {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingLoan: number;
}

// Function to validate if a string represents a valid number
function isValidNumber(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

// Function to validate if a string represents a positive number
function isValidPositiveNumber(value: string): boolean {
  const parsed = parseFloat(value);
  return !isNaN(parsed) && isFinite(parsed) && parsed > 0;
}

// Function to validate input values
function validateInputs(
  mortgageAmount: string,
  interestRate: string,
  loanTerm: string
): string[] {
  const errorMessages: string[] = [];

  // Different if statements for error messages
  if (
    !isValidPositiveNumber(mortgageAmount) ||
    parseFloat(mortgageAmount) < 1 ||
    parseFloat(mortgageAmount) > 50000000
  ) {
    errorMessages.push("Skriv in ett lånebelopp mellan 1 och 50000000kr");
  }

  if (
    !isValidNumber(interestRate) ||
    parseFloat(interestRate) < 0.1 ||
    parseFloat(interestRate) > 100
  ) {
    errorMessages.push("Skriv in ett ränteantal mellan 0.1-100%.");
  }

  if (
    !isValidPositiveNumber(loanTerm) ||
    parseFloat(loanTerm) < 0.1 ||
    parseFloat(loanTerm) > 70
  ) {
    errorMessages.push("Skriv in en återbetalningsperiod mellan 0.1-70år.");
  }

  return errorMessages;
}

// Function to calculate the mortgage
function calculateMortgage(event: Event) {
  event.preventDefault();

  // Fetching values from input field
  const mortgageAmount = mortgageAmountInput.value;
  const interestRate = interestRateInput.value;
  const loanTerm = loanTermInput.value;

  // Validates input values
  const errorMessages = validateInputs(mortgageAmount, interestRate, loanTerm);

  // Displaying error messages if input validation fails
  if (errorMessages.length > 0) {
    // Generates list of errors messages
    const errorList = errorMessages
      .map((message) => `<li>${message}</li>`)
      .join("");
    // Shows error message in summary
    summaryDisplay.innerHTML = `<span class='error-message'>Fel:<br><ul>${errorList}</ul></span>`;
    return;
  }

  // ---------------------------- //
  // Code for math calculations  //
  // -------------------------- //

  const mortgageAmountValue = parseFloat(mortgageAmount);
  const interestRateValue = parseFloat(interestRate);
  const loanTermValue = parseFloat(loanTerm);

  // Calculates monthly interest rate and total number for the loan
  const monthlyInterestRate = interestRateValue / 100 / 12;
  const loanTermMonths = loanTermValue * 12;

  // Calculates the monthly mortgage payment using the math formula
  const mortgage =
    (mortgageAmountValue *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  // Calculates total payment & interest over the loan term
  const totalPayment = mortgage * loanTermMonths;
  const totalInterest = totalPayment - mortgageAmountValue;

  let remainingLoan = mortgageAmountValue;

  // Array to store the amortized plan
  const amortizationPlan: AmortizationPlan[] = [];

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
      remainingLoan,
    });
  }

  // ---------------------------- //
  // Code for summary displayed  //
  // -------------------------- //

  // Generates the summary text with the "generateSummaryText" function
  const summaryText = generateSummaryText(mortgage, totalInterest, loanTerm);

  // Sets the HTML content to the generated summary text
  summaryDisplay.innerHTML = summaryText;

  // Generates the amortization table using the "generateAmortizationTable" function
  const tableContent = generateAmortizationTable(amortizationPlan);

  // Fetches the empty "tableBody" id/div from HTML
  const tableBody = document.getElementById(
    "tableBody"
  ) as HTMLTableSectionElement;

  // Sets the HTML content to the generated table
  tableBody.innerHTML = tableContent;

  // Makes the table visible
  tableElement.style.display = "table";

  // Function to generate summary text
  function generateSummaryText(
    mortgage: number,
    totalInterest: number,
    loanTerm: string
  ): string {
    return `
    Bolånet blir: <strong>${mortgage.toFixed(2)} kr/månad.</strong><br>
    Totala räntekostnaden: <strong>${totalInterest.toFixed(
      2
    )} kr</strong> över <strong>${loanTerm} år.</strong><br>
    Amorteringsplan:
  `;
  }

  // ---------------------------- //
  // Code for amortazation table //
  // -------------------------- //

  // Function to generate amortization table
  function generateAmortizationTable(
    amortizationPlan: AmortizationPlan[]
  ): string {
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
    return output;
  }
}

// Adds an eventListener to the mortgage form to trigger the function when user submit
mortgageForm.addEventListener("submit", calculateMortgage);
