const checkStockName = (name) => {

    if (!name) {

        const error = new Error("Please pass the stock name");
        error.statusCode = 400;
        throw error;
    }

    if (!(/^[a-zA-Z]+$/).test(name)) {
        const error = new Error("Stock Symbol should only contain alphabets");
        error.statusCode = 400;
        throw error;
    }

}

module.exports = {
    checkStockName
}