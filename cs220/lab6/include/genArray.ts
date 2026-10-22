// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(n: number): number[] {
    const arr = [...Array(n).keys()];
    swap(arr);
    return arr;
}

function swap(arr: number[] | number[][]) {
    for (let i = arr.length - 1; i > 0; --i) {
        const randomInt = Math.floor(Math.random() * arr.length);
        const tmp = arr[i];
        arr[i] = arr[randomInt];
        arr[randomInt] = tmp;
    }
}

function GEN_ARRAY_SOLUTION_1(n: number): number[][] {
    const ref_arr = shuffle(n);
    const arr = Array(n).fill(Array(n)).map((_, i) => ref_arr.map((_, i2) => ref_arr[(i + i2) % n]));
    return arr;
}

function GEN_ARRAY_SOLUTION_2(n: number): number[][] {
    const ref_arr = shuffle(n);
    const arr = Array(n).fill(Array(n)).map((_, i) => ref_arr.map((_, i2) => ref_arr[(i + i2) % n]));
    swap(arr);
    return arr;
}

function GEN_ARRAY_SOLUTION_3(n: number): number[][] {
    const ref_arr = [...Array(n).keys()];
    const arr = Array(n).fill(Array(n)).map((_, i) => ref_arr.map((_, i2) => ref_arr[(i + i2) % n]));
    return arr;
}

export const GEN_ARRAY_SOLUTIONS = [
    // Working implementation
    GEN_ARRAY_SOLUTION_1,
    // Same as 1, but no rows swapped
    GEN_ARRAY_SOLUTION_2,
    // No randomness
    GEN_ARRAY_SOLUTION_3
];

function FLAWED_GEN_ARRAY_SOLUTION_1(n: number): number[][] {
    return Array(n).fill(n).map(shuffle);
}

function FLAWED_GEN_ARRAY_SOLUTION_2(n: number): number[][] {
    const array = Array(n).fill(n).map(shuffle);
    return array.map((_, i) => array.map(r => r[i]));
}

function FLAWED_GEN_ARRAY_SOLUTION_3(n: number): number[][] {
    return GEN_ARRAY_SOLUTION_1(n).map(row => [...row, 0]);
}

function FLAWED_GEN_ARRAY_SOLUTION_4(n: number): number[][] {
    const array = GEN_ARRAY_SOLUTION_1(n);
    array.push(Array(n).fill(0));
    return array;
}

function FLAWED_GEN_ARRAY_SOLUTION_5(n: number): number[][] {
    return GEN_ARRAY_SOLUTION_1(n).map(row => row.map(num => num + 1));
}

function FLAWED_GEN_ARRAY_SOLUTION_6(n: number): number[][] {
    const array = GEN_ARRAY_SOLUTION_1(n);
    array[0][0] = 0;
    return array;
}

export const FLAWED_GEN_ARRAY_SOLUTIONS = [
    // Only rows are permutations
    FLAWED_GEN_ARRAY_SOLUTION_1,
    // Only cols are permutations
    FLAWED_GEN_ARRAY_SOLUTION_2,
    // Rows have an extra number
    FLAWED_GEN_ARRAY_SOLUTION_3,
    // Cols have an extra number
    FLAWED_GEN_ARRAY_SOLUTION_4,
    // Instead of 0 to n - 1 numbers are 1 to n
    FLAWED_GEN_ARRAY_SOLUTION_5,
    // Number at index 0, 0 is always 0
    FLAWED_GEN_ARRAY_SOLUTION_6
];