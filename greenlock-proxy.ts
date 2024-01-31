import ProxyServer from "http-proxy";
import glx from "greenlock-express";

class GreenProxy {
  maintainerEmail: string;
  rules: { domains: string[]; targets: string[] }[] = [];
  proxy: ProxyServer;
  greenlock;

  constructor(opts: { maintainerEmail: string; staging: boolean }) {
    this.maintainerEmail = opts.maintainerEmail;
    var staging = opts.staging || false;

    var Greenlock = require("@root/greenlock");
    this.greenlock = Greenlock.create({
      packageRoot: __dirname,
      configDir: "greenlock.d",
      maintainerEmail: this.maintainerEmail,
      staging: staging,
    });

    this.greenlock.manager.defaults({
      agreeToTerms: true,
      subscriberEmail: this.maintainerEmail,
    });
  }

  register(domains: string[], targets: string[]) {
    this.rules.push({
      domains: domains,
      targets: targets,
    });
    this.greenlock.add({
      subject: domains[0],
      altnames: domains,
    });
  }

  start() {
    glx
      .init({
        packageRoot: __dirname,
        // contact for security and critical bug notices
        maintainerEmail: this.maintainerEmail,
        // where to look for configuration
        configDir: "greenlock.d",
        // whether or not to run at cloudscale
        cluster: false,
      })
      // Serves on 80 and 443
      // Get's SSL certificates magically!
      .ready(this.httpsWorker.bind(this));
  }

  httpsWorker(glx) {
    this.proxy = ProxyServer.createProxyServer({
      xfwd: true,
      ws: true,
    });
    // catches error events during proxying
    this.proxy.on("error", function (err, req, res) {
      console.error(err);
      res.statusCode = 500;
      res.end();
      return;
    });

    // servers a node app that proxies requests to a localhost
    glx.serveApp(this.serveFcn.bind(this));

    // Handle websocket connections
    glx.httpsServer().on("upgrade", (req, socket, header) => {
      this.rules.forEach((rule) => {
        if (rule.domains.includes(req.headers.host)) {
          let i = Math.floor(Math.random() * rule.targets.length);

          this.proxy.ws(req, socket, header, {
            target: rule.targets[i],
          });
        }
      });
    });
  }

  serveFcn(req, res) {
    this.rules.forEach((rule) => {
      this.bindTarget(req, res, this.proxy, rule.domains, rule.targets);
    });
  }

  bindTarget(req, res, proxy, domains, targets) {
    if (domains.includes(req.headers.host)) {
      let i = Math.floor(Math.random() * targets.length);

      proxy.web(req, res, {
        target: targets[i],
      });
    }
  }
}

export default GreenProxy;
