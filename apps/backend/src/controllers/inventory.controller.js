import * as inventoryService from "../services/inventory.service.js";
import { EVENTS, createLogSignal } from "@inventory/shared";

export const getItems = async (req, res) => {
    try {
        const items = await inventoryService.getAllItems();
        res.status(200).json(items);
    } catch (error) {
        console.error(createLogSignal(EVENTS.REQUEST_ERROR, { error: error.message }));
        res.status(500).json({ error: "Failed to fetch inventory items" });
    }
};

export const createItem = async (req, res) => {
    try {
        const item = await inventoryService.createItem(req.body);
        console.log(createLogSignal(EVENTS.REQUEST_SUCCESS, { action: "CREATE_ITEM", id: item.id }));
        res.status(201).json(item);
    } catch (error) {
        console.error(createLogSignal(EVENTS.REQUEST_ERROR, { error: error.message }));
        res.status(400).json({ error: error.message });
    }
};

export const getItem = async (req, res) => {
    try {
        const item = await inventoryService.getItemById(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateItem = async (req, res) => {
    try {
        const item = await inventoryService.updateItem(req.params.id, req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await inventoryService.deleteItem(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
