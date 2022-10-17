import ResponsiveGrid from './responsive-grid.js';
import "./assets/css/style.scss";
import "./assets/css/card.scss";

const cardsPerRow = [5, 4, 3, 2, 1];
new ResponsiveGrid('.container', cardsPerRow);