import { getClient, initializeClient, startTracking, stopTracking, getStatus } from './client';
import qrcode from 'qrcode';

export class WhatsAppService {
    static async connect(): Promise<string | null> {
        const client = getClient();

        return new Promise((resolve, reject) => {
            client.on('qr', async (qr) => {
                try {
                    const qrCodeDataURL = await qrcode.toDataURL(qr);
                    resolve(qrCodeDataURL);
                } catch (error) {
                    reject(error);
                }
            });

            client.on('ready', () => {
                resolve(null); // Already connected
            });

            client.on('auth_failure', (msg) => {
                reject(new Error(`Authentication failed: ${msg}`));
            });

            initializeClient().catch(reject);
        });
    }

    static async startTracking(intervalMinutes: number = 15) {
        await startTracking(intervalMinutes);
    }

    static stopTracking() {
        stopTracking();
    }

    static getStatus() {
        return getStatus();
    }
}