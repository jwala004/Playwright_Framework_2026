// Second largest distinct number from array [M-1]
const arr11 = [50, 5,  10, 15, 5, 20, 10, 25]
arr.sort((a, b) => a - b)
console.log(arr11)

const set = new Set<number>(arr11)
console.log(set)

const newarr = [...set]
console.log(newarr[newarr.length - 2])

// Second largest distinct number from array [M-2 (Two pointer approach)] -> this code needs to be optimized
const getSecondLargest = (arr: number[]): number | null => {
    if (arr.length < 2) {
        return null; // Not enough elements for a second largest
    }

    let largest: number = -Infinity;
    let secondLargest: number = -Infinity;

    for (const num of arr) {
        if (num > largest) {
            // If current number is greater than largest,
            // shift old largest to secondLargest, then update largest
            secondLargest = largest;
            largest = num;
        } else if (num > secondLargest && num < largest) {
            // If current number is strictly between secondLargest and largest
            secondLargest = num;
        }
    }

    // Return null if all numbers were identical (e.g., [5, 5, 5])
    return secondLargest === -Infinity ? null : secondLargest;
};

// Example usage:
const arr = [50, 5, 10, 15, 5, 20, 10, 25];
console.log('Second Largest:', getSecondLargest(arr)); // Output: 25



