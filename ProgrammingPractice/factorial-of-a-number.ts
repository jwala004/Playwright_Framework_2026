const factorialOfGivenNumber =  (inputNum : number) : number => {

    let finalFactorial : number = 1

    for(let i = 1; i <= inputNum; i++){
        finalFactorial = finalFactorial * i
    }
    return finalFactorial
}

console.log(factorialOfGivenNumber(7))