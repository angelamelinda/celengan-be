import { generateId, writeJSONFile } from "../helpers/helper";
import { ICategory } from "../interfaces";

const fileCategory = __dirname + '/../data/category.json';
const categoryData = require(fileCategory);

const getCategories = (userId: string, type: string) => {
    return new Promise((resolve, _) => {
        const data = categoryData[type].filter((category: ICategory) => category.created_by === "default" || category.created_by === userId).map((category: ICategory) => {
            const { id, name } = category;
            return {
                id,
                name
            }
        })

        resolve(data);
    });
}

const getCategory = (id: string, userId: string, type: string) => {
    return new Promise((resolve, reject) => {
        const data = categoryData[type].filter((category: ICategory) => category.id === id && (category.created_by === userId || category.created_by === "default")).map((category: ICategory) => {
            const { id, name } = category;
            return {
                id,
                name
            }
        })

        if (data.length > 0) {
            resolve(data[0]);
        }

        reject({
            message: 'category is not found',
            status: 404
        })
    });
}

const postCategory = (name: string, userId: string, type: string) => {
    return new Promise((resolve, reject) => {
        let id = generateId();

        while (categoryData && categoryData[type] && categoryData[type].some((category: ICategory) => category.id === id)) {
            id = generateId();
        }

        try {
            writeJSONFile(fileCategory, {
                ...categoryData, [type]: [...categoryData[type], {
                    id,
                    created_by: userId,
                    name
                }]
            })

            resolve()
        } catch (e) {
            reject({
                message: 'failed to create category',
                status: 400
            })
        }
    })
}

export default {
    postCategory,
    getCategories,
    getCategory
}