import { APP } from "./DOM.js";
import { Carousel } from "./components/carousel.js";
import { Router } from "./components/router.js";

const carousel = new Carousel().appendToBody();

console.log(carousel);
