/* ====> Remove duplicate characters from string <=== */
const str11 : string = 'applemango';
const removeDuplicatesSet1 = new Set(str11)
console.log(removeDuplicatesSet1) // Set (8) {"a", "p", "l", "e", "m", "n", "g", "o"} 

console.log(Array.from(removeDuplicatesSet1).join("")) // aplemngo

const str22 : string = 'applemango';
const charArray = [...str22];
const removeDuplicatesSet2 = new Set(charArray)
console.log(removeDuplicatesSet2) // Set (8) {"a", "p", "l", "e", "m", "n", "g", "o"} 

console.log(Array.from(removeDuplicatesSet2).join("")) // aplemngo