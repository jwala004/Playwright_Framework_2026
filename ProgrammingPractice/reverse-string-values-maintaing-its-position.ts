// Reverse string values maintaing its position
const str : string = 'playwright is awesome'
const splittedArray = str.split(' ')

const reverseStringMaintainingItsPosition = () =>{

let finalString : string = ''

for(let i = 0; i < splittedArray.length; i++){

finalString = finalString + reverseString(splittedArray[i]) + ' '

}
console.log(finalString)
}

const reverseString = (inputString : string) : string =>{

    let finalReversedString : string = ''

    for(let i = inputString.length - 1; i >= 0; i--){
        finalReversedString = finalReversedString + inputString.charAt(i)
    }
    return finalReversedString
}

reverseStringMaintainingItsPosition()