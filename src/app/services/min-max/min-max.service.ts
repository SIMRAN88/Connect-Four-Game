import { Injectable } from '@angular/core';
import { ConnectFourService } from '../connect-four/connect-four.service';


@Injectable()
export class MinmaxService {
    data; // state of game
    filledIndex = []; // counter to get current count of filled columns

    rowCount = 8;
    colCount = 8;
    maxValue = Number.MAX_SAFE_INTEGER;

    minMaxTree; // Tree contains all possible states.

    // Util methods for moving step by step.
    left = (coords) => [coords[0], coords[1] - 1];
    right = (coords) => [coords[0], coords[1] + 1];
    bottom = (coords) => [coords[0] + 1, coords[1]];
    bottomLeft = (coords) => [coords[0] + 1, coords[1] - 1];
    bottomRight = (coords) => [coords[0] + 1, coords[1] + 1];

    /**
     * Method to check if given coordinates are in range of grid.
     */
    isInRange = (x, y) => {
        return (x >= 0 && x < this.rowCount &&
                y >= 0 && y < this.colCount);
    }

    /**
     * Method gets the count of same colored disc in given direction.
     */
    getCount = (data, val, next, coords) => {
        let x = coords[0];
        let y = coords[1];

        let count = 0;
        while (this.isInRange(x, y)
                && data[x][y] === val) {
            count++;

            const nextCoords = next(coords);
            coords = nextCoords;
            x = nextCoords[0];
            y = nextCoords[1];
        }

        return Math.floor(count);
    }

    constructor(
        private connectFourService: ConnectFourService
    ) {
        // Change internal state according to change in game state at UI.
        this.connectFourService.gridStateChanged$.subscribe((addInfo) => {
            const colIdx = addInfo.idx;
            const val = addInfo.val;

            this.filledIndex[colIdx] += 1;
            this.data[this.rowCount - this.filledIndex[colIdx]][colIdx] = val + 1;
        });
    }

    /**
     * Init all data-structures used in service.
     */
    public initMinMax() {
        this.minMaxTree = {
            root: new Node('root', [])
        };

        this.initGameState();
        this.initFilledIndex();
    }

