// M-1
const arr: number[] = [12, 45, 123, 19, 234, 156, 78, 100];

for(const a1 of arr){
if(a1.toString().startsWith('1'))
console.log(a1)
}

// M-2
const result = arr.filter(num => num.toString().startsWith('1'));

console.log(result);