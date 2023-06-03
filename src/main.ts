class Child {
  private parent: Parent | null = null;
  private name: string = "";

  setName(name: string) {
    this.name = name;

    return this;
  }

  getName() {
    return this.name;
  }

  setParent(parent: Parent) {
    this.parent = parent;

    return this;
  }

  getParent() {
    return this.parent;
  }
}

class Parent extends Child {
  private children: Child[] = [];

  addChildren(children: Child | Child[]) {
    if (!Array.isArray(children)) {
      children = [children];
    }

    children.forEach((child) => {
      child.setParent(this);
      this.children.push(child);
    });

    return this;
  }

  removeChild(child: Child) {
    this.children = this.children.filter((item) => item !== child);

    return this;
  }

  getChildren() {
    return this.children;
  }
}

class Controllable extends Parent {
  controller: Controller | null = null;

  setController(controller: Controller) {
    this.controller = controller;

    return this;
  }

  emit(event: string, data: unknown) {
    this.controller?.onEvent()?.[event]?.(data);

    return this;
  }
}

class Model extends Controllable {}

type arrayModelType = unknown[];

class ArrayModel extends Model {
  constructor(
    private items: arrayModelType,
    private onPushEvent: string = "push",
    private onPopEvent: string = "pop",
    private onRemoveEvent: string = "remove"
  ) {
    super();
  }

  push(item: unknown) {
    this.items.push(item);

    this.emit(this.onPushEvent, item);

    return this;
  }

  pop(item: unknown) {
    this.items.pop();

    this.emit(this.onPopEvent, item);

    return this;
  }

  get length() {
    return this.items.length;
  }

  get(index: number) {
    return this.items[index];
  }

  set(index: number, item: unknown) {
    this.items[index] = item;
  }

  remove(index: number) {
    this.items.splice(index, 1);

    this.emit(this.onRemoveEvent, index);

    return this;
  }

  insert(index: number, item: unknown) {
    this.items.splice(index, 0, item);
  }
}

class ObjectModel extends Model {
  constructor(private data: { [key: string]: unknown }) {
    super();
    this.setData(data);
  }

  setData(data: { [key: string]: unknown }) {
    this.data = data;
  }

  get(key: string) {
    return this.data[key];
  }

  set(key: string, value: unknown) {
    this.data[key] = value;
  }

  remove(key: string) {
    delete this.data[key];
  }
}

//DOM Elements

type optionsType = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

class DOMElement extends Controllable {
  private events: string[][] = [];

  constructor(protected element: HTMLElement = document.createElement("div")) {
    super();
  }

  public prepend(parent: HTMLElement = document.body) {
    parent.prepend(this.element);

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
}

class DOCUMENT extends DOMElement {
  constructor() {
    super();
  }

  onLoad() {
    return this;
  }
}

class ContainerElement extends DOMElement {
  constructor(protected element: HTMLElement = document.createElement("div")) {
    super();
  }

  text(text: string) {
    this.element.textContent = text;

    return this;
  }

  recursivelySetController(children: DOMElement[]) {
    if (this.controller) {
      children.forEach((child: DOMElement) => {
        child.setController(this.controller!);

        this.recursivelySetController(child.getChildren() as DOMElement[]);
      });
    }
  }

  append(...children: DOMElement[]) {
    this.element.append(
      ...children.map((item) => {
        return item.getElement();
      })
    );

    this.recursivelySetController(children);

    this.addChildren(children);

    return this;
  }
}

class LI extends ContainerElement {
  constructor(protected element: HTMLElement = document.createElement("li")) {
    super(element);
  }
}

class UL extends ContainerElement {
  constructor(protected element: HTMLElement = document.createElement("ul")) {
    super(element);
  }
}

class DIV extends ContainerElement {
  constructor(protected element: HTMLElement = document.createElement("div")) {
    super(element);
  }
}

class BUTTON extends ContainerElement {
  constructor(
    protected element: HTMLElement = document.createElement("button")
  ) {
    super(element);
  }
}

class List extends UL {
  constructor() {
    super();
  }

  protected createItem(data: unknown): DOMElement {
    const item = new LI();

    item.text(data as string);

    return item;
  }

  private addListItemProps(item: DOMElement): DOMElement {
    item.setAttribute("role", "listitem");

    return item;
  }

  public addItem(data: unknown) {
    const item = this.addListItemProps(this.createItem(data));

    this.append(item);

    return this;
  }

  removeItemByIndex(index: number) {
    this.element.children[index].remove();

    return this;
  }
}

//DOM Elements

class Controller extends Controllable {
  constructor() {
    super();
  }

  onEvent(): { [key: string]: (data: unknown) => void } {
    return {};
  }
}

class DOMElementModel extends Controller {
  constructor(protected domElement: DOMElement, protected model: Model) {
    super();

    this.domElement.setController(this);
    this.model.setController(this);
  }

  prependDomElement() {
    this.domElement.prepend();
  }
}

class ListElementModel extends DOMElementModel {
  constructor(protected listElement: List, protected model: ArrayModel) {
    super(listElement, model);
  }

  addItem(data: unknown) {
    this.model.push(data);

    return this;
  }

  onEvent() {
    return {
      push: (data: unknown) => {
        this.listElement.addItem(data);
      },
      remove: (index: unknown) => {
        this.listElement.removeItemByIndex(index as number);
      },
      checkItem: (event: unknown) => {
        console.log("checkItem");
      },
      removeItem: (event: unknown) => {
        console.log("removeItem");
      },
    };
  }
}

class CustomeListElement extends List {
  createItem(data: unknown): DOMElement {
    const item = new LI()
      .append(
        new DIV().append(
          new DIV().text(data as string),
          new BUTTON()
            .text("X")
            .addEventListener("click", "removeItem", { stopPropagation: true })
        )
      )
      .addEventListener("click", "checkItem");

    return item;
  }
}

class CustomeListElementModel extends ListElementModel {
  constructor() {
    super(new CustomeListElement(), new ArrayModel([]));
  }
}

const add = document.getElementById("add")!;

const list = new CustomeListElementModel();

add.addEventListener("click", () => {
  list.addItem("item");
});

list.prependDomElement();
