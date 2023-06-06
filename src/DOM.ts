import { Controllable, Controller } from "./core.js";
import { Model } from "./data";

type optionsType = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

export class DOMElement extends Controllable {
  private events: string[][] = [];
  model?: Model;

  constructor(protected element: HTMLElement = document.createElement("div")) {
    super();
  }

  public prepend(parent: HTMLElement = document.body) {
    parent.prepend(this.element);

    this.onRender();

    return this;
  }

  public render(parent: HTMLElement = document.body) {
    parent.append(this.element);

    this.onRender();

    return this;
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

    this.events.push([event, emitEvent]);

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
    this.events.forEach(([event, emitEvent]) => {
      this.element.removeEventListener(
        event,
        this.emitEvent.bind(this, { emitEvent })
      );
    });

    return this;
  }

  public setAttribute(name: string, value: string) {
    this.element.setAttribute(name, value);

    return this;
  }

  setModel(model: Model) {
    this.model = model;

    this.addChild(model);

    return this;
  }
}

export class APP extends Controller {
  constructor() {
    super();

    this.setController(this);
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
  constructor(protected element: HTMLElement = document.createElement("div")) {
    super();
  }

  text(text: string) {
    this.element.textContent = text;

    return this;
  }

  append(...children: DOMElement[]) {
    this.element.append(
      ...children.map((item) => {
        this.controller!.addChild(item);

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
  private itemInnerFn: ((data: unknown) => DOMElement) | null = null;

  constructor(protected element = document.createElement("ul")) {
    super(element);
  }

  prependItem() {}

  appendItem(data: unknown) {
    const li = new LI();

    if (typeof this.itemInnerFn === "function") {
      li.append(this.itemInnerFn(data));
    }

    this.append(li);

    return this;
  }

  public setItemInner(fn: (data: unknown) => DOMElement) {
    this.itemInnerFn = fn;

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
