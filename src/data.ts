import { Controller } from "./core.js";

export class Model extends Controller {
  modelEvents: { [key: string]: Array<[(data: unknown) => void, unknown]> } =
    {};

  setModelEvents(events: { [key: string]: string }) {
    return this;
  }
}

type arrayModelType = unknown[];

export class ArrayModel extends Model {
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

interface propsType {
  [key: string]: {
    value: unknown;
    onChange?: string;
    onSet?: string;
    allowedValues?: unknown[];
  };
}

export class ObjectModel extends Model {
  private data: { [key: string]: unknown } = {};

  constructor(private props: propsType) {
    super();

    this.initProps();
  }

  initProps() {
    for (let propName in this.props) {
      this.set(propName, this.props[propName].value);
    }
  }

  private do(key: string, value: unknown, eventName: "onSet" | "onChange") {
    if (value && !this.props[key].allowedValues?.includes(value)) {
      throw new Error(
        `Value ${value} is not allowed for property ${key}. Allowed values are ${this.props[key].allowedValues}`
      );
    }

    this.data[key] = value;

    if (this.props[key][eventName]) {
      this.emit(this.props[key][eventName] as string, value);
    }
  }

  set(key: string, value: unknown) {
    this.do(key, value, "onSet");

    return this;
  }

  change(key: string, value: unknown) {
    this.do(key, value, "onChange");

    return this;
  }
}
