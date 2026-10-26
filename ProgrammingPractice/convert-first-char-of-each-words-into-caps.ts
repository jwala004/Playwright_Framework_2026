// convert-first-char-of-each-words-into-caps [M-1] = Best approach
// a1.charAt(0).toUpperCase() + a1.slice(1) -> convert the first char to uppercase
// a1[0].toUpperCase() + a1.slice(1) -> convert the first char to uppercase
const arr11 = ['jwala', 'sonu', 'monu', 'devansh']

const arrnew = []

for(const a1 of arr11){
    // console.log(a1.slice(0, a1.length - (a1.length - 1)).toUpperCase() +'' + a1.slice(1, a1.length))
    arrnew.push(a1.slice(0, a1.length - (a1.length - 1)).toUpperCase() +'' + a1.slice(1, a1.length))
}
 console.log(arrnew)

// convert-first-char-of-each-words-into-caps [M-2]
const arr11 = ['jwala', 'sonu', 'monu', 'devansh']

const arrnew = []
let finalstring = ''

for(const a1 of arr11){
    // console.log(a1.slice(0, a1.length - (a1.length - 1)).toUpperCase() +'' + a1.slice(1, a1.length))
    finalstring = finalstring + a1.slice(0, a1.length - (a1.length - 1)).toUpperCase() +'' + a1.slice(1, a1.length)
    arrnew.push(finalstring)
    finalstring = ''
}
 console.log(arrnew) 