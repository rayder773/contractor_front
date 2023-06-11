import { BUTTON, DIV, UL } from "../DOM.js";
import { ArrayModel } from "../data.js";

export class Carousel extends DIV {
  constructor() {
    super();

    this.events = {
      nextCarouselItem: "nextCarouselItem",
      prevCarouselItem: "prevCarouselItem",
      changeActiveCarouselItem: "changeActiveCarouselItem",
      carouselModelInitialized: "carouselModelInitialized",
    };

    this.setName("carousel")
      .append(
        new BUTTON().text("<").onClick(this.events.prevCarouselItem),
        new UL()
          .addChild(
            new ArrayModel([1, 2, 3])
              .setModelEvents({
                onInit: this.events.carouselModelInitialized,
                onChangeActiveItem: this.events.changeActiveCarouselItem,
              })
              .on(this.events.nextCarouselItem, function (data) {
                console.log(data);
              })
              .on(this.events.prevCarouselItem, function (data) {})
          )
          .on(this.events.carouselModelInitialized, function (data) {
            console.log(1111);
          })
          .on(this.events.changeActiveCarouselItem, function (data) {}),
        new BUTTON().text(">").onClick(this.events.nextCarouselItem)
      )
      .start();
  }
}
