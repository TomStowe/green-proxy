# Green Proxy
Fully-fledged proxy server with support for HTTPS and websocket (WSS) queries with automatically generated Let's Encrypt SSL certificates

## Features

- Automatically get **free** SSL certificate from Let's Encrypt
- Easily redirect requests for your domain to any internal address (like server on any port)
- Distribute incoming traffic across several servers with built-in balancer
- Websocket support
- Pre-Setup Balancer

Based on [greenlock-express](https://github.com/coolaj86/greenlock-express) and forked from [greenlock-proxy](https://github.com/Roslovets-Inc/greenlock-proxy).

## Dev Setup
If you want to run the green proxy on a development environment, install node, then do the following:
* Copy and rename `config.example.json` to `config.json` and fill in the details there - [See here for `config.json` documentation](#config-json)
* Run `npm i` to install the dependencies
* Run `npm run start` to start the proxy

## Live Setup
When running live, we use [PM2](https://www.npmjs.com/package/pm2) to handle the process running
* Copy and rename `config.example.json` to `config.json` and fill in the details there - [See here for `config.json` documentation](#config-json)
* Run `npm i` to install the dependencies
* Run `npm i -g pm2` to install PM2
* Run `npm run deploy` to deploy the application
* Run `npm run status` to see the status of the deployment
* Run `npm run log` to see any logs
* Run `npm run redeploy` to redeploy if any changes are made to the application or config file
* Run `npm run stop && npm run destroy` to remove the deployment

## Example

```js
const GreenlockProxy = require('green-proxy');

// Configure Let's Encrypt settings to get SSL certificate
var proxy = new GreenlockProxy({
    maintainerEmail: "example@email.com", // your email
    staging: true // true for testing, false for production (only after testing!)
});

// Just bind your domain to internal address - common example
proxy.register(["dev.example.com", "www.dev.example.com"], ["http://localhost:4200"]);

// Optional: bind another domain to another address
proxy.register(["example.com", "www.example.com"], ["http://localhost:80"]);

// Optional: simple random balancer
proxy.register(["balancer.example.com", "www.balancer.example.com"], ["http://localhost:81","http://localhost:82","http://localhost:83"]);

// Start proxiyng
proxy.start();
```
