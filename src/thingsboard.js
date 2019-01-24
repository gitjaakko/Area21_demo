class ThingsboardAPI {
    constructor(url) {
        this.webSocket = null;
        this.url = url;
        this.accessToken = null;
        this.refreshToken = null;
        this.customerId = null;
        this.commandQueue = []
        this.commandId = 0;
        this.subscriptionId = 0;
        this.telemetrySubscriptions = []
    }

    auth(username, password) {
        return new Promise((resolve, reject) => {
            fetch(`https://${this.url}/api/auth/login`, {
                headers: { Accept: 'application/json', 'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then(response => response.json().then(data => {
                if (response.ok === true && response.status === 200) {
                    this.accessToken = data.token;
                    this.refreshToken = data.refreshToken;

                    resolve();
                }
                else {
                    reject(response.status);
                }
            }));
        });
    }

    reauth(refreshToken) {
        return new Promise((resolve, reject) => {
            fetch(`https://${this.url}/api/auth/token`, {
                headers: { Accept: 'application/json', 'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            }).then(response => response.json().then(data => {
                if (response.ok === true && response.status === 200) {
                    this.accessToken = data.token;
                    this.refreshToken = data.refreshToken;

                    resolve();
                }
                else {
                    reject(response.status);
                }
            }));
        });
    }

    createWebSocket() {
        this.webSocket = new WebSocket(`wss://${this.url}/api/ws/plugins/telemetry?token=${this.accessToken}`);
        this.webSocket.onmessage = (data) => this.handleOnMessage(JSON.parse(data.data));
        this.webSocket.onopen =  () => this.sendQueuedCommands();
    }

    getCustomerId() {
        return new Promise((resolve) => {
            if (this.customerId === null) {
                this.makeRequest('/api/auth/user')
                    .then(response => {
                        this.customerId = response.customerId.id;
                        resolve(this.customerId);
                    });
            }
            else {
                resolve(this.customerId);
            }
        });
    }

    getDevices(customerId, limit = 25) {
        return new Promise(resolve => {
            this.makeRequest(`/api/customer/${customerId}/devices?limit=${limit}`)
                .then(response => {
                    resolve(response.data);
                });
        });
    }

    getTelemetry(deviceId, keys, from, to = null) {
        return new Promise(callback => {
            to = to === null ? Date.now() : to.getTime();
            from = from.getTime();

            if (this.webSocket === null) {
                this.createWebSocket();
            }

            let command = {
                tsSubCmds: [],
                attrSubCmds: [],
                historyCmds: [
                    {
                        entityType: 'DEVICE',
                        entityId: deviceId,
                        startTs: from,
                        endTs: to,
                        cmdId: this.commandId++,
                        keys: keys.join(',')
                    }
                ]
            }

            this.telemetrySubscriptions.push(callback);
            this.subscriptionId++;

            if (this.webSocket.readyState == WebSocket.OPEN) {
                this.webSocket.send(JSON.stringify(command));
            }
            else {
                this.commandQueue.push(command)
            }
        });
    }

    handleOnMessage(message) {
        if (message.errorCode === 0) {
            let data = {};
            for (const key of Object.keys(message.data)) {
                let values = []
                for (const item of message.data[key]) {
                    values.push({'time': new Date(item[0]), 'value': item[1]})
                }
                data[key] = values;
            }

            this.telemetrySubscriptions[message.subscriptionId](data);
        }
        else {
            this.telemetrySubscriptions[message.subscriptionId](null, {
                code: message.errorCode,
                message: message.errorMsg
            });
        }
    }

    sendQueuedCommands() {
        let command = null;
        while ((command = this.commandQueue.shift()) != null) {
            this.webSocket.send(JSON.stringify(command));
        }
    }

    startTelemetryFetch(deviceId, callback, interval = 1000) {
        if (this.webSocket === null) {
            this.createWebSocket();
        }

        let command = {
            tsSubCmds: [
                {
                    entityType: 'DEVICE',
                    entityId: deviceId,
                    scope: 'LATEST_TELEMETRY',
                    cmdId: this.commandId++,
                    timeWindow: interval
                }
            ],
            historyCmds: [],
            attrSubCmds: []
        };

        this.telemetrySubscriptions.push(callback);
        this.subscriptionId++;

        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(command));
        }
        else {
            this.commandQueue.push(command)
        }
    }

    makeRequest(url) {
        return new Promise((resolve, reject) => {
            if (this.accessToken === null) {
                reject();
                return;
            }

            fetch(`https://${this.url}${url}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Authorization': `Bearer ${this.accessToken}`
                }
            }).then(response => response.json()
                .then(data => {
                    if (response.ok === true) {
                        resolve(data);
                    }
                    else {
                        if (response.status === 401) {
                            // reauth
                        }
                        else {
                            reject(response.status);
                        }
                    }
                }));
        });
    }
}

export default ThingsboardAPI;
