import express, { Application } from 'express';
import http, { Server } from 'http';

// Using the singleton pattern to export only one instance of expressApp, server and io
class InitApp {
  public expressApp: Application;
  public server: Server;
  // public io: Socket<DefaultEventsMap, DefaultEventsMap>;
  private static App: InitApp;

  // Don't let anyone create a instance of it
  private constructor() {
    // Create the express app, the http server and the socket.io instance
    this.expressApp = express();
    this.server = http.createServer(this.expressApp);
  }

  public static get app(): InitApp {
    if (!this.App) {
      this.App = new InitApp();
    }
    return this.App;
  }
}

export default InitApp;
