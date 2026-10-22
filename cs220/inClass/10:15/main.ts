// write a function enumerate that takes in an iterable and returns
// an iterable iterator that produces a sequence of pairs (index, item)
// The implantation should use a generator

function* enumerate<T>(iterable: Iterable<T>){
    const iterator = iterable[Symbol.iterator]();
    let i = 0;
    let res = iterator.next();
    while(!res.done){
        yield [i++, res.value];
        res = iterator.next();
    }
}

for (const pair of enumerate(["spam", "egg", "sausage"])){
    console.log(pair);
}