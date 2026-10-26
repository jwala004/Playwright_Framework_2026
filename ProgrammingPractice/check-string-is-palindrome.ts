// check-string-is-palindrome

const originalstring : string = 'madam'

const reversedString = (inputstring : string) : string =>{

    let finalreversedstring = ''

    for(let i = inputstring.length - 1;  i >= 0; i --){
        finalreversedstring = finalreversedstring + inputstring.charAt(i)
    }

    console.log(finalreversedstring)
    return finalreversedstring
}

console.log(originalstring === reversedString(originalstring))