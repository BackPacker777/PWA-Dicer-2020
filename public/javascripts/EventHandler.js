"use strict";

/**
 * @module EventHandler
 */

/**
 * @desc Class that handles all DOM events. Performs all fetch operations
 */
export default class EventHandler {
    #dieType;
    #dieQty;

    /**
     * @desc Starts select event listeners
     */
    constructor() {
        this.setDieQty();
        this.setDieType();
        this.handleDiceRoll();
    }

    /**
     * @desc Mutator for #dieQty
     */
    setDieQty() {
        this.#dieQty = 0;
        document.getElementById('slider').addEventListener('input', () => {
            document.getElementById('dieQty').innerText = document.getElementById('slider').value;
            this.#dieQty = document.getElementById('slider').value;
        });
    }

    /**
     * @desc Mutator for #dieType
     */
    setDieType() {
        this.#dieType = 0;
        const dieTypes = document.forms["rollResults"].elements["dieType"];
        for (let i = 0; i < dieTypes.length; i++) {
            dieTypes[i].addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                this.#dieType = dieTypes[i].value;
            });
        }
    }

    /**
     * @desc Worker method to roll dice
     */
    handleDiceRoll() {
        document.getElementById('rollButton').addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            let finalResult = 0;
            let individuals = '';
            let results = [];
            for (let i = 0; i < this.#dieQty; i++) {
                results[i] = Math.floor((Math.random() * this.#dieType) + 1);
                finalResult += Number(results[i]);
                if (i < this.#dieQty - 1) {
                    individuals += results[i] + ', ';
                } else {
                    individuals += results[i];
                }
            }
            document.getElementById('results').innerText = individuals;
            document.getElementById('totalResult').innerText = String(finalResult);
        });
    }
}