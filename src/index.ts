import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { WebhookManager } from "@olayanku/webhook-manager";
import {Paystack, Flutterwave} from "./drivers/index";

const app = express();

app.use(bodyParser.json());

const wManager = WebhookManager.initialize();

wManager.driver('paystack', new Paystack);
wManager.driver('flutterwave', new Flutterwave);

const webhookDrivers = wManager.getDrivers();

const start = async (): Promise<void> => { 
    
    app.post('/webhook/:name', async (req: Request, res: Response) => {
        const { name } = req.params;

        if (!wManager.exists(name)) {
            return res.status(400).json({
                message: name + " is not found as a webhook driver"
            });
        }
        
        const webhook = wManager.driver(name);
        try {
            if (webhook.validate(res, req)) {
                await webhook.process(req, res);

                return res.status(200).json({
                    message: "successful"
                });
            }
            return res.status(400).json({
                message: "bad request"
            });
        } catch (error) {
            console.error(`Error processing webhook: ${error}`);
            
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });

};

void start();

