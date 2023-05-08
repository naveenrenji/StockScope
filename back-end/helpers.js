const mongo = require("mongodb");

const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

const checkEmail = (email) => {
  if (!email) throw "Email should not be empty";
  email = email.trim();
  if (email.length === 0) throw "Email should not be empty";
  if (!email.match(emailRegex)) throw "Email is invalid";
  return email;
};

const checkStockName = (name) => {
  if (!name) {
    const error = new Error("Please pass the stock name");
    error.statusCode = 400;
    throw error;
  }

  if (!/^[a-zA-Z]+$/.test(name)) {
    const error = new Error("Stock Symbol should only contain alphabets");
    error.statusCode = 400;
    throw error;
  }
};

const getTimeDifference = (publishedTimestamp) => {
  const currentDate = new Date();

  if (!publishedTimestamp || publishedTimestamp.length === 0) {
    return "";
  }

  const correctedTimestamp = `${publishedTimestamp.slice(
    0,
    4
  )}-${publishedTimestamp.slice(4, 6)}-${publishedTimestamp.slice(
    6,
    8
  )}T${publishedTimestamp.slice(9, 11)}:${publishedTimestamp.slice(
    11,
    13
  )}:${publishedTimestamp.slice(13, 15)}Z`;
  const publishedDate = new Date(correctedTimestamp);

  const differenceInMilliseconds = Math.abs(currentDate - publishedDate);
  // Convert the difference to the desired units (e.g., seconds, minutes, hours, etc.)
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );
  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  );
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  let timeString;

  if (differenceInDays >= 1) {
    timeString = `${differenceInDays} day(s) ago`;
  } else if (differenceInHours >= 1) {
    timeString = `${differenceInHours} hour(s) ago`;
  } else if (differenceInMinutes >= 1) {
    timeString = `${differenceInMinutes} minute(s) ago`;
  } else {
    timeString = `${differenceInSeconds} second(s) ago`;
  }

  return timeString;
};

const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!mongo.ObjectId.isValid(id)) throw `Error: ${varName} is invalid`;
  return id;
};

const checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
};

const checkUsername = (strVal) => {
  strVal = strVal.trim();
  strVal = strVal.toLowerCase();
  if (!/^[a-z0-9]+$/i.test(strVal) || strVal.length < 3) {
    throw "Username must be alphanumeric (alphabets or numbers only) and at least 3 characters long.";
  }
  if (/^\d+$/.test(strVal)) {
    throw "Username cannot be all numbers";
  }
  return strVal;
};

const checkPassword = (strVal) => {
  // check password length and complexity
  if (strVal.length < 6) {
    throw "strVal must be at least 6 characters long";
  }
  if (!/[a-z]/.test(strVal)) {
    throw `passwordmust contain at least one lowercase letter.`;
  }
  if (!/[A-Z]/.test(strVal)) {
    throw `password must contain at least one uppercase letter.`;
  }
  if (!/[0-9]/.test(strVal)) {
    throw `password must contain at least one number.`;
  }
  if (!/[!@#$%^&*]/.test(strVal)) {
    throw `password must contain at least one special character.`;
  }
};

const checkName = (strVal) => {
  if (!strVal) throw "You must provide a name";
  if (typeof strVal !== "string") throw "name must be a string";
  if (strVal.trim().length === 0)
    throw "name cannot be an empty string or string with just spaces";
  strVal = strVal.trim();
  let a = strVal.split(" ");
  if (a.length != 2) throw "name must have first and last name only";
  a.forEach((element) => {
    if (!/^[a-zA-Z]+$/.test(element)) throw "name must contain only alphabets";
    if (element.length < 3) throw "name must have atleast 3 letters";
  });
  return strVal;
};

const checkPosNumber = (num, varName) => {
  console.log(num);
  if (!num) throw `You must provide ${varName}`;
  num = Number(num);
  console.log(typeof num === "number");
  if (typeof num !== "number") throw `${varName} should be a number`;
  if (num < 1) throw `${varName} should be a positive number`;
  return num;
};

const checkUrl = (urlString) => {
  let flag = true;
  try {
    flag = Boolean(new URL(urlString));
  } catch (e) {
    flag = false;
  }
  if (!flag) throw "Invalid Photo URL";
  return urlString;
};

module.exports = {
  checkStockName,
  getTimeDifference,
  checkPassword,
  checkUsername,
  checkName,
  checkId,
  checkString,
  checkEmail,
  checkPosNumber,
  checkUrl,
};
