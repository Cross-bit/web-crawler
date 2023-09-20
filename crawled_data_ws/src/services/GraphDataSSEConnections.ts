


import { Request, Response } from 'express';
import { EventEmitter } from 'events';

class GraphDataSSEConnections {
    private clients: Response[];

    constructor() {
        this.clients = [];
    }

    addClient(clientResponse: Response) {
        this.clients.push(clientResponse);

        clientResponse.on('close', () => {
            console.log("Client closed");
            this.removeClient(clientResponse);
        });
    }

    removeClient(clientResponse: Response) {
        const index = this.clients.indexOf(clientResponse);
        if (index !== -1) {
            this.clients.splice(index, 1);
        }
    }

    sendDataToClients(data: any) {
        this.clients.forEach(client => {
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    }
}

export default new GraphDataSSEConnections();