// The task for this TS file is to calculate mortgage based on the users preference. Mortgage amount, interest rate and repayment time is at the basis of this calculation. Formula used is M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}.
// Grabbed elements from HTML file by their ID
var mortgageForm = document.getElementById("mortgageForm");
var mortgageAmountInput = document.getElementById("mortgageAmount");
var interestRateInput = document.getElementById("interestRate");
var loanTermInput = document.getElementById("loanTerm");
var summaryDisplay = document.getElementById("summary");
var tableElement = document.getElementById("amortizationTable");
// Function to calculate the mortgage
function calculateMortgage(event) {
    event.preventDefault();
    // Extracts values from input field and parsing them as floating point numbers
    var mortgageAmount = parseFloat(mortgageAmountInput.value);
    var interestRate = parseFloat(interestRateInput.value);
    var loanTerm = parseFloat(loanTermInput.value);
    // ---------------------------- //
    // Code for invalid inputs     //
    // -------------------------- //
    // Array to store potential error messages
    var invalidInput = [];
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
        var errorMessages = invalidInput
            .map(function (message) { return "<li>".concat(message, "</li>"); })
            .join("");
        summaryDisplay.innerHTML = "<span class='error-message'>Fel:<br><ul>".concat(errorMessages, "</ul></span>");
        return;
    }
    // ---------------------------- //
    // Code for calculations       //
    // -------------------------- //
    // Calculates monthly interest rate and total number for the loan
    var monthlyInterestRate = interestRate / 100 / 12;
    var loanTermMonths = loanTerm * 12;
    // Calculates the monthly mortgage payment using the math formula
    var mortgage = (mortgageAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    // Calculates total payment & interest over the loan term
    var totalPayment = mortgage * loanTermMonths;
    var totalInterest = totalPayment - mortgageAmount;
    var remainingLoan = mortgageAmount;
    // Array to store the amortized plan
    var amortizationPlan = [];
    // Calculating payments, principal, interest, and remaining loan balance for each month to generate amort
    for (var i = 1; i <= loanTermMonths; i++) {
        var interestPayment = remainingLoan * monthlyInterestRate;
        var principalPayment = mortgage - interestPayment;
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
    var summaryText = "\n    Resultat: <strong>".concat(mortgage.toFixed(2), " kr/m\u00E5nad.</strong><br>\n    Totala r\u00E4ntekostnaden: <strong>").concat(totalInterest.toFixed(2), " kr</strong> \u00F6ver <strong>").concat(loanTerm, " \u00E5r.</strong><br>\n    Amorteringsplan:\n");
    // Initilize the summary text for display
    summaryDisplay.innerHTML = summaryText;
    // ---------------------------- //
    // Code for amortazation table //
    // -------------------------- //
    // Stores the table
    var output = "";
    // Generates table for amortazation plan
    amortizationPlan.forEach(function (payment) {
        output += "\n      <tr>\n        <td>".concat(payment.month, "</td>\n        <td>").concat(payment.payment.toFixed(2), "</td>\n        <td>").concat(payment.interest.toFixed(2), "</td>\n        <td>").concat(payment.principal.toFixed(2), "</td>\n        <td>").concat(payment.remainingLoan.toFixed(2), "</td>\n      </tr>");
    });
    // Retrieves the table from HTML by ID
    var tableBody = document.getElementById("tableBody");
    // Sets the HTML content of the table to the generated output
    tableBody.innerHTML = output;
    // Changes the table to visible by setting its display style property to 'table'
    tableElement.style.display = "table";
}
// Adds an eventListener to the mortgage form to trigger the function when user submit
mortgageForm.addEventListener("submit", calculateMortgage);
