const appleImage = new URL("../assets/Apple.png", import.meta.url).href;
const bananaImage = new URL("../assets/Banana.png", import.meta.url).href;
const beetrootImage = new URL("../assets/Beetroot.png", import.meta.url).href;
const blueberryImage = new URL("../assets/Blueberry.png", import.meta.url).href;
const broccoliImage = new URL("../assets/Broccoli.png", import.meta.url).href;
const carrotImage = new URL("../assets/Carrot.png", import.meta.url).href;
const cherryImage = new URL("../assets/Cherry.png", import.meta.url).href;
const cornImage = new URL("../assets/Corn.png", import.meta.url).href;
const garlicImage = new URL("../assets/Garlic.png", import.meta.url).href;
const kiwiImage = new URL("../assets/Kiwi.png", import.meta.url).href;
const lettuceImage = new URL("../assets/Lettuce.png", import.meta.url).href;
const mushroomImage = new URL("../assets/Mushroom.png", import.meta.url).href;
const onionImage = new URL("../assets/Onion.png", import.meta.url).href;
const orangeImage = new URL("../assets/Orange.png", import.meta.url).href;
const pearImage = new URL("../assets/Pear.png", import.meta.url).href;
const pineappleImage = new URL("../assets/Pineapple.png", import.meta.url).href;
const potatoImage = new URL("../assets/Potato.png", import.meta.url).href;
const pumpkinImage = new URL("../assets/Pumpkin.png", import.meta.url).href;
const strawberryImage = new URL("../assets/Strawberry.png", import.meta.url)
  .href;

export interface CatalogueItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export const catalogueItems: CatalogueItem[] = [
  {
    id: 1,
    name: "Apple",
    category: "Fruit",
    price: 1.8,
    description:
      "Crisp apples with a naturally sweet flavor for everyday snacking.",
    image: appleImage,
  },
  {
    id: 2,
    name: "Pear",
    category: "Fruit",
    price: 1.7,
    description: "Juicy pears with a mellow sweetness and a smooth bite.",
    image: pearImage,
  },
  {
    id: 3,
    name: "Banana",
    category: "Fruit",
    price: 0.78,
    description:
      "Soft ripe bananas that are great for breakfast, baking, and smoothies.",
    image: bananaImage,
  },
  {
    id: 4,
    name: "Strawberry",
    category: "Fruit",
    price: 2.5,
    description: "Bright strawberries with a juicy texture and sweet finish.",
    image: strawberryImage,
  },
  {
    id: 5,
    name: "Blueberry",
    category: "Fruit",
    price: 2.1,
    description: "Fresh blueberries ideal for yogurt, cereal, or baking.",
    image: blueberryImage,
  },
  {
    id: 6,
    name: "Orange",
    category: "Fruit",
    price: 1.55,
    description: "Zesty oranges packed with juicy citrus flavor.",
    image: orangeImage,
  },
  {
    id: 7,
    name: "Pineapple",
    category: "Fruit",
    price: 1.89,
    description:
      "Sweet pineapple with a tropical taste perfect for fruit bowls.",
    image: pineappleImage,
  },
  {
    id: 8,
    name: "Cherry",
    category: "Fruit",
    price: 2.8,
    description: "Sweet cherries with a bold, refreshing bite.",
    image: cherryImage,
  },
  {
    id: 9,
    name: "Kiwi",
    category: "Fruit",
    price: 1.35,
    description: "Tangy kiwis with vibrant color and fresh flavor.",
    image: kiwiImage,
  },
  {
    id: 10,
    name: "Potato",
    category: "Vegetables",
    price: 1.25,
    description: "Hearty potatoes perfect for roasting, mashing, or frying.",
    image: potatoImage,
  },
  {
    id: 11,
    name: "Lettuce",
    category: "Vegetables",
    price: 0.69,
    description:
      "Crisp lettuce leaves that work well in salads and sandwiches.",
    image: lettuceImage,
  },
  {
    id: 12,
    name: "Beetroot",
    category: "Vegetables",
    price: 0.85,
    description:
      "Earthy beetroot that is great for roasting and colorful side dishes.",
    image: beetrootImage,
  },
  {
    id: 13,
    name: "Garlic",
    category: "Vegetables",
    price: 0.45,
    description:
      "Aromatic garlic cloves for adding rich flavor to home cooking.",
    image: garlicImage,
  },
  {
    id: 14,
    name: "Carrot",
    category: "Vegetables",
    price: 0.65,
    description: "Crunchy carrots with a clean, naturally sweet taste.",
    image: carrotImage,
  },
  {
    id: 15,
    name: "Mushroom",
    category: "Vegetables",
    price: 1.09,
    description:
      "Savory mushrooms that are ideal for pasta, soups, and stir-fries.",
    image: mushroomImage,
  },
  {
    id: 16,
    name: "Orange",
    category: "Fruit",
    price: 1.55,
    description: "Fresh oranges with bright citrus taste for snacks or juice.",
    image: orangeImage,
  },
  {
    id: 17,
    name: "Broccoli",
    category: "Vegetables",
    price: 0.82,
    description:
      "Tender broccoli florets perfect for steaming and stir-frying.",
    image: broccoliImage,
  },
  {
    id: 18,
    name: "Pumpkin",
    category: "Vegetables",
    price: 1.5,
    description:
      "Rich pumpkin with a smooth texture for soups, roasting, and pies.",
    image: pumpkinImage,
  },
  {
    id: 19,
    name: "Onion",
    category: "Vegetables",
    price: 0.95,
    description: "Flavorful onions that add depth to sauces, soups, and meals.",
    image: onionImage,
  },
  {
    id: 20,
    name: "Corn",
    category: "Vegetables",
    price: 0.89,
    description:
      "Sweet corn with a fresh taste that pairs well with any side dish.",
    image: cornImage,
  },
];
