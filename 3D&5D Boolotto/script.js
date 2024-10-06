document.addEventListener("DOMContentLoaded", function () {
    const resultInputs = document.querySelectorAll(".result-input");

    // Add 'keydown' event listener for each input to move to the next one when pressing 'Enter'
    resultInputs.forEach((input, index) => {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent form submission

                if (index < resultInputs.length - 1) {
                    // Move to the next input
                    resultInputs[index + 1].focus();
                } else {
                    // If it's the last input, trigger the prediction
                    predictOutcome();
                }
            }
        });
    });

    document.getElementById("predictBtn").addEventListener("click", predictOutcome);
});

function predictOutcome() {
    const resultInputs = document.querySelectorAll(".result-input");
    let results = [];

    // Collect the result values
    for (let input of resultInputs) {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 0 || value > 9) {
            alert("Please enter valid numbers between 0 and 9.");
            return;
        }
        results.push(value);
    }

    // Get the period value
    const periodField = document.getElementById("period");
    let period = periodField.value;

    // Call the prediction function
    let prediction = predictNextOutcome(results);
    let predictedNumber = prediction[0];
    let isOdd = prediction[1] === 1;
    let isHigh = predictedNumber >= 5;

    // Update the prediction labels
    document.getElementById("predictionLabel").innerText = "Predicted Number: " + predictedNumber;
    document.getElementById("predictionHighLowLabel").innerText = "High/Low: " + (isHigh ? "High" : "Low");
    document.getElementById("predictionOddEvenLabel").innerText = "Odd/Even: " + (isOdd ? "Odd" : "Even");

    // Add a new row to the prediction table
    const tableBody = document.querySelector("#predictionTable tbody");
    let newRow = `<tr>
        <td>${period}</td>
        <td>${predictedNumber}</td>
        <td>${isHigh ? "High" : "Low"}</td>
        <td>${isOdd ? "Odd" : "Even"}</td>
    </tr>`;
    tableBody.innerHTML += newRow;

    // Increment period field by 1
    let currentPeriod = parseInt(period);
    if (!isNaN(currentPeriod)) {
        periodField.value = currentPeriod + 1;
    }

    // Clear the input fields
    for (let input of resultInputs) {
        input.value = "";
    }
    resultInputs[0].focus();
}

// Prediction logic based on differences
function predictNextOutcome(results) {
    let differences = [];
    for (let i = 0; i < results.length - 1; i++) {
        differences.push(results[i + 1] - results[i]);
    }

    let consistent = true;
    for (let i = 1; i < differences.length; i++) {
        if (differences[i] !== differences[i - 1]) {
            consistent = false;
            break;
        }
    }

    let nextNumber;
    if (consistent) {
        let nextDifference = differences[0];
        nextNumber = results[results.length - 1] + nextDifference;
    } else {
        nextNumber = Math.floor(Math.random() * 10);
    }

    // Ensure the predicted number is between 0 and 9
    if (nextNumber < 0 || nextNumber > 9) {
        nextNumber = Math.floor(Math.random() * 10);
    }

    return [nextNumber, nextNumber % 2];
}
