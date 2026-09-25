🚀 TypeScript For Automation Testers

# What is TypeScript
TypeScript is JavaScript with types.
It adds safety by catching errors during development instead of runtime.

# Why TypeScript for Automation
TypeScript provides better auto-complete, fewer bugs, and clearer code.
This makes automation frameworks easier to build, read, and maintain.

# Types (Core Idea)
Types define what kind of value a variable can store.
This prevents invalid data and reduces mistakes.

# Pre-Requisites
🔹 Node.js
Required to run JavaScript and TypeScript outside the browser.
🔹 VS Code
Used to write, manage, and debug TypeScript projects.
🔹 TypeScript Installed
Needed to compile TypeScript files into JavaScript.
To install Typescript globally or in vs code, use command => npm install -g typescript

# Variables
Variables store values that can be reused in the program.
In TypeScript, we can also define the type of each variable.
🔹 let vs const
Use const by default.
Use let only when the value changes. [when we want to change the value later on, then use let keyword]
Execute both ts and js file all at once in a single command, like below;
⇒ tsc typescript-practce.ts && node typescript-practce.js
It will execute both commands at once, or we need to run one by one.


# Data Types
Data types define what kind of data a variable holds.

🔹 String
Stores text values like names or URLs.
let nameVal: string = 'Jwala'
let description: string = nameVal + ' is best'
we can also use double quotes, to declare string like,  let nameVal: string = "Jwala"
Or a better way to concatenate variables; using backticks to declare variables
let nameVal: string = 'Jwala'
let description: string = `${nameVal} is best` 

🔹 Number
Stores numeric values such as counts or timeouts.
let count: number = 9

🔹 Boolean
Stores true or false values for checks and validations.
let isVisible: boolean = false

=> If you are not sure about the data type, then use 'any' keywrod
Example;
let num1: any = 20
num1 = 'abc'


# 🔹 Arrays
=> Arrays store multiple values of the same type in a list.
Example: 
let users: string[] = ["Ram", "Shyam", "Mohan"]
console.log(users[1]); // Shyam

# Note: There is another way of creating array, like below;
let numArray: Array<number> = [5, 10, 15, 20, 25]
console.log(users[1]); // 10

# 🔹 Tuples
=> We can also store multiple values of different types in an array, which is called a tuple in TypeScript.
Example: 
let users: string[] = ["Ram", 35, "Shayam", 32, "Mohan", 30]
console.log(users[1]); // 35

# 🔹 Objects with Types
Objects group related data together with defined structure and types.
Example: 
let userDetails: {username: string,
                password: string,
                age: number} = {username: 'jk004',
                passwprd: 'pass123',
                age: 20
                }
console.log(userDetails.age); // 20                

# 🔹 Why Types Help
TypeScript immediately shows an error if the wrong type is assigned, preventing bugs early.

# Functions
Functions can define types for inputs and return values.
This ensures correct data is passed and returned.
Example: 
function sayHello(): void{
    console.log("Hello")
}
sayHello() // function is called here
Output: 
Hello

🔹 Parameters
Allow functions to receive input values with specific types.
Example:
const add = (num1: number, num2: number): void =>{
    console.log(num1 + num2)
}
add(5, 5) // function is called here
Output: 
10

🔹 Return Type
Defines what type of value the function should return.
Example 1:
const add = (num1: number, num2: number): number => {
    return num1 + num2;
};

console.log(add(5, 5)); // function is called here

Output: 
10

Example 2:
const add = (num1: number, num2: number): number => {
    return num1 + num2;
};

const sum = add(5, 5); // function is called here
console.log(sum);

Output: 
10

Example 3:
const add = (num1: number, num2: number): number => {
   const sum = num1 + num2;
    return sum;
};
console.log(add(5, 5)) // function is called here

Output: 
10

🔹 Arrow Functions
Shorter and modern syntax for writing functions.
Example: 
const sayHello = ()=> { // or adding return type to function const sayHello = (): void => {
    console.log("Hello")
}
sayHello() // function is called here
Output: 
Hello

🔹 Optional Parameters
Optional parameters allow functions to accept values that may or may not be provided.
This adds flexibility to function calls.
Example:
function greet(name?: string){ // question mark is used to mark parameters as optional
    console.log(`Hello ${name}`)
}
greet("Jwala") // function is called here
greet() // function is called here
Output: 
Hello undefined// when called without parameters
Hello Jwala // when called with parameters

# Arithmetic Operators
Used for mathematical calculations such as addition, subtraction, multiplication, and division.
Same behavior as JavaScript.
Example:
console.log(5+5) // 10
console.log(5-5) // 0
console.log(5*5) // 25
console.log(5/5) // 1
console.log(5%5) // 0


# Comparison Operators
Used to compare values and always return true or false.
Commonly used inside conditions and validations.
Example:
let num1: number = 5
let num2: number = 5
console.log(num1 === num2) // true
console.log(num1 !== num2) // false
console.log(num1 > num2) // false
console.log(num1 < num2) // false
console.log(num1 >= num2) // true
console.log(num1 <= num2) // true

let str1: string = 'jwala'
let str2: string = 'kumar'
console.log(str1 === str2) // false
console.log(str1 !== str2) // true

