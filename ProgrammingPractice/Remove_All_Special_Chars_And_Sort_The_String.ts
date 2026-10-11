/* ====> Replace all special characters and sort the string in ascending order <==== */
const mixstr : string = '$jLwa-la@45321WQ'

const strtomanipulate = mixstr.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
console.log(strtomanipulate)

const arr1 = [...strtomanipulate]

let letters : string[] = []; 
let numerics : number[] = [];

for(const a of arr1){
    if(a >= 'a'&& a <= 'z' || a >= 'A' && a <='Z'){
        letters.push(a);
    }else{
        numerics.push(Number(a));
    }
}

let finalString = letters.sort().join("").concat(numerics.sort((a, b) => Number(a) - Number(b)).join(""))
console.log(finalString)