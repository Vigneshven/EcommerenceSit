import express from "express";
import cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

interface Product {
  id: number;
  image: string;
  name: string;
  company: string;
  category: "kids" | "beds" | "sofa" | "chairs";
  free_shipping: boolean;
  price: string;
  description: string;
  amount: "1" | "2" | "3" | "4" | "5";
}

const products: Product[] = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/2959595/pexels-photo-2959595.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Convertible Sleeper Sofa",
    category: "sofa",
    company: "Comfora",
    price: "$199.99",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/5008397/pexels-photo-5008397.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Kids Bunk Bed",
    category: "kids",
    company: "Homeland",
    price: "$300.96",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/7546217/pexels-photo-7546217.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "L-Shaped Sectional Couch",
    category: "sofa",
    company: "flix",
    price: "$456.99",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/6044978/pexels-photo-6044978.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Marble Side Table",
    category: "chairs",
    company: "Comfora",
    price: "$567.99",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 5,
    image:
      "https://images.pexels.com/photos/2829032/pexels-photo-2829032.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Oak Wood Coffee Table",
    category: "chairs",
    company: "flix",
    price: "$1000.99",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 6,
    image:
      "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Premium Leather Sectional",
    category: "beds",
    company: "Comfora",
    price: "$4000",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 7,
    image:
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Reclining Sectional Sofa",
    category: "sofa",
    company: "Comfora",
    price: "$5000",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 8,
    image:
      "https://images.pexels.com/photos/785080/pexels-photo-785080.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Wooden Top Dining Table",
    category: "chairs",
    company: "Homeland",
    price: "$3599",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 9,
    image:
      "https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Bar Stool Set",
    category: "chairs",
    company: "Homeland",
    price: "$3457",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 10,
    image:
      "https://images.pexels.com/photos/6794934/pexels-photo-6794934.jpeg?auto=compress&cs=tinysrgb&w=800ss",
    name: "Ergonomic Office Chair",
    category: "chairs",
    company: "Homeland",
    price: "$3456",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 11,
    image:
      "https://images.pexels.com/photos/1813502/pexels-photo-1813502.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Contemporary Dining Chair",
    category: "chairs",
    company: "Homeland",
    price: "$4566",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 12,
    image:
      "https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Kids Toy Storage",
    category: "kids",
    company: "Homeland",
    price: "$2300",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 13,
    image:
      "https://images.pexels.com/photos/6692944/pexels-photo-6692944.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Kids Rainbow Chair",
    category: "chairs",
    company: "Homeland",
    price: "$3456",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 14,
    image:
      "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Queen Upholstered Bed",
    category: "beds",
    company: "Homeland",
    price: "$1500",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 15,
    image:
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Reclining Sectional Sofa",
    category: "sofa",
    company: "Homeland",
    price: "$4566",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
  {
    id: 16,
    image:
      "https://images.pexels.com/photos/7005269/pexels-photo-7005269.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: "Storage Platform Bed",
    category: "beds",
    company: "Homeland",
    price: "$2000",
    description:
      "Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge",
    amount: "1",
    free_shipping: false,
  },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  }

  res.json(product);
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