# Logical Operators
Used to combine multiple conditions.
Helps create more complex decision-making logic.
Example:
let age: number = 20
let isElgibleToVote: boolean = true

console.log(age >= 18 && isElgibleToVote) // true
console.log(age <= 18 || isElgibleToVote) // true
console.log(age <= 18 || !isElgibleToVote) // false
console.log(! (age>=18)) // false


# Conditions (if / else)
Conditions allow the program to make decisions based on true or false results.
Syntax is the same as JavaScript.
Example:
const num1: number = 5;
const num2: number = 5;

if(num1===num2){
console.log("num1 is equal to num2");
}else if(num1 > num2){
console.log("num1 is greater than num1");
}else{
console.log("num2 is greater than num1");
}

# Loops
Loops repeat the same steps multiple times.
Useful when handling multiple elements or test data.
Example:
for(let i = 0; i<= 10; i++){
console.log(i);
}

# for-of loop
let users: string[] = ["jk1", "jk2", "jk3", "jk4", "jk5"]
for(const user of users){
console.log(user);
}

# Async & Await
Async and await handle tasks that take time to complete.
TypeScript behavior is identical to JavaScript, with added return type clarity.
Example:
async function loadData(): Promise<void> {
 await fetch("https://example.com");
}

# Interface
Interfaces define the structure of objects.
They make test data clean, reusable, and easy to maintain.
Example:
interface User {
    username: string;
    password: string;
    age: number
}

let userDetail: User = { // User is here the name of interface and observe it is also acting as type for 'userDetail' variable
 username: "jwala",
    password: "pass123",
    age: 25
}
console.log(userDetail.username)

# Type (Alternative to Interface)
Type is another way to define data structure.
Often used for custom types or limited value sets.
🔹 When to Use
Use interface for objects.
Use type for custom or restricted values.
And Type is case-sensitive.
Example 1:
type User = {
    username: string;
    password: string;
    age: number;
}

let userDetails : User ={
    username: "jwala",
    password: "pass123",
    age: 31
}
console.log(userDetails.username)

Output:
jwala

Example 2:
type Status = "Pass" | "Fail" | "Skip"
let testStatus : Status = "Skip"

console.log(testStatus)

Output:
Skip

# Classes
Classes group related data and actions together.
They help organize code and structure automation frameworks.
Example:
class LoginPage{

}

# Methods
Methods are functions defined inside classes.
They perform specific actions related to that class.
=> So, methods are nothing but functions, but when we use the function, so it is not related to the classes. But if any function is related to the classes, we are going to call it as method.
=> The syntax is almost similar, The only thing is that we need not to use that function keyword. 
Example:
class LoginPage{
 num1: number = 20; // variable declaration
 login() : void{ // method declaration
    console.log("Login called")
 }   
}

# Objects & Method Calling
Objects are created from classes.
They allow access to class properties and methods.
Methods are executed using the dot operator.
TypeScript ensures type safety while accessing them.
Example:
class LoginPage{
 num1: number = 20; // variable declaration
 login() : void{ // method declaration
    console.log("Login called")
 }   
}

const loginPageObject = new LoginPage() // or it can be created like this, const loginPageObject : LoginPage = new LoginPage()
loginPageObject.login()

o/p:
Login called

# Constructor
The constructor runs automatically when an object is created.
It initializes values and prepares the class for use.
Constructor parameters can also have types.
Example:
class LoginPage{
nameValue: string // variable declaration
company: string // variable declaration

constructor(nameValue: string){
    console.log("Inside LoginPage's constructor")
    this.nameValue = nameValue
    this.company = "YouTube"
}

 login() : void{ // method declaration
    console.log("Login called")
 }   

}

const loginPageObject = new LoginPage("Jwala"); // as soon as object got created, constructor will get called
loginPageObject.login() // then login method wil be executed
console.log(loginPageObject.nameValue) 
console.log(loginPageObject.company)

o/p:
Inside LoginPage's constructor
Login called
Jwala
YouTube


# Import / Export
Import and export split code into multiple files.
This improves project organization and maintainability.
Same behavior as JavaScript.
=> In actual project, we are going to use multiple files, so in that case this Import / Export is going to be helpful

Example:
file1.ts (create a file with this name or name of your choice)

export class LoginPage{
nameValue: string = "Jwala" // variable declaration
company: string = "kumar" // variable declaration

 login() : void{ // method declaration
    console.log("Login called")
 }   

}

file2.ts (create another file)
import {LoginPage} from ".typescript-practice"

const obj = new LoginPage()
obj.login()
console.log(obj.a)

o/p:
Login called
20

==> another way to do Import / Export
export default class LoginPage{ // adding default keyword here will remove the need to use curly braces, when importing
}
now when importing, like this;
import LoginPage from ".typescript-practice"

# ==> Adding the semicolon at the end of any statement, terminates that statement.
And it is option to use.

# TypeScript vs JavaScript
TypeScript is not a new language.
It is simply JavaScript with additional type safety.
Removing types makes it normal JavaScript.
Example:



# Final Summary
For automation testing, you only need:
Data types
arrays
objects
functions
conditions
loops
async/await
interfaces
type aliases
classes
Advanced TypeScript concepts are usually unnecessary.
