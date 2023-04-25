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

export { checkNumberOfShares, checkBuyingPrice }