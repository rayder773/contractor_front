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
    child.setRoot(this.getRoot() || this);
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

  protected recursivelySetRoot() {
    const children = this.getChildren() as Parent[];

    children.forEach((c: Parent) => {
      c.setRoot(this.getRoot() || this);

      c.recursivelySetRoot();
    });
  }

  start() {
    this.recursivelySetRoot();

    return this;
  }
}

type ControllerName = string;
type ControllerEventName = string;
export class Controller extends Parent {
  private director: {
    [key: ControllerName]: {
      [key: ControllerEventName]: Array<(data: unknown) => void>;
    };
  } = {};

  constructor() {
    super();
  }

  public getDirector() {
    return this.director;
  }

  protected init(...args: unknown[]) {
    const name = this.getName();

    if (name) {
      this.emit([name, "init"], ...args);
    }

    const children = this.getChildren() as Controller[];

    children.forEach((c: Controller) => {
      c.init();
    });
  }

  override recursivelySetRoot() {
    super.recursivelySetRoot();

    if (Object.keys(this.director).length && this.getRoot()) {
      Object.assign(
        (this.getRoot() as Controller).getDirector(),
        this.director
      );
    }
  }

  override start() {
    super.start();

    this.init();

    return this;
  }

  public emit(path: [string, string], data?: unknown) {
    const root = this.getRoot() as Controller;

    if (!root) {
      throw new Error("Root is not defined");
    }

    const [controllerName, eventName] = path;

    if (root.director[controllerName]) {
      const callbacks = root.director[controllerName][eventName];

      if (callbacks) {
        callbacks.forEach((callback) => callback(data));
      }
    }

    return this;
  }

  public create() {}

  public subscribeTo(
    controllerName: string,
    callbacks: {
      add?: (data: unknown) => void;
      remove?: (data: unknown) => void;
      init?: (data: unknown) => void;
      click?: (data: unknown) => void;
    }
  ) {
    for (let callbackName in callbacks) {
      if (!this.director[controllerName]) {
        this.director[controllerName] = {};
      }

      if (!this.director[controllerName][callbackName]) {
        this.director[controllerName][callbackName] = [];
      }

      this.director[controllerName][callbackName].push(
        callbacks[callbackName as keyof typeof callbacks]!
      );
    }

    return this;
  }
}
