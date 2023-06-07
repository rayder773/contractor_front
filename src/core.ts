export class Child {
  private parent: Parent | null = null;
  private root: Parent | null = null;
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

  setRoot(root: Parent) {
    this.root = root;

    return this;
  }

  getRoot() {
    return this.root;
  }
}

export class Parent extends Child {
  private children: Child[] = [];

  addChild(child: Child) {
    child.setParent(this);
    this.children.push(child);

    return this;
  }

  removeChild(child: Child) {
    this.children = this.children.filter((item) => item !== child);

    return this;
  }

  getChildren() {
    return this.children;
  }

  recursivelySetRoot() {
    const children = this.getChildren() as Parent[];

    children.forEach((c: Parent) => {
      c.setRoot(this.getRoot() || this);
      c.recursivelySetRoot();
    });
  }
}

export class Controller extends Parent {
  controllerEvents: {
    [key: string]: Array<
      [callback: (data: Controller) => void, controllable: Controller]
    >;
  } = {};

  entities: {
    [key: string]: {
      [key: string]: (data: Controller) => void;
    };
  } = {};

  events: { [key: string]: string } = {};

  childrenByName: { [key: string]: Child } = {};

  constructor() {
    super();
  }

  on(event: string, callback: (instance: Controller) => void) {
    return this;
  }

  emit(eventName: string, data: unknown) {}
}
