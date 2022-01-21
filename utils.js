module.exports = {
    makeId,
}

function makeId(length) {
    let result = '';
    const characters = "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz";
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}