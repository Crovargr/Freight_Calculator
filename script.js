const form = document.getElementById('freight-form');
const calculateButton = document.getElementById('calculate-button');
const resultDiv = document.getElementById('result-container');
const costInputs = document.getElementById('cost-inputs');
const calculationList = document.getElementById('calculation-list');
const totalCostSpan = document.getElementById('total-cost-value');
const totalEmisSpan = document.getElementById('total-co2-impact-value');
const exportButton = document.getElementById('export-button');

let totalCost = 0; // Track total cost across all calculations
var totalEmis = 0; // Track total emissions across all calculations

calculateButton.addEventListener('click', function() {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const transport = document.getElementById('transport').value;
  const distance = parseFloat(document.getElementById('distance').value);
  const product = document.getElementById('product').value;


  let costPerKg;
  let emisPerKg;
  let calculatedCostPerVehicle;
  // Cost Calculation Logic
  if (transport === 'truck') {
    //costPerKg = parseFloat(document.getElementById('truck-cost').value) || 0;
    emisPerKg = parseFloat(document.getElementById('co2-truck').value) || 0;
    const percentage = 10;                // Fuel cost of total cost in percentage
    const totalTeu = 1;                   // Maximum payload expressed in TEU
    const oneTeuTonnes = 21.4;            // Capability of 1 TEU expressed in tonnes (in case of 1 TEU provide the max payload expressed in tonnes)
    const distanceOneFuelUnit = 2;        // Kilometers with 1 unit of fuel (truck: 1 liter)
    const oneUnitFuelPrice = 1.29;        // Price of 1 unit of fuel (truck: 1 liter)
    calculatedCostPerVehicle = (((oneUnitFuelPrice/distanceOneFuelUnit)/(totalTeu*oneTeuTonnes)*distance)*weight)/(percentage/100)
  } else if (transport === 'train') {
    //costPerKg = parseFloat(document.getElementById('train-cost').value) || 0;
    emisPerKg = parseFloat(document.getElementById('co2-train').value) || 0;
    const percentage = 5;                 // Fuel cost of total cost in percentage
    const totalTeu = 63;                  // Maximum payload expressed in TEU
    const oneTeuTonnes = 21.4;            // Capability of 1 TEU expressed in tonnes (in case of 1 TEU provide the max payload expressed in tonnes)
    const distanceOneFuelUnit = 0.25;     // Kilometers with 1 unit of fuel (train: 1 liter)
    const oneUnitFuelPrice = 1.29;        // Price of 1 unit of fuel (train: 1 liter)
    calculatedCostPerVehicle = (((oneUnitFuelPrice/distanceOneFuelUnit)/(totalTeu*oneTeuTonnes)*distance)*weight)/(percentage/100)
  } else if (transport === 'plane') {
    //costPerKg = parseFloat(document.getElementById('plane-cost').value) || 0;
    emisPerKg = parseFloat(document.getElementById('co2-plane').value) || 0;
    const percentage = 25;               // Fuel cost of total cost in percentage
    const totalTeu = 1;                  // Maximum payload expressed in TEU
    const oneTeuTonnes = 115;            // Capability of 1 TEU expressed in tonnes (in case of 1 TEU provide the max payload expressed in tonnes)
    const distanceOneFuelUnit = 0.0833;  // Kilometers with 1 unit of fuel (plane: 1 liter)
    const oneUnitFuelPrice = 1.29;       // Price of 1 unit of fuel (plane: 1 liter)
    calculatedCostPerVehicle = (((oneUnitFuelPrice/distanceOneFuelUnit)/(totalTeu*oneTeuTonnes)*distance)*weight)/(percentage/100)
  } else if (transport === 'ship') {
    //costPerKg = parseFloat(document.getElementById('ship-cost').value) || 0;
    emisPerKg = parseFloat(document.getElementById('co2-ship').value) || 0;
    const percentage = 5;                // Fuel cost of total cost in percentage
    const totalTeu = 4000;               // Maximum payload expressed in TEU
    const oneTeuTonnes = 21.4;           // Capability of 1 TEU expressed in tonnes (in case of 1 TEU provide the max payload expressed in tonnes)
    const distanceOneFuelUnit = 5;       // Kilometers with 1 unit of fuel (ship: 1 tonne)
    const oneUnitFuelPrice = 560;        // Price of 1 unit of fuel (ship: 1 tonne)
    calculatedCostPerVehicle = (((oneUnitFuelPrice/distanceOneFuelUnit)/(totalTeu*oneTeuTonnes)*distance)*weight)/(percentage/100)
  } else {
    costPerKg = 0; // Handle invalid transport type
    emisPerKg = 0;
    calculatedCostPerVehicle = 0;
  }

  console.log(totalCost);

  // Formatting Output with Error Handling
  if (isNaN(totalCost)) {
    resultDiv.textContent = "An error occurred while calculating the cost.";
  } else {
    

    // Create a new list item for the calculation history
    const newListItem = document.createElement('li');
    const calculatedCost = parseFloat(calculatedCostPerVehicle.toFixed(2));
    let calculatedEmis = emisPerKg * weight * distance;
    let calculatedEmisFloat = parseFloat(calculatedEmis.toFixed(2));
    newListItem.textContent = `${product} | Route: ${origin} - ${destination} | Transport: ${transport} | Cost: ${calculatedCost} € | Emission: ${calculatedEmisFloat} kg CO2e`;

    // Add the new list item to the calculation list
    calculationList.appendChild(newListItem);

    // Update total cost and display with debugging in the console
    
    console.log("Weight:", weight);
    console.log("Distance:", distance);
    //console.log("Cost per Kg:", costPerKg);
    console.log("Calculated Cost:", calculatedCost);
    console.log("Calculated Emis:", calculatedEmis);
    totalCost += calculatedCost;
    totalEmis += calculatedEmis;

    totalCostSpan.textContent = totalCost.toFixed(2);
    totalEmisSpan.textContent = totalEmis.toFixed(2);
  }
  
});

// Function to generate CSV data
function getCSVData() {
  let csvData = ""; // Initialize empty string for CSV data

  
  const listItems = calculationList.querySelectorAll('li');
  for (const item of listItems) {
    const textContentArray = item.textContent.split(" | "); // Split by pipe
    const originAndDestination = textContentArray[1].split(" - "); // Split first element by hyphen

    const origin = originAndDestination[0].split(": ")[1]; // Extract origin
    const destination = originAndDestination[1]; // Extract destination

    // Extract transport and cost as before
    const transport = textContentArray[2].split(": ")[1];
    const cost = textContentArray[3].split(": ")[1].replace(" €", "");
    const emis = textContentArray[4].split(": ")[1].replace(" kg CO2e", "");

    // Extract product name
    const product = textContentArray[0]

    csvData += product + "," + origin + "," + destination + "," + transport + "," + cost + "," + emis + "\n"; // Add comma-separated values
  }

  // Add total cost on a separate line
  csvData += `Total Cost: ${totalCostSpan.textContent}\n`;
  csvData += `Total CO2 Impact: ${totalEmisSpan.textContent}\n`;

  return csvData;
}

// Export button click handler
exportButton.addEventListener('click', function() {
  const csvData = getCSVData();

  // Create a blob object with CSV data and appropriate MIME type
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

  // Create a hidden anchor element for download
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'freight_calculations.csv'; // Set filename
  downloadLink.style.display = 'none'; // Hide the anchor element

  // Simulate a click on the hidden anchor element to trigger download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up after download
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(blob); // Revoke object URL after download
});