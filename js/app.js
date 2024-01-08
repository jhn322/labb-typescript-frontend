// The task for this TS file is to calculate mortgage based on the users preference. Mortgage amount, interest rate and repayment time is at the basis of this calculation. Formula used is M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}.
// Grabbed elements from HTML file by their ID
var mortgageForm = document.getElementById("mortgageForm");
var mortgageAmountInput = document.getElementById("mortgageAmount");
var interestRateInput = document.getElementById("interestRate");
var loanTermInput = document.getElementById("loanTerm");
var summaryDisplay = document.getElementById("summary");
var tableElement = document.getElementById("amortizationTable");
// Function to validate if a string represents a valid number
function isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}
// Function to validate if a string represents a positive number
function isValidPositiveNumber(value) {
    var parsed = parseFloat(value);
    return !isNaN(parsed) && isFinite(parsed) && parsed > 0;
}
// Function to validate input values
function validateInputs(mortgageAmount, interestRate, loanTerm) {
    var errorMessages = [];
    // Different if statements for error messages
    if (!isValidPositiveNumber(mortgageAmount)) {
        errorMessages.push("Skriv in ett lånebelopp av minst 1.");
    }
    if (!isValidNumber(interestRate) ||
        parseFloat(interestRate) < 0 ||
        parseFloat(interestRate) > 100) {
        errorMessages.push("Skriv in ett ränteantal mellan 0-100%.");
    }
    if (!isValidPositiveNumber(loanTerm) ||
        parseFloat(loanTerm) <= 0 ||
        parseFloat(loanTerm) > 80) {
        errorMessages.push("Skriv in en realistisk återbetalningsperiod.");
    }
    return errorMessages;
}
// Function to calculate the mortgage
function calculateMortgage(event) {
    event.preventDefault();
    // Fetching values from input field
    var mortgageAmount = mortgageAmountInput.value;
    var interestRate = interestRateInput.value;
    var loanTerm = loanTermInput.value;
    // Validates input values
    var errorMessages = validateInputs(mortgageAmount, interestRate, loanTerm);
    // Displaying error messages if input validation fails
    if (errorMessages.length > 0) {
        // Generates list of errors messages
        var errorList = errorMessages
            .map(function (message) { return "<li>".concat(message, "</li>"); })
            .join("");
        // Shows error message in summary
        summaryDisplay.innerHTML = "<span class='error-message'>Fel:<br><ul>".concat(errorList, "</ul></span>");
        return;
    }
    // ---------------------------- //
    // Code for math calculations  //
    // -------------------------- //
    var mortgageAmountValue = parseFloat(mortgageAmount);
    var interestRateValue = parseFloat(interestRate);
    var loanTermValue = parseFloat(loanTerm);
    // Calculates monthly interest rate and total number for the loan
    var monthlyInterestRate = interestRateValue / 100 / 12;
    var loanTermMonths = loanTermValue * 12;
    // Calculates the monthly mortgage payment using the math formula
    var mortgage = (mortgageAmountValue *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    // Calculates total payment & interest over the loan term
    var totalPayment = mortgage * loanTermMonths;
    var totalInterest = totalPayment - mortgageAmountValue;
    var remainingLoan = mortgageAmountValue;
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
