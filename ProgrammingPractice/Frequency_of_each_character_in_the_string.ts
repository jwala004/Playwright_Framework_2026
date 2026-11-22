/* Frequency of each character in the string, input string = 'appleapplez' => output string = 'a2p4l2e2z1' */
const str : string = 'appleapplez'
const strarr = [...str]

const map = new Map<string, number>()

for(const char of strarr){
    if(map.has(char)){
        map.set(char, map.get(char)! + 1)
    }else{
        map.set(char, 1)
    }
    // The above logic can be written like below in a single line
    // map.set(char, (map.get(char) ?? 0) + 1)
    // map.set(char, (map.get(char) || 0) + 1)
}
console.log(map) //  Map (5) {"a" => 2, "p" => 4, "l" => 2, "e" => 2, "z" => 1}

let finalStrigWithFrequency1 : string = ''

for(const [k, v] of map){
    finalStrigWithFrequency1+= k + v
}
console.log(finalStrigWithFrequency1) // a2p4l2e2z1

let finalStrigWithFrequency2 : string = ''

map.forEach((value, key) => {
    finalStrigWithFrequency2+=key + value
})
console.log(finalStrigWithFrequency2) // a2p4l2e2z1

/*
Brooo! 😂 The confusion is actually very understandable. The trick is to understand what map.get(char) returns when the character is not present in the Map.

Let's take it slowly, especially the first iteration.
1. First, understand an empty Map
const map = new Map();


Initially, our Map is empty:
Map(0) {}


Now suppose our input is:
const str = "banana";


We want to count the frequency of every character.
2. What happens on the FIRST iteration?
Our loop starts:
for (const char of str) {
    map.set(char, (map.get(char) ?? 0) + 1);
}


On the first iteration:
char = 'b';


Now JavaScript evaluates this expression:
map.get('b')


But 'b' doesn't exist in our Map!

So what does map.get('b') return?

It returns undefined.

This is the most important part to understand.

Now let's evaluate the remaining expression:
undefined ?? 0


Since the left-hand side is undefined, the nullish coalescing operator (??) returns 0.

Then:
0 + 1 = 1


Finally:
map.set('b', 1);


First iteration – visual breakdown
map.get('b')
undefined


undefined ?? 0
0


0 + 1
1


map.set('b', 1)
Stored!


See what happened? Even though 'b' didn't exist, we converted its undefined value into 0, incremented it, and inserted it into the Map.
3. What happens on the SECOND iteration?
Now the next character is:
char = 'a';


We execute:
map.get('a')


Again, 'a' doesn't exist.

Therefore:
undefined ?? 0


Returns 0.

And:
0 + 1 = 1


Now our Map becomes:
Map {
    'b' => 1,
    'a' => 1
}


4. What happens when the character already exists?
Now let's reach the fourth iteration.

Our input is "banana":
Iteration	Character	map.get(char)	New count
1	b	undefined	1
2	a	undefined	1
3	n	undefined	1
4	a	1	2
5	n	1	2
6	a	2	3

On the fourth iteration:
map.get('a')


This time, 'a' already exists with a value of 1.

Therefore:
1 ?? 0


Returns 1 (not 0).

Then:
1 + 1 = 2;


Finally:
map.set('a', 2);


The existing value gets updated from 1 to 2.

5. Now compare it with your IF-ELSE approach
I think this is where everything will click.

Using IF-ELSE:
if (map.has(char)) {
    map.set(char, map.get(char) + 1);
} else {
    map.set(char, 1);
}


Using Nullish Coalescing:
map.set(char, (map.get(char) ?? 0) + 1);


Both achieve exactly the same result.

Look at the mapping:
IF-ELSE logic	Nullish coalescing logic
map.has(char)	map.get(char) !== undefined for this Map
If absent, insert 1	undefined ?? 0, then + 1
If present, increment existing value	Existing value + 1

*/