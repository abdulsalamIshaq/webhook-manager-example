import express, { Request, Response } from 'express';
import { WebhookInterface } from "webhook-manager";


class Paystack implements WebhookInterface {
    path: string = "/paystack";

    validate(req: Request, res: Response): boolean {
        //validate webhook before processing
        return true;
    }
    async process(req: Request, res: Response): Promise<void> {
        //process webhook
    }
}

export default Paystack;