import { readJSON, outputFile } from 'fs-extra';
import { buildGraph, mcs, checkIfPeo } from 'lib/chordal';
import { gaussSteps } from 'lib/gauss';
import { map, range, filter } from 'lodash';
import { makeSymmetrical, orderMatrixSymmetricalBy, countNonZeros } from 'lib/matrix';
import { resolve } from 'path';
import { permutate } from 'lib/permutations';

export const gauss = async ({
    file = './matrix.json',
    usePeo = true,
}: {
        file: string,
        usePeo: boolean
    }) => {
    const matrix = makeSymmetrical(await readJSON(file));
    const graph = buildGraph(matrix);
    const ordering = mcs(graph);

    console.log(checkIfPeo(ordering, graph));

    const executionMatrix = usePeo ? orderMatrixSymmetricalBy(matrix, ordering) : matrix;

    console.log(executionMatrix);

    const gaussExecution = gaussSteps(executionMatrix);

    console.dir(map(gaussExecution, countNonZeros));
};

export const countPEOs = async ({
    file = './matrix.json',
}: {
        file: string,
    }) => {
    const matrix = makeSymmetrical(await readJSON(file));
    const graph = buildGraph(matrix);

    checkIfPeo(range(0, graph.length), graph);

    console.dir(filter(
        permutate(range(0, graph.length)),
        (ordering) => checkIfPeo(ordering, graph)
    ).length);
};

const isNumericalZero = (element: number): boolean => Math.abs(element) < 0.001;

export const createDat = async ({
    file = './matrix',
    usePeo = true,
    outputFolder = '../img/gausssteps/',
    outputName = 'optimized',
}: {
        file: string,
        usePeo: boolean,
        outputFolder: string,
        outputName: string
    }) => {
    const matrix = makeSymmetrical(await readJSON(file));
    const symmetricalMatrix = makeSymmetrical(matrix);
    const graph = buildGraph(symmetricalMatrix);
    const ordering = mcs(graph);

    console.log(checkIfPeo(ordering, graph))

    console.log(ordering);

    const executionMatrix = usePeo ? orderMatrixSymmetricalBy(symmetricalMatrix, ordering) : matrix;
    const gaussExecution = gaussSteps(executionMatrix);

    await Promise.all(map(gaussExecution, async (stepMatrix, stepNumber) => {
        const parsedMatrix = map(stepMatrix, (matrixRow, row) => map(matrixRow, (element, column) => {
            if (isNumericalZero(element)) {
                return 0;
            } else if (isNumericalZero(executionMatrix[row][column])) {
                return 1;
            }
            return 2;
        }));

        const output = `${map(parsedMatrix, x => x.join('\t')).join('\n')}\n`

        await outputFile(resolve(outputFolder, `${outputName}_${stepNumber}.dat`), output);
    }));
};
