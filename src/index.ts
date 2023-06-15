import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { WebhookManager } from "webhook-manager";
import {Paystack, Flutterwave} from "./drivers/index";

const wManager = WebhookManager.initialize();

wManager.driver('paystack', new Paystack);
wManager.driver('Fluttaystack', new Flutterwave);

const webhookDrivers = wManager.getDrivers();



const app = express();

app.use(bodyParser.json());

const start = async (): Promise<void> => {
    const PORT = process.env.PORT || 3000;

    Object.keys(webhookDrivers).forEach((key) => {
        const webhook = webhookDrivers[key]; 

        app.post(webhook.path, async (req: Request, res: Response) => {
            try {
                if (webhook.validate(res, req)) {
                    return await webhook.process(req, res);
                }
                res.json({
                    message: "bad request"
                }).sendStatus(400);
            } catch (error) {
                console.error(`Error processing webhook: ${error}`);
                res.sendStatus(500);
            }
        });
    });


    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });

};

void start();

// interface Webhook {
//     path: string;
//     handler: (payload: any) => Promise<void>;
// }

// class WebhookLibrary {
//     private app: express.Application;
//     private webhooks: Webhook[];

//     constructor() {
//         this.app = express();
//         this.app.use(bodyParser.json());
//         this.webhooks = [];
//     }

//     public addWebhook(path: string, handler: (payload: any) => Promise<void>): void {
//         this.webhooks.push({ path, handler });
//     }

//     public start(port: number): void {
       

//         this.app.listen(port, () => {
//             console.log(`Webhook server started on port ${port}`);
//         });
//     }
// }

