import { Request, Response } from 'express';
import { Model } from 'mongoose';

// BaseController for basic CRUD operations can be extended\overwritten by specific controllers
class BaseController<T> {
    model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    getAll = async (req: Request, res: Response) => {
        const filter = req.query;
        try {
            const data = await this.model.find(filter);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
        }
    };

    getById = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const data = await this.model.findById(id);
            if (!data) {
                return res.status(404).json({ message: "Resource not found" });
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
        }
    };

    // For many controllers this might need to be overwritten to add specific logic
    // such as data verification, hashing passwords, etc to the given body.
    create = async (req: Request, res: Response) => {
        const body = req.body;
        try {
            const data = await this.model.create(body);
            return res.status(201).json(data);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
        }
    };

    // For many controllers this might need to be overwritten to add specific logic
    // such as data verification, hashing passwords, etc to the given body.
    update = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;
        try {
            const data = await this.model.findByIdAndUpdate(id, body, { new: true });
            if (!data) {
                return res.status(404).json({ message: "Resource not found" });
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
        }
    };

    delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const data = await this.model.findByIdAndDelete(id);
            if (!data) {
                return res.status(404).json({ message: "Resource not found" });
            }
            return res.status(200).json({ message: "Deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
        }
    };
}

export default BaseController;