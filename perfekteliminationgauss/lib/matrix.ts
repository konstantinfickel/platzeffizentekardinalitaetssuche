import { map, zip, sortBy, unzip, reverse, forEach, reduce } from 'lodash';
import { create } from 'domain';
import { Matrix } from './gauss';

export const makeSymmetrical = (matrix: number[][]): number[][] =>
    map(
        zip(unzip(matrix), matrix) as Array<[number[], number[]]>,
        ([firstRow, secondRow]: [number[], number[]]) =>
            map(zip(firstRow, secondRow) as Array<[number, number]>, ([x, y]: [number, number]) => Math.max(x, y))
    );

export const orderMatrixBy = (matrix: number[][], ordering: number[]): number[][] =>
    map(sortBy(zip(ordering, matrix) as Array<[number, number[]]>, (row: [number, number[]]) => row[0]), (row: [number, number[]]) => row[1]);

export const orderMatrixSymmetricalBy = (matrix: number[][], ordering: number[]): number[][] =>
    orderMatrixBy(unzip(orderMatrixBy(unzip(matrix), ordering)), ordering);

export const createEmptyMatrix = (rows: number, columns: number) =>
    Array.apply(null, Array(rows))
        .map(() =>
            Array.apply(null, Array(columns))
                .map(() => 0)
        );

export const peoToMatrix = (ordering: number[]) => {
    const matrix = createEmptyMatrix(ordering.length, ordering.length);

    forEach(ordering, (column, row) => matrix[row][column] = 1);

    return matrix;
};

const isNumericalZero = (element: number): boolean => Math.abs(element) < 0.001;

export const countNonZeros = (matrix: Matrix): number =>
    reduce(
        map(
            matrix,
            (row) => reduce(
                map(row, x => isNumericalZero(x) ? 0 : 1),
                (x, y) => x + y,
                0
            )
        ),
        (x, y) => x + y,
        0
    );