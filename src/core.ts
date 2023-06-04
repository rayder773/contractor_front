export class Child {
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
}

export class Controllable extends Parent {
  controller: Controller | null = null;
  waitForController: Array<[string, (instance: Controllable) => void]> = [];

  setController(controller: Controller) {
    this.controller = controller;

    this.waitForController.forEach((...args) => {
      this.controller?.setControllerEvent(...args[0], this);
    });

    this.waitForController = [];

    return this;
  }

  emit(event: string, data: unknown) {
    this.controller?.controllerEvents?.[event]?.forEach(
      ([callback, controllable]) => {
        callback(controllable as Controllable);
      }
    );

    return this;
  }

  on(event: string, callback: (instance: Controllable) => void) {
    this.waitForController.push([event, callback]);

    return this;
  }
}

export class Controller extends Controllable {
  controllerEvents: {
    [key: string]: Array<
      [callback: (data: Controllable) => void, controllable: Controllable]
    >;
  } = {};

  entities: {
    [key: string]: {
      [key: string]: (data: Controllable) => void;
    };
  } = {};

  constructor() {
    super();
  }

  recursivelySetController(child: Controllable) {
    if (this.controller) {
      const children = child.getChildren() as Controllable[];

      children.forEach((c: Controllable) => {
        c.setController(this.controller!);
        this.recursivelySetController(c);
      });
    }
  }

  override addChild(child: Controllable) {
    super.addChild(child);

    child.setController(this.controller!);

    this.recursivelySetController(child);

    return this;
  }

  setControllerEvent(
    eventName: string,
    callback: (data: Controllable) => void,
    controllable: Controllable
  ) {
    const entityName = controllable.getName();

    if (!this.entities[entityName]) {
      this.entities[entityName] = {};
    }

    this.entities[entityName][eventName] = callback;

    if (!this.controllerEvents[eventName]) {
      this.controllerEvents[eventName] = [];
    }

    this.controllerEvents[eventName].push([callback, controllable]);

    return this;
  }
}
