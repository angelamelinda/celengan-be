import { generateId, writeJSONFile } from "../helpers/helper";
import { IBudget } from "../interfaces";

const fileBudget = __dirname + '/../data/budgets.json';
const budgetData = require(fileBudget);

const getBudgetsByDate = (startDate: string, endDate: string, userId: string) => {
    return new Promise((resolve, reject) => {
        if (!budgetData[userId] && !startDate && !endDate) {
            reject({
                message: `the budget is not found`,
                status: 400
            })
        }

        console.log(startDate, endDate, userId);

        const budgetList = Object.keys(budgetData[userId]).map((budgetId) => {
            console.log(budgetId, budgetData[userId], budgetData[userId][budgetId]);
            const x = budgetData[userId] && budgetData[userId][budgetId] && budgetData[userId][budgetId].map((budgetList: IBudget) => budgetList.start_date === startDate && budgetList.end_date === endDate)
            console.log(x);
            return x;
        })


        resolve(budgetList)
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
        console.log('here', budgetData && budgetData[userId] && Object.keys(budgetData[userId]));
        while (budgetData && budgetData[userId] && Object.keys(budgetData[userId]).some((budgetId) => {
            console.log(budgetId);
            return budgetId === id
        })) {
            id = generateId();
        }
        console.log('BUDGET', budget)
        try {
            writeJSONFile(fileBudget, {
                ...budgetData, [userId]: {
                    ...budgetData[userId], [id]: budget
                }
            })

            resolve()
        } catch (e) {
            console.log(e);
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

const deleteBudget = (budgetId: string, userId: string) => {
    return new Promise((resolve, reject) => {
        if (!budgetData[userId][budgetId]) {
            reject({
                message: `budget ${budgetId} is not found`,
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