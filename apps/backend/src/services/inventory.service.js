import prisma from "../db/prisma.js";

export const getAllItems = async () => {
    return await prisma.inventoryItem.findMany();
};

export const getItemById = async (id) => {
    return await prisma.inventoryItem.findUnique({
        where: { id }
    });
};

export const createItem = async (data) => {
    return await prisma.inventoryItem.create({
        data
    });
};

export const updateItem = async (id, data) => {
    return await prisma.inventoryItem.update({
        where: { id },
        data
    });
};

export const deleteItem = async (id) => {
    return await prisma.inventoryItem.delete({
        where: { id }
    });
};
