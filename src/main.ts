import { BUTTON, DIV } from "./DOM.js";
import { List } from "./components/list.js";

const app = new DIV()
  .append(
    new BUTTON().text("add item").setName("addButton").onClick(),
    new List()
      .setData([1, 2, 3])
      .setNewItemFn((data) => {
        return new DIV().text(data as string).append(new BUTTON().text("x"));
      })
      .getArrayModel((model) => {
        model.subscribeTo("addButton", {
          click: function () {
            model.push(model.getItemsLength() + 1);
          },
        });
      })
      .create()
  )
  .start()
  .appendToBody();

console.log("main", app);
