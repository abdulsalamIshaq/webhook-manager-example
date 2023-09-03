import express, { Request, Response } from 'express';
import { WebhookInterface } from "webhook-manager";


class Flutterwave implements WebhookInterface {
    path: string = "/flutterwave";

    validate(req: Request, res: Response): boolean {
        //validate webhook before processing
        return true
    }
    async process(req: Request, res: Response): Promise<void> {
        //process webhook
    }
}

export default Flutterwave;