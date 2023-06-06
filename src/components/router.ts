import { DIV } from "../DOM.js";
import { ObjectModel } from "../data.js";
import { EVENTS } from "../main.js";

export class Router extends DIV {
  model = new ObjectModel({});

  constructor() {
    super();

    this.setName("routerContainer")
      .on(EVENTS.newPage, this.onNewPage.bind(this))
      .setModel(
        new ObjectModel({
          activePage: {
            value: "",
            allowedValues: ["a", "b", "c"],
            onChange: EVENTS.newPage,
          },
        })
          .setName("main")
          .on(EVENTS.DOMContentLoaded, this.onDOMContentLoaded.bind(this))
      );
  }

  onDOMContentLoaded() {
    this.model.change("activePage", "a");
  }

  onNewPage() {
    this.append(new DIV().text("ffff"));
  }
}
