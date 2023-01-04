const makeObjCopy = (obj = {}, i = 0, newObj = {}) => {
    let key = Object.keys(obj)[i]
    if (!key) return newObj
    if (typeof obj[key] === 'Object') {
        newObj[key] = makeObjCopy(obj[key])
    }
    else {
        newObj[key] = obj[key]
        return makeObjCopy(obj,++i,newObj)
    }
}


export default makeObjCopy

const compute_e = (steps) => {
    let factorial = 1
    let denominator = 1
    let numerator = 1
    for (let i = 1; i <= steps; i++) {
        factorial *= i;
        numerator = factorial * numerator + denominator;
        denominator *= factorial;
    }
    return numerator / denominator
}

for (let i = 1; i<=24;i++) {console.log(compute_e(i))}
