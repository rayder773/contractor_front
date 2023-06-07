import { Child, Controller } from "./core.js";
import { Model } from "./data";

type optionsType = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

export class DOMElement extends Controller {
  childrenByName: { [key: string]: DOMElement } = {};

  constructor(protected element: HTMLElement = document.createElement("div")) {
    super();
  }

  public getElement() {
    return this.element;
  }

  public addEventListener(
    event: string,
    emitEvent: string,
    options?: optionsType
  ) {
    this.element.addEventListener(
      event,
      this.emitEvent.bind(this, { emitEvent, options })
    );

    // this.events.push([event, emitEvent]);

    return this;
  }

  public onClick(name: string, options?: optionsType) {
    this.addEventListener("click", name, options);

    return this;
  }

  private emitEvent(
    {
      emitEvent,
      options,
    }: {
      emitEvent: string;
      options?: optionsType;
    },
    e: Event
  ) {
    if (options) {
      const { preventDefault, stopPropagation } = options;

      if (preventDefault) {
        e.preventDefault();
      }

      if (stopPropagation) {
        e.stopPropagation();
      }
    }

    return this.emit(emitEvent, e);
  }

  onRender() {
    return this;
  }

  remove() {
    this.element.remove();

    this.onRemove();

    return this;
  }

  onRemove() {
    // this.events.forEach(([event, emitEvent]) => {
    //   this.element.removeEventListener(
    //     event,
    //     this.emitEvent.bind(this, { emitEvent })
    //   );
    // });
    // return this;
  }

  appendToBody() {
    document.body.append(this.element);

    return this;
  }

  public setAttribute(name: string, value: string) {
    this.element.setAttribute(name, value);

    return this;
  }
}

export class APP extends Controller {
  constructor() {
    super();
  }

  listenDOMContentLoaded() {
    document.addEventListener(
      "DOMContentLoaded",
      this.emit.bind(this, "DOMContentLoaded")
    );

    return this;
  }

  listenHashChange() {
    window.addEventListener("hashchange", this.emit.bind(this, "hashchange"));

    return this;
  }

  body(element: DOMElement) {
    document.body.append(element.getElement());

    this.addChild(element);

    return this;
  }
}

export class ContainerElement extends DOMElement {
  // childrenByName: { [key: string]: DOMElement | Model };

  constructor(protected element: HTMLElement = document.createElement("div")) {
    super();
  }

  text(text: string) {
    this.element.textContent = text;

    return this;
  }

  append(...children: DOMElement[]) {
    // debugger;
    this.element.append(
      ...children.map((item) => {
        this.addChild(item);
        // item.setRoot(this.getRoot()!);

        return item.getElement();
      })
    );

    return this;
  }
}

export class LI extends ContainerElement {
  constructor(protected element = document.createElement("li")) {
    super(element);
  }
}

export class UL extends ContainerElement {
  constructor(protected element = document.createElement("ul")) {
    super(element);
  }

  prependItem() {}

  appendItem(element: DOMElement) {
    const li = new LI().append(element);

    this.append(li);

    return this;
  }
}

export class DIV extends ContainerElement {
  constructor(protected element = document.createElement("div")) {
    super(element);
  }
}

export class BUTTON extends ContainerElement {
  constructor(protected element = document.createElement("button")) {
    super(element);
  }
}
