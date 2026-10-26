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
let duplicateArray2 = [] // empty array declaration

let counter = 0

const duplicateFinderSet = new Set<number>()

for(const a of arr){
    if(duplicateFinderSet.has(a)){
        duplicateArray.push(a)
        duplicateArray2.push(a)
    }else{
        duplicateFinderSet.add(a)
    }
}
console.log(duplicateArray)

// Duplicate elements from an array [M-3]
const arr = [5, 10, 15, 5, 20, 10, 25]

let counter = 0

const duplicateFinderSet = new Set<number>()
const duplicateElementsSet = new Set<number>

for(const a of arr){
    if(duplicateFinderSet.has(a)){ // checking if the value is already present in previous set then adding it into a new set
        duplicateElementsSet.add(a)
    }else{
        duplicateFinderSet.add(a)
    }
}
console.log(duplicateElementsSet) // it will print/contain all duplicate elements
console.log(duplicateFinderSet)
