const coefficientA = document.getElementById('coefficient-a');
const coefficientB = document.getElementById('coefficient-b');
const coefficientC = document.getElementById('coefficient-c');
const solveButton = document.getElementById('solve-button');
const result = document.getElementById('result');
const functionDisplay = document.getElementById('function-display');

function updateFunctionDisplay() {
  const aValue = parseFloat(coefficientA.value);
  const bValue = parseFloat(coefficientB.value);
  const cValue = parseFloat(coefficientC.value);

  let functionText = '';
  if (aValue !== 0) {
    functionText += `${aValue}x^2`;
  }
  if (bValue !== 0) {
    if (bValue > 0) {
      functionText += ` + ${bValue}x`;
    } else {
      functionText += ` - ${Math.abs(bValue)}x`;
    }
  }
  if (cValue !== 0) {
    if (cValue > 0) {
      functionText += ` + ${cValue}`;
    } else {
      functionText += ` - ${Math.abs(cValue)}`;
    }
  }
  if (functionText === '') {
    functionText = '0';
  }
  functionText += ' = 0';
  functionDisplay.textContent = `${functionText}`;
}

updateFunctionDisplay();

coefficientA.addEventListener('input', updateFunctionDisplay);
coefficientB.addEventListener('input', updateFunctionDisplay);
coefficientC.addEventListener('input', updateFunctionDisplay);

solveButton.addEventListener('click', function () {
  const aValue = parseFloat(coefficientA.value);
  const bValue = parseFloat(coefficientB.value);
  const cValue = parseFloat(coefficientC.value);

  const discriminant = Math.pow(bValue, 2) - 4 * aValue * cValue;

  let solution;
  if (discriminant > 0) {
    const root1 = (-bValue + Math.sqrt(discriminant)) / (2 * aValue);
    const root2 = (-bValue - Math.sqrt(discriminant)) / (2 * aValue);
    solution = `x1 = ${root1.toFixed(3)}, x2 = ${root2.toFixed(3)}`;
  } else if (discriminant === 0) {
    const root = -bValue / (2 * aValue);
    solution = `x = ${root.toFixed(3)}`;
  } else {
    solution = `No Real Solutions`;
  }
  result.textContent = solution;
});