    initGameState() {
        this.data = [];
        for (let i = 0; i < this.rowCount; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.colCount; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    initFilledIndex() {
        for (let i = 0; i < this.colCount; i++) {
            this.filledIndex[i] = 0;
        }
    }

    /**
     * Creates MinMax tree Iteratively, tree can of height of 5,
     * MinMax Tree: tree of all possible states of game according to current state.
     *
     * This MinMax algortihm is 5-plie.
     * @param data Current state of game
     * @param filledIndex Counter array of filled columns
     * @param val Value of Max player, Max player is player whose next chance is decided by this MinMax algorithm.
     */
    createTree(data, filledIndex, val) {
        for (let i = 0; i < this.colCount; i++) {
            const dataCopy = JSON.parse(JSON.stringify(data));
            const filledIndexCopy = JSON.parse(JSON.stringify(filledIndex));
            let valCopy = val;

            if (this.putValue(dataCopy, filledIndexCopy, valCopy, i, this.minMaxTree.root)) {
                valCopy ^= 1;
            } else {
                continue;
            }

            const parent = this.minMaxTree.root.childs[i];
            for (let j = 0; j < this.colCount; j++) {
                const dataCopy1 = JSON.parse(JSON.stringify(dataCopy));
                const filledIndexCopy1 = JSON.parse(JSON.stringify(filledIndexCopy));
                let valCopy1 = valCopy;

                if (this.putValue(dataCopy1, filledIndexCopy1, valCopy1, j, parent)) {
                    valCopy1 ^= 1;
                } else {
                    continue;
                }

                const parent1 = parent.childs[j];
                for (let k = 0; k < this.colCount; k++) {
                    const dataCopy2 = JSON.parse(JSON.stringify(dataCopy1));
                    const filledIndexCopy2 = JSON.parse(JSON.stringify(filledIndexCopy1));
                    let valCopy2 = valCopy1;

                    if (this.putValue(dataCopy2, filledIndexCopy2, valCopy2, k, parent1)) {
                        valCopy2 ^= 1;
                    } else {
                        continue;
                    }

                    const parent2 = parent1.childs[k];
                    for (let l = 0; l < this.colCount; l++) {
                        const dataCopy3 = JSON.parse(JSON.stringify(dataCopy2));
                        const filledIndexCopy3 = JSON.parse(JSON.stringify(filledIndexCopy2));
                        let valCopy3 = valCopy2;

                        if (this.putValue(dataCopy3, filledIndexCopy3, valCopy3, l, parent2)) {
                            valCopy3 ^= 1;
                        } else {
                            continue;
                        }

                        const parent3 = parent2.childs[l];
                        for (let m = 0; m < this.colCount; m++) {
                            const dataCopy4 = JSON.parse(JSON.stringify(dataCopy3));
                            const filledIndexCopy4 = JSON.parse(JSON.stringify(filledIndexCopy3));

                            if (!this.putValue(dataCopy4, filledIndexCopy4, valCopy3, m, parent3, true)) {
                                continue;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Checks if lastly added disc terminates the game by winning it.
     * @param data state of game
     * @param x x-coordinate of latest added disc
     * @param y y-coordinate of latest added disc
     */
    isWinningShot(data, x, y) {
        const val = data[x][y];

        const horCount = this.getCount(data, val, this.left, this.left([x, y])) +
                            this.getCount(data, val, this.right, this.right([x, y]));

        const bottomCount = this.getCount(data, val, this.bottom, this.bottom([x, y]));

        const bLeftCount = this.getCount(data, val, this.bottomLeft, this.bottomLeft([x, y]));

        const bRightCount = this.getCount(data, val, this.bottomRight, this.bottomRight([x, y]));

        return (
            horCount >= 3
            || bottomCount >= 3
            || bLeftCount >= 3
            || bRightCount >= 3
        );
    }

    /**
     * Checks if lastly added disc terminates the tree.
     * @param data state of game
     * @param filledIndex
     * @param idx column index of node.
     */
    isTerminalNode(data, filledIndex, idx) {
        if (filledIndex[idx] === this.rowCount
            || this.isWinningShot(data, this.rowCount - filledIndex[idx], idx)) {
            return true;
        }

        return false;
    }

    /**
     * 
     * @param data
     * @param filledIndex
     * @param val Value of added disc
     * @param idx column index of added disc
     * @param parent pointer to parent node in tree
     * @param isLastLevel boolean to check if current level is 5th.
     */
    putValue(data, filledIndex, val, idx, parent, isLastLevel?) {
        if (filledIndex[idx] < this.rowCount) {
            data[this.rowCount - filledIndex[idx] - 1][idx] = val + 1;
            filledIndex[idx] += 1;

            parent.childs[idx] = new Node(
                JSON.stringify(data),
                [],
                null
            );

            if (this.isTerminalNode(data, filledIndex, idx)
                || isLastLevel ) {
                const player1Score = this.getHeuristicValue(data, filledIndex, 1, idx);
                const player2Score = this.getHeuristicValue(data, filledIndex, 2, idx);

                const heuristicValue = player1Score > player2Score ? -1 * player1Score : player2Score;

                parent.childs[idx].hfValue = heuristicValue;
                parent.childs[idx].isTerminal = true;
            }

            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the heuristic value of node added at column Index.
     * it simply returns the total weight of current node, by counting same color neighbour nodes
     * and multiplying it with its weight.
     *
     * @param gameState
     * @param filledIndex
     * @param newValue
     * @param colIdx
     */
    getHeuristicValue(gameState, filledIndex, newValue, colIdx) {
        const countMap = [0, 0, 0, 0];
        const countWeight = [1, 4, 8, this.maxValue];


        if (filledIndex[colIdx] < this.rowCount) {
            const coords = [this.rowCount - filledIndex[colIdx], colIdx];

            const horCount = this.getCount(gameState, newValue, this.left, this.left(coords)) +
                             this.getCount(gameState, newValue, this.right, this.right(coords));
            countMap[Math.min(horCount, 4)] += 1;

            const bottomCount = this.getCount(gameState, newValue, this.bottom, this.bottom(coords));
            countMap[Math.min(bottomCount, 4)] += 1;

            const bottomLeftCount = this.getCount(gameState, newValue, this.bottomLeft, this.bottomLeft(coords));
            countMap[Math.min(bottomLeftCount, 4)] += 1;

            const bottomRightCount = this.getCount(gameState, newValue, this.bottomRight, this.bottomRight(coords));
            countMap[Math.min(bottomRightCount, 4)] += 1;
        }

        return countMap.reduce((prev, curr, idx, countArr) => prev + curr * countWeight[idx], 0);
    }

    /**
     * Min Max Algorithm to find best route for MAx player.
     *
     * This is basically
     * 1. if present node is terminal node return heuristic value that node.
     * 2. Else if current level is min, find minimum value of all child nodes and return it.
     * 3. Else if current level is max, find maximum value of all child nodes and return it.
     *
     * @param root Root of tree
     * @param isMin Boolean to check if current level belongs to min player.
     */
    normalizeMinMaxTree(root, isMin) {
        if (root.isTerminal) {
            return root.hfValue;
        }

        if (isMin) {
            let min = Number.MAX_SAFE_INTEGER;

            root.childs.forEach(child => {
                min = Math.min(min, this.normalizeMinMaxTree(child, isMin ^ 1));
            });

            root.hfValue = min;
            return min;
        } else {
            let max = Number.MIN_SAFE_INTEGER;

            root.childs.forEach(child => {
                max = Math.max(max, this.normalizeMinMaxTree(child, isMin ^ 1));
            });

            root.hfValue = max;
            return max;
        }
    }

    /**
     * Public method to get best column Index for Max Player.
     */
    getBestcolumn() {
        this.minMaxTree = {
            root: new Node('root', [])
        };

        this.createTree(this.data, this.filledIndex, 1);
        this.normalizeMinMaxTree(this.minMaxTree.root, 0);

        let colIdx = 0;
        let max = -1;

        this.minMaxTree.root.childs.forEach((node, index) => {
            if (node.hfValue > max) {
                colIdx = index;
                max = node.hfValue;
            }
        });

        return colIdx;
    }

}

/**
 * Class for tree node.
 */
class Node {
    data; // No need of this field, for the sake of debugging it is kept.
    hfValue;
    isTerminal;
    childs: Node[];

    constructor(dta, chlds, hValue = 0) {
        this.data = dta;
        this.childs = chlds;
        this.hfValue = hValue;
        this.isTerminal = false;
    }
}
