/* ===> Last non-repeating character in a string <=== */
const str : string = 'applejwaladevansh'
const strarray = [...str]

const map = new Map<string, number>();

for(const char of strarray){
    map.set(char, (map.get(char) ?? 0) + 1)
}

let finalString = ''

map.forEach((value, key) =>{
if(value === 1){
finalString = finalString + key
}
})

console.log(finalString)

// Find the value based on index

// M-1
console.log(finalString[finalString.length - 1])

// M-2
console.log(finalString.charAt(finalString.length - 1))
