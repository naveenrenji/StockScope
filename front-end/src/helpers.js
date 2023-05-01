import validator from 'validator';

const checkNumberOfShares = (shares) => {
  if (!shares) {
    throw new Error("Please pass the shares value");
  }
  if (!/^\d+$/.test(shares)) {
    throw new Error("Please pass only integer value");
  }
  const checknum = parseInt(shares);
  if (!Number.isInteger(checknum)) {
    throw new Error("Please pass an Integer value in the number of shares");
  }
  return true;
};



const checkBuyingPrice = (price) => {
  if (!price) {
    throw new Error("Please pass the price value");
  }
  if (!/^\d+$/.test(price)) {
    throw new Error("Please pass only integer or float value");
  }
  const checknum = parseFloat(price);
  if (!Number.isFinite(checknum) || !Number.isInteger(checknum)) {
    throw new Error("Please pass the Average Price as an Integer or decimal");
  }
  return true;
};



const checkId = (id, varName) => {
  if (!id) {
    throw new Error(`Error: You must provide a ${varName}`);
  }
  if (typeof id !== "string") {
    throw new Error(`Error:${varName} must be a string`);
  }
  id = id.trim();
  if (id.length === 0) {
    throw new Error(`Error: ${varName} cannot be an empty string or just spaces`);
  }
  return id;
};



const checkString = (strVal, varName) => {
  if (!strVal) {
    throw new Error(`Error: You must supply a ${varName}!`);
  }
  if (typeof strVal !== "string") {
    throw new Error(`Error: ${varName} must be a string!`);
  }
  strVal = strVal.trim();
  if (strVal.length === 0) {
    throw new Error(`Error: ${varName} cannot be an empty string or string with just spaces`);
  }
  if (!isNaN(strVal)) {
    throw new Error(`Error: ${strVal} is not a valid value for ${varName} as it only contains digits`);
  }
  return strVal;
};


const checkEmail = (email) => {
  let check = validator.isEmail(email);
  if(check){
    return true;
  }
  else{
    throw new Error("Please enter a valid email ID");
  }
}



const checkUsername = (strVal) => {
  strVal = strVal.trim();
  strVal = strVal.toLowerCase();
  if (!/^[a-z0-9]+$/i.test(strVal) || strVal.length < 3) {
    throw new Error("Username must be alphanumeric (alphabets or numbers only) and at least 3 characters long.");
  }
  if (/^\d+$/.test(strVal)) {
    throw new Error("Username cannot be all numbers");
  }
  return strVal;
};



const checkPassword = (strVal) => {
  if (strVal.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (!/[a-z]/.test(strVal))
  {
    throw new Error(`Password must contain at least one lowercase letter.`);
  }
  if (!/[A-Z]/.test(strVal)) {
    throw new Error(`Password must contain at least one uppercase letter.`);
  }
  if (!/[0-9]/.test(strVal)) {
    throw new Error(`Password must contain at least one number.`);
  }
  if (!/[!@#$%^&*]/.test(strVal)) {
    throw new Error(`Password must contain at least one special character.`);
  }
};



const checkName = (strVal) => {
  if (!strVal) {
    throw new Error("You must provide a name");
  }
  if (typeof strVal !== "string") {
    throw new Error("Name must be a string");
  }
  if (strVal.trim().length === 0) {
    throw new Error("Name cannot be an empty string or string with just spaces");
  }
  strVal = strVal.trim();
  let a = strVal.split(" ");
  if (a.length != 2) {
    throw new Error("Name must have first and last name only");
  }
  a.forEach((element) => {
    if (!/^[a-zA-Z]+$/.test(element)) {
      throw new Error("Name must contain only alphabets");
    }
    if (element.length < 3) {
      throw new Error("Name must have at least 3 letters");
    }
  });
  return strVal;
};



export {
  checkNumberOfShares,
  checkBuyingPrice,
  checkPassword,
  checkUsername,
  checkName,
  checkId,
  checkString,
  checkEmail
};