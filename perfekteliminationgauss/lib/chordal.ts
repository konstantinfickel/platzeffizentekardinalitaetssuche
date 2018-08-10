import { isNumber, range, unzip, forEach, map, filter, flatten, negate, uniqWith, head, sortBy, tail, reverse, isEqual, every, intersection } from 'lodash';

interface Node {
    neighbors: Node[];
    line: number;
    label: number;
}

type Graph = Node[];

const crossProduct = <T, S>(a: T[], b: S[]): Array<[T, S]> => flatten(
    map(a, aEntry => map(b, bEntry => [aEntry, bEntry] as [T, S]))
);

const identical = ([a, b]: [any, any]) => a === b;

export const oldBuildGraph = (matrix: number[][]): Graph => {
    const graph: Graph = range(0, matrix.length).map((line: number) => ({
        line,
        neighbors: [],
        label: 0,
    }));

    forEach(unzip(matrix), (matrixRow: number[]) => {
        const rowsToBeConnected = filter(
            map(matrixRow, (value, key) => value !== 0 ? key : -1),
            (value: number) => value !== -1
        );

        const pairsToBeConnected: Array<[number, number]> = filter(
            crossProduct(rowsToBeConnected, rowsToBeConnected),
            negate(identical)
        );

        forEach(pairsToBeConnected, ([i, j]: [number, number]) =>
            graph[i].neighbors.push(graph[j]))
    });

    return graph;
};

// Is like using M as the adjacency matrix of G
export const buildGraph = (matrix: number[][]): Graph => {
    const graph: Graph = range(0, matrix.length).map((line: number) => ({
        line,
        neighbors: [],
        label: 0,
    }));

    const toBeConnected = flatten(flatten(
        map(
            matrix,
            (row: number[], rowNumber: number): Array<Array<[number, number]>> => map(
                row,
                (cell: number, columnNumber: number): Array<[number, number]> =>
                    cell !== 0 ? [[rowNumber, columnNumber], [columnNumber, rowNumber]] : []
            )
        )
    ));

    const uniqueToBeConnected = uniqWith(filter(toBeConnected, negate(identical)), isEqual);

    forEach(uniqueToBeConnected, ([i, j]: [number, number]) =>
        graph[i].neighbors.push(graph[j]))

    return graph;
};

export const mcs = (graph: Graph) => {
    let mcsQueue: Node[] = graph;

    const ordering: number[] = [];

    let lastElement;
    while (lastElement = head(mcsQueue)) {
        ordering.push(lastElement.line);
        forEach(lastElement.neighbors, neighbor => neighbor.label++);
        mcsQueue = sortBy(tail(mcsQueue), (node: Node) => -node.label);
    }

    return reverse(ordering);
};

const allEqual = (elements: any) => every(
    unzip([elements, [...tail(elements), head(elements)]]),
    ([a, b]) => isEqual(a, b)
);

const getFullNeighborList = (nodeNumber: number, graph: Graph) =>
    sortBy([nodeNumber, ...map(graph[nodeNumber].neighbors, element => element.line)]);

export const neighborsAreClique = (node: number, subGraph: number[], graph: Graph) => {
    const requiredForClique = intersection(
        getFullNeighborList(node, graph),
        subGraph
    );

    return allEqual(
        map(
            requiredForClique,
            thisElement => intersection(
                requiredForClique,
                getFullNeighborList(thisElement, graph)
            )
        )
    );
}

export const checkIfPeo = (ordering: number[], graph: Graph) => {
    let queueLeft = [...ordering];

    let lastElement = head(queueLeft);
    while (isNumber(lastElement)) {
        if (!neighborsAreClique(lastElement, queueLeft, graph)) {
            return false;
        }
        queueLeft = tail(queueLeft);
        lastElement = head(queueLeft);
    }

    return true;
};
