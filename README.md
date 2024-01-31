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
* Copy and rename `config.example.json` to `config.json` and fill in the details there - [See here for `config.json` documentation](#config-documentation)
* Run `npm i` to install the dependencies
* Run `npm run start` to start the proxy

## Live Setup
When running live, we use [PM2](https://www.npmjs.com/package/pm2) to handle the process running
* Copy and rename `config.example.json` to `config.json` and fill in the details there - [See here for `config.json` documentation](#config-documentation)
* Run `npm i` to install the dependencies
* Run `npm i -g pm2` to install PM2
* Run `npm run deploy` to deploy the application
* Run `npm run status` to see the status of the deployment
* Run `npm run log` to see any logs
* Run `npm run redeploy` to redeploy if any changes are made to the application or config file
* Run `npm run stop && npm run destroy` to remove the deployment

## Config Documentation
See below for a list of valid attributes to include in the `config.json` file
* `maintainerEmail` (required): The email address to send to Let's Encrypt for maintanence purposes - must be valid
* `staging` (required): True if you want to test this application, false if you'd like to generate real certificates
* `sites` (required): An array of the proxies that you want to create - objects inside this array must include:
  * `domains` (required): List of domains to proxy for (ignoring protocol)
  * `targets` (required): List of locations to proxy to
