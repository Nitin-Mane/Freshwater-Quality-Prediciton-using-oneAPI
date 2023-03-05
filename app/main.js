// Get all sliders
const sliders = document.querySelectorAll(".slider");

// Get all gauge meters
const gauges = document.querySelectorAll(".gauge");

// Update the slider label value on input change
function updateSlider(slider, labelClass, minVal, maxVal) {
    const label = slider.parentElement.querySelector(`.${labelClass}`);
    label.innerHTML = `${slider.value} mg/L`;

    // Update gauge meter
    const gauge = slider.parentElement.querySelector(".gauge");
    const value = (slider.value - minVal) / (maxVal - minVal);
    gauge.querySelector(".gauge__fill").style.transform = `scaleX(${value})`;
}

// Update all slider and gauge values on data input change
function updateInputs(data) {
    document.querySelector("#pHSlider").value = data.pH;
    updateSlider(document.querySelector("#pHSlider"), "pH-label", 6, 9);
    document.querySelector("#ironSlider").value = data.Iron;
    updateSlider(document.querySelector("#ironSlider"), "iron-label", 0, 1);
    document.querySelector("#nitrateSlider").value = data.Nitrate;
    updateSlider(document.querySelector("#nitrateSlider"), "nitrate-label", 0, 45);
    document.querySelector("#chlorideSlider").value = data.Chloride;
    updateSlider(document.querySelector("#chlorideSlider"), "chloride-label", 0, 250);
    document.querySelector("#leadSlider").value = data.Lead;
    updateSlider(document.querySelector("#leadSlider"), "lead-label", 0, 0.015);
    document.querySelector("#zincSlider").value = data.Zinc;
    updateSlider(document.querySelector("#zincSlider"), "zinc-label", 0, 5);
    document.querySelector("#colorSlider").value = data.Color;
    updateSlider(document.querySelector("#colorSlider"), "color-label", 0, 5);
    document.querySelector("#turbiditySlider").value = data.Turbidity;
    updateSlider(document.querySelector("#turbiditySlider"), "turbidity-label", 0, 5);
    document.querySelector("#fluorideSlider").value = data.Fluoride;
    updateSlider(document.querySelector("#fluorideSlider"), "fluoride-label", 0, 4);
    document.querySelector("#copperSlider").value = data.Copper;
    updateSlider(document.querySelector("#copperSlider"), "copper-label", 0, 5);
    document.querySelector("#odorSlider").value = data.Odor;
    updateSlider(document.querySelector("#odorSlider"), "odor-label", 0, 10);
    document.querySelector("#sulfateSlider").value = data.Sulfate;
    updateSlider(document.querySelector("#sulfateSlider"), "sulfate-label", 0, 500);
    document.querySelector("#conductivitySlider").value = data.Conductivity;
    updateSlider(document.querySelector("#conductivitySlider"), "conductivity-label", 0, 800);
    document.querySelector("#chlorineSlider").value = data.Chlorine;
    updateSlider(document.querySelector("#chlorineSlider"), "chlorine-label", 0, 4);
    document.querySelector("#manganeseSlider").value = data.Manganese;
    updateSlider(document.querySelector("#manganeseSlider"), "manganese-label", 0, 5);
    document.querySelector("#tdsSlider").value = data["Total Dissolved Solids"];
    updateSlider(document.querySelector("#tdsSlider"), "tds-label", 0, 1000);
}

// Get data input form
const form = document.querySelector("#data-form");

// Handle data input form submission
form.addEventListener("submit", event => {
    event.preventDefault();

    // Collect input data from form
    const inputData = {
        pH: parseFloat(pHInput.value),
        iron: parseFloat(ironInput.value),
        nitrate: parseFloat(nitrateInput.value),
        chloride: parseFloat(chlorideInput.value),
        lead: parseFloat(leadInput.value),
        zinc: parseFloat(zincInput.value),
        color: colorInput.value,
        turbidity: parseFloat(turbidityInput.value),
        fluoride: parseFloat(fluorideInput.value),
        copper: parseFloat(copperInput.value),
        odor: parseFloat(odorSlider.value),
        sulfate: parseFloat(sulfateSlider.value),
        conductivity: parseFloat(conductivityInput.value),
        chlorine: parseFloat(chlorineInput.value),
        manganese: parseFloat(manganeseInput.value),
        tds: parseFloat(tdsInput.value),
        source: sourceInput.value,
        waterTemp: parseFloat(waterTempInput.value),
        airTemp: parseFloat(airTempInput.value),
        month: monthInput.value,
        day: parseFloat(dayInput.value),
        timeOfDay: parseFloat(timeInput.value),
    };

    // Make POST request to server with input data
    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inputData)
    })
        .then(response => response.json())
        .then(data => {
            // Update prediction result on UI
            resultLabel.textContent = data.prediction;
            resultContainer.classList.remove("hidden");
        })
        .catch(error => {
            console.error(error);
        });
});