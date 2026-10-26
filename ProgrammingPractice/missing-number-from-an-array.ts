const arr11 = [1, 2, 4, 5]

const n = arr11.length + 1
console.log(n)
const expected = (n*(n+1))/2

console.log(expected)

let actual = 0;

for(let i of arr11){
actual = actual + i;
}

console.log('missing number: ' + (expected - actual))