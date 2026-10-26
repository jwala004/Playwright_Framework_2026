const checkPrimeNumber = (inputNum : number) : boolean =>{

    let counter : number = 0
    let isPrime : boolean = true

    for(let i = 2; i <= inputNum/2; i++){

        if(inputNum % i === 0){
            console.log(i)
            counter++
            break;
        }

    }
    console.log('counter: '+ counter)

    if(counter > 0){
        isPrime = false
    }
    return isPrime
}

console.log('checkPrimeNumber: '+ checkPrimeNumber(70))