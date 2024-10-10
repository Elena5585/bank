const myForm = document.forms.form;
const initial = myForm.initial;
const wished = myForm.wished;
const monthly = myForm.monthly;
const depositCourse = myForm.depositCourse;
const withdrawalCourse = myForm.withdrawalCourse;
const rate = myForm.rate;
const inputs = [...document.querySelectorAll('.form-input')];
const initialOutput = document.querySelector('#initial-output');
const monthlyGap = document.querySelector('#monthGap');
const usdRate = document.querySelector('#usd-rate');
const lastMonth = document.querySelector('#last-month');
const formBtn = document.querySelector('.form-btn');
const message = document.querySelector('.form-message');

const maxInflation = 0.1;
let initialValue, wishedValue, monthlyValue, depositCourseValue, withdrawalCourseValue, rateValue;
let array = [];
let wrong = [];
const financeRegExp = /^(.*?)((?:[,.]\d+)?|)$/;	



initial.addEventListener('change', (e) => {		
		if(e.target.id === initial.id){		
			initial.value = e.target.value;			
		}
		initialValue = Number(initial.value);			   	
});


wished.addEventListener('change', (e) => {		
		if(e.target.id === wished.id){
			wished.value = e.target.value;
		}
		wishedValue = Number(wished.value);
});
monthly.addEventListener('change', (e) => {		
		if(e.target.id === monthly.id){
			monthly.value = e.target.value;
		}
		monthlyValue = Number(monthly.value);
});
depositCourse.addEventListener('change', (e) => {		
		if(e.target.id === depositCourse.id){
			depositCourse.value = e.target.value;
		}
		depositCourseValue = Number(depositCourse.value);
});
withdrawalCourse.addEventListener('change', (e) => {		
		if(e.target.id === withdrawalCourse.id){
			withdrawalCourse.value = e.target.value;
		}
		withdrawalCourseValue = Number(withdrawalCourse.value);
});
rate.addEventListener('change', (e) => {		
		if(e.target.id === rate.id){
			rate.value = e.target.value;
		}
		rateValue = Number(rate.value) / 100;
});


function calculate(){
	let errorCount = formValidate();	
	if(errorCount === 0){
		const accountWishedTotalAmount = Number(((wishedValue * 12) / rateValue).toFixed(1));	
		let currentAmount = Number(initialValue);
		let monthRate;	
		let count = 0;
		if(array.length > 0){array = []}
		
		let monthObj = {};
		
		for(let i = initialValue; currentAmount < accountWishedTotalAmount; i + monthlyValue){
			currentAmount *= ((Number(rateValue) / 12) + 1);
			currentAmount += monthlyValue;	
			monthObj = {amount: Math.round(currentAmount), monthNumber: count + 1, payment: Math.round((currentAmount * ((Number(rateValue) / 12) + 1)) - currentAmount)};
			array.push(monthObj);
			count++;
		}

		let currentAmountInUsd = currentAmount / Number(withdrawalCourseValue);

		let profits = currentAmount - Number(initialValue) - (Number(monthlyValue)*count);
		let usdRateLose = ((((profits / depositCourseValue) / count) - ((profits / withdrawalCourseValue) / count)) / ((profits / depositCourseValue) / count)) *100;
		let lastMonthPayment = Math.round((currentAmount * ((Number(rateValue) / 12) + 1)) - currentAmount);

		let [_, num, suffix] =  String(currentAmountInUsd).match(financeRegExp);
		let financeAmountInUsd = num.replace(/\B(?=(?:\d{3})*$)/g, ' ');
		let [_1, num1, suffix1] =  String(lastMonthPayment).match(financeRegExp);
		let financePayment = num1.replace(/\B(?=(?:\d{3})*$)/g, ' ');	
		let [_2, num2, suffix2] =  String(currentAmount).match(financeRegExp);
		let financeAmount = num2.replace(/\B(?=(?:\d{3})*$)/g, ' ');	
		let [_3, num3, suffix3] =  String(initialValue).match(financeRegExp);
		let initialAmount = num3.replace(/\B(?=(?:\d{3})*$)/g, ' ');	
		let [_4, num4, suffix4] =  String(monthlyValue).match(financeRegExp);
		let monthlyAmount = num4.replace(/\B(?=(?:\d{3})*$)/g, ' ');	
		
		initialOutput.textContent = `Первоначальный взнос составляет ${initialAmount} сум / Ежемесячное пополнение ${monthlyAmount} сум`;
		monthlyGap.textContent = `Желаемый месячный доход будет достигнут за ${count} месяцев, ${(count/ 12).toFixed(1)} лет`;
		usdRate.textContent = `Фактическая ставка в долларах составит ${Math.ceil((rateValue * 100) - usdRateLose)}%, в суммах ${rateValue * 100}%`;
		lastMonth.textContent = `Сумма вклада на последний месяц составит $ ${financeAmountInUsd} или ${financeAmount} сум , а сумма ежемесячных выплат ${financePayment} сум`;	
		clearForm();

	}else{
		message.textContent = 'Incorrect input value';		
		setTimeout(()=>{
			message.textContent = '';
			inputs.forEach((input) => {input.classList.remove('wrong');})
		}, 4000);
	}		
};

