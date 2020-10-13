import { resolve } from "path";
import { generateId, writeJSONFile } from "../helpers/helper";
import { IBudget } from "../interfaces";

const fileBudget = __dirname + '/../data/budget.json';
const budgetData = require(fileBudget);

const getBudgetsByDate = (startDate: string, endDate: string, userId: string) => {
    return new Promise((resolve, reject) => {
        if (!budgetData[userId]) {
            reject({
                message: `the budget is not found`,
                status: 400
            })
        }

        // resolve(budgetData[userId][budgetId])
    })
}

const getBudgetById = (budgetId: string, userId: string) => {
    return new Promise((resolve, reject) => {
        if (!budgetData[userId] || !budgetData[userId][budgetId]) {
            reject({
                message: `budget ${budgetId} is not found`,
                status: 400
            })
        }

        resolve(budgetData[userId][budgetId])
    })
}

const postBudget = (budget: IBudget, userId: string) => {
    return new Promise((resolve, reject) => {
        let id = generateId();

        while (Object.keys(budgetData[userId]).some((budgetId) => budgetId === id)) {
            id = generateId();
        }

        try {
            writeJSONFile(fileBudget, {
                ...budgetData, [userId]: {
                    ...budgetData[userId], [id]: budget
                }
            })

            resolve()
        } catch (e) {
            reject({
                message: 'failed to create budget',
                status: 400
            })
        }
    })
}

const updateBudget = (budget: IBudget, budgetId: string, userId: string) => {
    return new Promise((resolve, reject) => {
        if (!budgetData[userId] || !budgetData[userId][budgetId]) {
            reject({
                message: `failed to update budget ${budgetId}`,
                status: 400
            })
        } else {
            try {
                writeJSONFile(fileBudget, {
                    ...budgetData, [userId]: {
                        ...budgetData[userId], [budgetId]: budget
                    }
                })

                resolve()
            } catch (e) {
                reject({
                    message: `failed to update budget ${budgetId}`,
                    status: 400
                })
            }
        }
    })
}

const deleteBudget = (id: string, userId: string) => {
    return new Promise((resolve, reject) => {
        if (!budgetData[userId][id]) {
            reject({
                message: `budget ${id} is not found`,
                status: 404
            })
        }

        resolve()
    });
}

export default {
    getBudgetById,
    getBudgetsByDate,
    postBudget,
    updateBudget,
    deleteBudget
}