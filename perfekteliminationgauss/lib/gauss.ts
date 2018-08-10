import {slice, map, zip, findIndex, range, forEach, round} from 'lodash';

export type Matrix = number[][];

export const swap = (firstLine: number, secondLine: number, matrix: Matrix): Matrix => firstLine !== secondLine ? [
    ...slice(matrix, 0, firstLine),
    matrix[secondLine],
    ...slice(matrix, firstLine + 1, secondLine),
    matrix[firstLine],
    ...slice(matrix, secondLine + 1)
] : matrix;

const multiplyLine = (line: number[], multiplier: number): number[] =>
    map(line, entry => entry * multiplier);

const addLines = (firstLine: number[], secondLine: number[]): number[] =>
    map(zip(firstLine, secondLine) as Array<[number, number]>, ([a, b]: [number, number]): number => a + b);

export const add = (sourceLine: number, targetLine: number, multiplier: number, matrix: Matrix): Matrix => [
    ...slice(matrix, 0, targetLine),
    addLines(matrix[targetLine], multiplyLine(matrix[sourceLine], multiplier)),
    ...slice(matrix, targetLine + 1)
];

export const multiply = (line: number, multiplier: number, matrix: Matrix): Matrix => [
    ...slice(matrix, 0, line),
    multiplyLine(matrix[line], multiplier),
    ...slice(matrix, line + 1)
];

type Pivot = {row: number, column: number};

export const findPivot = (lastPivot: Pivot = {row: -1, column: -1}, matrix: Matrix): Pivot | null => {
    if(lastPivot.column + 1 >= matrix[0].length) {
        return null;
    }

    const newRow = findIndex(map(matrix, iteratedRow => iteratedRow[lastPivot.column + 1]), i => i !== 0, lastPivot.row + 1);

    if(newRow === -1) {
        return findPivot({
            row: lastPivot.row,
            column: lastPivot.column + 1
        }, matrix);
    }

    return {
        row: newRow,
        column: lastPivot.column + 1,
    };
}

export const gaussStep = (lastPivot: Pivot, matrix: Matrix) => {
    const pivot = findPivot(lastPivot, matrix);

    if(pivot == null) return {
        matrix,
        pivot
    };

    let modifiedMatrix = swap(lastPivot.row + 1, pivot.row, matrix);
    pivot.row = lastPivot.row + 1;

    modifiedMatrix = multiply(pivot.row, 1 / modifiedMatrix[pivot.row][pivot.column], modifiedMatrix);

    forEach(range(pivot.row + 1, matrix.length), row => {
        modifiedMatrix = add(pivot.row, row, -modifiedMatrix[row][pivot.column], modifiedMatrix);
    });

    return {
        matrix: modifiedMatrix,
        pivot
    };
}

export const gaussSteps = (matrix: Matrix): Matrix[] => {
    let modifiedMatrix = matrix;
    const steps = [];

    let pivot: Pivot | null = {row: -1, column: -1};
    do {
        steps.push(modifiedMatrix);
        const result = gaussStep(pivot, modifiedMatrix);
        pivot = result.pivot;
        modifiedMatrix = result.matrix;
    } while (pivot != null);

    return steps;
};

export const makeDisplayable = (matrix: Matrix) => map(matrix, line => map(line, x => Math.abs(x) < 0.001 ? 0 : round(x,2)));