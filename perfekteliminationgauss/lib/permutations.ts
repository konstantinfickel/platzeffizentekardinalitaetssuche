import { slice, range, reduce } from 'lodash';

const swap = <T>(firstElement: number, secondElement: number, array: T[]): T[] => firstElement !== secondElement ? [
    ...slice(array, 0, firstElement),
    array[secondElement],
    ...slice(array, firstElement + 1, secondElement),
    array[firstElement],
    ...slice(array, secondElement + 1)
] : array;

// Heaps Algorithm: https://stackoverflow.com/questions/27539223/permutations-via-heaps-algorithm-with-a-mystery-comma
export const permutate = <T>(permutation: T[], n: number = permutation.length): T[][] =>
    (n == 1)
        ? [permutation]
        : reduce(range(0, n), ({ p, r }: { p: T[], r: T[][] }, i: number) => ({
            r: [...r, ...permutate(p, n - 1)],
            p: swap(n % 2 ? 0 : i, n - 1, p),
        }), { p: permutation, r: [] as T[][] }).r;
