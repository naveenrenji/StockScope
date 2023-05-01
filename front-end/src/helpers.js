//Function to  check if the user inputted in the number of shares box is integer. 
const checkNumberOfShares = (shares) => {

    if (!shares) {

        alert("Please pass the shares value");
        return false;
    }

    if (!/^\d+$/.test(shares)) {

        alert("Please pass only integer value");
        return false;
    }

    const checknum = parseInt(shares);
    if (!Number.isInteger(checknum)) {
        alert("Please pass an Integer value in the number of shares");
        return false;
    }
    return true;
}

//Function to  check if the buying price in the avg-buying-price box is integer/Float. If not return false
const checkBuyingPrice = (price) => {

    if (!price) {

        alert("Please pass the price value");
        return false;
    }

    if (!/^\d+$/.test(price)) {

        alert("Please pass only integer or float value");
        return false;
    }

    const checknum = parseFloat(price);
    if (!Number.isFinite(checknum) || !Number.isInteger(checknum)) {

        alert("Please pass the Average Price as an Integer or decimal");
        return false;
    }

    return true;
}


const checkId = (id, varName) => {
    if (!id) 
      throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") 
      throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!mongo.ObjectId.isValid(id)) 
      throw `Error: ${varName} invalid object ID`;
    return id;
  };
  



  const checkString = (strVal, varName) => {
    if (!strVal) 
      throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") 
      throw `Error: ${varName} must be a string!`;
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
    if (!strVal) 
      throw "You must provide a name";
    if (typeof strVal !== "string")
       throw "name must be a string";
    if (strVal.trim().length === 0)
      throw "name cannot be an empty string or string with just spaces";
    strVal = strVal.trim();
    let a = strVal.split(" ");
    if (a.length != 2) 
      throw "name must have first and last name only";
    a.forEach((element) => {
      if (!/^[a-zA-Z]+$/.test(element)) throw "name must contain only alphabets";
      if (element.length < 3) throw "name must have atleast 3 letters";
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
    checkString
 }