formBtn.addEventListener('click' , (e) => {
	e.preventDefault();	
	calculate();	
	outputTable();	
});



function outputTable(){	
	let start = 11;	
	const table = document.querySelector('.output-table');
	table.innerHTML = '';	
	if(start < array.length - 11){
		    let [first, firstNum, firstSuffix] =  String(array[0]?.amount).match(financeRegExp);
		    let firstAmount = firstNum.replace(/\B(?=(?:\d{3})*$)/g, ' ');
		    let [second, secondNum, secondSuffix] =  String(array[0]?.payment).match(financeRegExp);
		    let firstPayment = secondNum.replace(/\B(?=(?:\d{3})*$)/g, ' ');		
			const capture = document.createElement('div');
			capture.classList.add('output-table__capture');
			const captureTd1 = document.createElement('div');
			captureTd1.classList.add('output-capture__td');
			const captureTd2 = document.createElement('div');
			captureTd2.classList.add('output-capture__td');
			const captureTd3 = document.createElement('div');
			captureTd3.classList.add('output-capture__td');
			captureTd1.textContent = 'Месяц:';
			captureTd2.textContent = 'Сумма вклада с процентами:';
			captureTd3.textContent = 'Выплата по вкладу в месяц:';
			capture.append(captureTd1, captureTd2, captureTd3);
			const tableBody = document.createElement('div');
			tableBody.classList.add('table-body');			
			table.append(capture, tableBody);
			const firstTr = document.createElement('div');
			firstTr.classList.add('output-table__tr');
			const firstTd = document.createElement('div');
			firstTd.classList.add('output-table__td');
			const secondTd = document.createElement('div');
			secondTd.classList.add('output-table__td');
			const thirdTd = document.createElement('div');
			thirdTd.classList.add('output-table__td');
			firstTd.textContent = array[0]?.monthNumber;		
			secondTd.textContent = firstAmount;		
			thirdTd.textContent = firstPayment;
			firstTr.append(firstTd, secondTd, thirdTd);
			tableBody.append(firstTr);	
		array.forEach((item) => {			
			if((array.indexOf(item) % 12 === 0 || array.indexOf(item) % start === 0) && (array.indexOf(item) < array.length - 11) ){				
				let [_, num, suffix] =  String(array[start]?.amount).match(financeRegExp);
				let arrayAmount = num.replace(/\B(?=(?:\d{3})*$)/g, ' ');
				let [_1, num1, suffix1] =  String(array[start]?.payment).match(financeRegExp);
				let arrayPayment = num1.replace(/\B(?=(?:\d{3})*$)/g, ' ');					
				const tr = document.createElement('div')
				tr.classList.add('output-table__tr');
				const td1 = document.createElement('div');
				td1.classList.add('output-table__td');
				td1.textContent = array[start]?.monthNumber;
				const td2 = document.createElement('div');
				td2.classList.add('output-table__td');
				// td2.textContent = array[start]?.amount;
				td2.textContent = arrayAmount;
				const td3 = document.createElement('div');
				td3.classList.add('output-table__td');
				// td3.textContent = array[start]?.payment;
				td3.textContent = arrayPayment;
				tr.append(td1, td2, td3);	
				tableBody.append(tr);				
				start += 12;
			}
		});
	}	
};

function deleteTableBody(tableBody){
	document.querySelector('.output-table').parentNode.removeChild(tableBody);
    return false;
}

function formValidate(){
	let error = 0;
	for(let i = 0; i < inputs.length; i++){
		const input = inputs[i];
		input.classList.remove('wrong');
		if(!input.value.match(/\d+/g) || !input.value.length > 0){
			input.classList.add('wrong');
			error++;
		}
	}
	return error;
}

function clearForm(){
	myForm.reset();
}




