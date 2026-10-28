// TempShift - temperature conversion with validation and absolute-zero checks.
(function () {
  "use strict";

  var ABSOLUTE_ZERO = { C: -273.15, F: -459.67, K: 0 };

  var form = document.getElementById("converter");
  var input = document.getElementById("temp-input");
  var errorMsg = document.getElementById("error-msg");
  var results = document.getElementById("results");
  var note = document.getElementById("result-note");
  var boxes = { C: document.getElementById("box-C"), F: document.getElementById("box-F"), K: document.getElementById("box-K") };
  var values = { C: document.getElementById("val-C"), F: document.getElementById("val-F"), K: document.getElementById("val-K") };

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.hidden = false;
    input.classList.add("invalid");
    results.hidden = true;
  }

  function clearError() {
    errorMsg.hidden = true;
    input.classList.remove("invalid");
  }

  function getFromUnit() {
    var checked = form.querySelector('input[name="from-unit"]:checked');
    return checked ? checked.value : "C";
  }

  // Normalise any input unit to Celsius, then derive the rest.
  function toCelsius(value, unit) {
    if (unit === "C") return value;
    if (unit === "F") return (value - 32) * (5 / 9);
    return value - 273.15; // Kelvin
  }

  function format(num) {
    var rounded = Math.round(num * 100) / 100;
    return rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    var raw = input.value.trim();

    // 1. Reject empty and non-numeric input.
    if (raw === "") {
      showError("Please enter a temperature value.");
      input.focus();
      return;
    }
    var value = Number(raw);
    if (!isFinite(value)) {
      showError('"' + raw + '" is not a number. Enter digits only, e.g. 37.5 or -10.');
      input.focus();
      return;
    }

    var unit = getFromUnit();

    // 2. Reject physically impossible values (below absolute zero).
    if (value < ABSOLUTE_ZERO[unit]) {
      var labels = { C: "-273.15 °C", F: "-459.67 °F", K: "0 K" };
      showError("Below absolute zero: " + raw + " " + unit + " is not physically possible. The lowest value in " + unit + " is " + labels[unit] + ".");
      input.focus();
      return;
    }

    // 3. Convert and render all three units.
    var celsius = toCelsius(value, unit);
    var converted = {
      C: celsius,
      F: celsius * (9 / 5) + 32,
      K: celsius + 273.15
    };

    values.C.textContent = format(converted.C);
    values.F.textContent = format(converted.F);
    values.K.textContent = format(converted.K);

    // Mark the box matching the input unit as the source.
    Object.keys(boxes).forEach(function (key) {
      boxes[key].classList.toggle("source", key === unit);
    });

    note.textContent = "Converted from " + format(value) + " " + (unit === "K" ? "K" : "°" + unit) + ". The highlighted card is your input unit.";
    results.hidden = false;
  });

  // Clear stale errors as the user edits.
  input.addEventListener("input", clearError);
})();
