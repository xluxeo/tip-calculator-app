const form = document.querySelector('.c-form');
const billInput = document.querySelector('#bill');
const peopleInput = document.querySelector('#people');
const customTipInput = document.querySelector('#custom-tip');
const tipButtons = document.querySelectorAll('.c-form__group .c-button');
const resetButton = document.querySelector('.c-card .c-button');
const tipAmountOutput = document.querySelectorAll('.c-card__price span')[0];
const totalOutput = document.querySelectorAll('.c-card__price span')[1];
const errorOutput = document.querySelector('.c-form__error');

let tipPercent = 15;

form.addEventListener('submit', (event) => {
	event.preventDefault();
	calculate();
});

function formatAmount(amount) {
	return amount.toFixed(2);
}

function updateTipSelection(selectedButton) {
	tipButtons.forEach((button) => {
		button.toggleAttribute('data-selected', button === selectedButton);
		button.setAttribute('aria-pressed', String(button === selectedButton));
	});
}

function calculate() {
	const bill = Number.parseFloat(billInput.value);
	const people = Number.parseInt(peopleInput.value, 10);
	const hasBill = Number.isFinite(bill) && bill >= 0;
	const hasPeople = Number.isInteger(people) && people > 0;
	const shouldShowPeopleError = !hasPeople && (billInput.value !== '' || peopleInput.value !== '');

	peopleInput.closest('.c-form__input-wrapper').toggleAttribute('data-error', shouldShowPeopleError);
	errorOutput.textContent = shouldShowPeopleError ? "Can't be zero" : '';

	if (!hasBill || !hasPeople) {
		tipAmountOutput.textContent = '0.00';
		totalOutput.textContent = '0.00';
		return;
	}

	const tip = bill * (tipPercent / 100);
	tipAmountOutput.textContent = formatAmount(tip / people);
	totalOutput.textContent = formatAmount((bill + tip) / people);
}

tipButtons.forEach((button) => {
	button.addEventListener('click', () => {
		tipPercent = Number.parseFloat(button.textContent);
		customTipInput.value = '';
		updateTipSelection(button);
		calculate();
	});
});

billInput.addEventListener('input', calculate);
peopleInput.addEventListener('input', calculate);
customTipInput.addEventListener('input', () => {
	const customTip = Number.parseFloat(customTipInput.value);

	if (Number.isFinite(customTip) && customTip >= 0) {
		tipPercent = customTip;
		updateTipSelection(null);
		calculate();
	}
});

resetButton.addEventListener('click', () => {
	form.reset();
	tipPercent = 15;
	customTipInput.value = '';
	updateTipSelection(tipButtons[2]);
	calculate();
});

updateTipSelection(tipButtons[2]);
calculate();
