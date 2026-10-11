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