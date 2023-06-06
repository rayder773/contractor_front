import { APP } from "./DOM.js";
import { Router } from "./components/router.js";

const app = new APP();

export enum EVENTS {
  DOMContentLoaded = "DOMContentLoaded",
  newPage = "newPage",
}

app.body(new Router()).listenDOMContentLoaded();

console.log(app);
