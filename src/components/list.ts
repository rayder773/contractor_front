import { BUTTON, DIV, DOMElement, UL } from "../DOM.js";
import { ArrayModel } from "../data.js";

export class List extends UL {
  private data: unknown[] = [];
  private modelName: string = "listModel";
  private arrayModel = new ArrayModel(this.data);
  private newItemFn: (data: unknown) => DOMElement = (data: unknown) => {
    return new DIV().text(data as string);
  };

  constructor() {
    super();
    this.setName("listElement");
  }

  public getArrayModel(callback: (model: ArrayModel) => void) {
    callback(this.arrayModel);
    return this;
  }

  public setData(data: unknown[]) {
    this.data = data;

    return this;
  }

  public setModelName(name: string) {
    this.modelName = name;

    return this;
  }

  public setNewItemFn(fn: (data: unknown) => DOMElement) {
    if (typeof fn !== "function") {
      throw new Error("fn is not a function");
    }

    this.newItemFn = fn;

    return this;
  }

  create() {
    this.addChild(
      this.arrayModel.setItems(this.data).setName(this.modelName)
    ).subscribeTo(this.modelName, {
      add: function (data: unknown) {
        (this as UL).appendItem(this.newItemFn(data));
      }.bind(this),
      init: function (data: unknown) {
        (data as unknown[]).forEach((item) => {
          (this as UL).appendItem(this.newItemFn(item));
        });
      }.bind(this),
    });

    return this;
  }
}
