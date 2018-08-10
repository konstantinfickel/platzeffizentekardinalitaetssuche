import { Matrix } from "./gauss";
import { map } from 'lodash';

export const matrixToTex = (matrix: Matrix): string => 
    `\\(\n\\begin{smallmatrix}\n${
        map(matrix, row => row.join('&')).join('\\\\\n')
    }\n\\end{smallmatrix}\n\\)\n`;
