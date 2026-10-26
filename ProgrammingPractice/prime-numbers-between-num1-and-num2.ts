const primeNumsBetween2Nums = (num1 : number, num2 : number) =>{

    for(let i = num1; i <= num2; i++){

    if(checkPrimeNumber(i)){
        console.log(i)
    }

    }
}

const checkPrimeNumber = (inputNum : number) : boolean =>{

    let counter : number = 0
    let isPrime : boolean = true

    if(inputNum <= 1){
         return false
    }

    for(let i = 2; i <= inputNum/2; i++){

        if(inputNum % i === 0){
            counter++
            break;
        }

    }
    if(counter > 0){
        isPrime = false
    }
    return isPrime
}

primeNumsBetween2Nums(1, 10)