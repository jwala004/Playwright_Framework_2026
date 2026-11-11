// Duplicate elements from an array
const arr = [5, 10, 15, 5, 20, 10, 25]

let counter = 0

const duplicateFinderSet = new Set<number>()

for(const a of arr){
    if(duplicateFinderSet.has(a)){
        console.log(a)
    }else{
        duplicateFinderSet.add(a)
    }
}

// Duplicate elements from an array [M-2]
const arr = [5, 10, 15, 5, 20, 10, 25]

let duplicateArray = new Array() // empty array declaration
// let duplicateArray2 = [] // empty array declaration

const duplicateFinderSet = new Set<number>()

for(const a of arr){
    if(duplicateFinderSet.has(a)){
        duplicateArray.push(a)
        // duplicateArray2.push(a)
    }else{
        duplicateFinderSet.add(a)
    }
}
console.log(duplicateArray)
// console.log(duplicateArray2)

// Duplicate elements from an array [M-3]
const numbers = [5, 10, 15, 5, 20, 10, 25];

const seen = new Set<number>();
const duplicates = new Set<number>();

for (const num of numbers) {
    if (seen.has(num)) {
        duplicates.add(num);
    } else {
        seen.add(num);
    }
}

console.log(duplicates); // Contains all duplicate elements
console.log(seen);       // Contains all unique elements encountered
