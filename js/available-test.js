let pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ]/;

let ko1 = 'ㅏ';
let ko2 = '과';

let result1 = pattern_kor.test(ko1);
let result2 = pattern_kor.test(ko2);

console.log(result1, result2);