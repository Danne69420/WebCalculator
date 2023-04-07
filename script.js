// mostly based on this https://codepen.io/lalwanivikas/pen/eZxjqo

"use strict";


//need to wrap it all in a window.onload function so that html elements load properly before thay are assigned to variables
window.onload = function(){
  var input = document.getElementById('input'), // input/output button
  number = document.querySelectorAll('.number'), // number buttons
  operator = document.querySelectorAll('.operator'), // operator buttons
  result = document.getElementById('equal-sign'), // equal button
  clear = document.getElementById('all-clear'), // clear button
  deletebutton = document.getElementById('DEL'), // delete button
  resultDisplayed = false; // flag to keep an eye on what output is displayed
// adding click handlers to number buttons
for (var i = 0; i < number.length; i++) {
  number[i].addEventListener("click", function(e) {

    // storing current input string and its last character in variables - used later
    var currentString = input.value;
    console.log(input.value);
    var lastChar = currentString[currentString.length - 1];

    if(input.value === "0"){
      input.value = "";
    }

    // if result is not diplayed, just keep adding
    if (resultDisplayed === false) {
      input.value += e.target.innerHTML;
    } else if (resultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
      // if result is currently displayed and user pressed an operator
      // we need to keep on adding to the string for next operation
      resultDisplayed = false;
      input.value += e.target.innerHTML;
    } else {
      // if result is currently displayed and user pressed a number
      // we need clear the input string and add the new input to start the new opration
      resultDisplayed = false;
      input.value = "";
      input.value += e.target.innerHTML;
    }

  });
}

// adding click handlers to operator buttons
for (var i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click", function(e) {

    // storing current input string and its last character in variables - used later
    var currentString = input.value;
    var lastChar = currentString[currentString.length - 1];

    // if last character entered is an operator, replace it with the currently pressed one
    if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
      var newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
      input.value = newString;
    } else if (currentString.length == 0) {
      // if first key pressed is an opearator, don't do anything
      console.log("enter a number first");
    } else {
      // else just add the operator pressed to the input
      input.value += e.target.innerHTML;
    }

  });
}

// on click of 'equal' button
result.addEventListener("click", function() {

  // this is the string that we will be processing eg. -10+26+33-56*34/23
  var inputString = input.value;

  // forming an array of numbers. eg for above string it will be: numbers = ["10", "26", "33", "56", "34", "23"]
  var numbers = inputString.split(/\+|\-|\×|\÷/g);

  // forming an array of operators. for above string it will be: operators = ["+", "+", "-", "*", "/"]
  // first we replace all the numbers and dot with empty string and then split
  var operators = inputString.replace(/[0-9]|\./g, "").split("");

  console.log(inputString);
  console.log(operators);
  console.log(numbers);
  console.log("----------------------------");

  // now we are looping through the array and doing one operation at a time.
  // first divide, then multiply, then subtraction and then addition
  // as we move we are alterning the original numbers and operators array
  // the final element remaining in the array will be the output

  var divide = operators.indexOf("÷");
  while (divide != -1) {
    numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
    operators.splice(divide, 1);
    divide = operators.indexOf("÷");
  }

  var multiply = operators.indexOf("×");
  while (multiply != -1) {
    numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
    operators.splice(multiply, 1);
    multiply = operators.indexOf("×");
  }

  var subtract = operators.indexOf("-");
  while (subtract != -1) {
    numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
    operators.splice(subtract, 1);
    subtract = operators.indexOf("-");
  }

  var add = operators.indexOf("+");
  while (add != -1) {
    // using parseFloat is necessary, otherwise it will result in string concatenation :)
    numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
    operators.splice(add, 1);
    add = operators.indexOf("+");
  }

  input.value = numbers[0]; // displaying the output

  resultDisplayed = true; // turning flag if result is displayed
});

// clearing the input on press of clear
clear.addEventListener("click", function() {
  input.value = "";
})

//event handler for delete button
deletebutton.addEventListener("click", function(){
  var chars = input.value.split('');
  chars.splice(chars.length-1, 1);
  input.value = chars.join("");
  if(input.value == null){
    input.value = "0";
  }
})

//event handler for keyboard input
document.addEventListener("keydown", function(e){

  console.log(e.key);

  //manually create a click event to send to the buttons eventhandler.
  const clickEvent = new Event("click");
  //check what key was pressed and treat it as if the corrosponding button was clicked
  for(var i = 0; i < number.length; i++){
    if(number[i].value == e.key){
      number[i].dispatchEvent(clickEvent);
    }
  }
  for(var i = 0; i < operator.length; i++){
    if(operator[i].value == e.key){
      operator[i].dispatchEvent(clickEvent);  
    }
    
  }
  if(e.key == "Enter"){
    result.dispatchEvent(clickEvent);
  }
  if(e.key == "Backspace"){
    deletebutton.dispatchEvent(clickEvent);
  }
  //There is no way to press All Clear with the keyboard as it doesn't have a good standardised keyboard button assosiated with it.
  //This also prevents the user from misclicking and accidentaly clearing everything.
})
}