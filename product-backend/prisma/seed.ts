import { prisma } from "../lib/prisma";

const img = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

type Category = "kids" | "beds" | "sofa" | "chairs";
type Company = "Homeland" | "flix" | "comfoma";

const products: {
  id: number;
  name: string;
  category: Category;
  company: Company;
  price: number;
  free_shipping: boolean;
  photo: number;
  description: string;
}[] = [
  { id: 1, name: "Reclining Sectional Sofa", category: "sofa", company: "Homeland", price: 12999, free_shipping: true, photo: 1866149, description: "Deep reclining sectional with plush cushions for the whole family." },
  { id: 2, name: "Modern Comfort Sofa", category: "sofa", company: "flix", price: 12499, free_shipping: true, photo: 3757055, description: "Clean-lined three-seater with a soft, durable fabric finish." },
  { id: 3, name: "Premium Leather Sectional", category: "sofa", company: "comfoma", price: 28999, free_shipping: true, photo: 276583, description: "Full-grain leather sectional built to last for years." },
  { id: 4, name: "Contemporary Dining Chair", category: "chairs", company: "Homeland", price: 4599, free_shipping: false, photo: 1813502, description: "Slim, supportive dining chair with a contemporary profile." },
  { id: 5, name: "Convertible Sleeper Sofa", category: "sofa", company: "flix", price: 19999, free_shipping: false, photo: 2959595, description: "Sofa by day, comfortable guest bed by night." },
  { id: 6, name: "King Size Platform Bed", category: "beds", company: "comfoma", price: 18999, free_shipping: true, photo: 164595, description: "Low-profile king bed with a sturdy solid-wood frame." },
  { id: 7, name: "Kids Rainbow Chair", category: "kids", company: "Homeland", price: 2299, free_shipping: false, photo: 6692944, description: "Bright, lightweight chair sized for little ones." },
  { id: 8, name: "Ergonomic Office Chair", category: "chairs", company: "flix", price: 6999, free_shipping: true, photo: 6794934, description: "Adjustable lumbar support for long working days." },
  { id: 9, name: "Queen Upholstered Bed", category: "beds", company: "comfoma", price: 14999, free_shipping: false, photo: 279746, description: "Queen bed with a padded upholstered headboard." },
  { id: 10, name: "Kids Study Desk", category: "kids", company: "Homeland", price: 3899, free_shipping: true, photo: 5303586, description: "Compact desk with room for books, art and homework." },
  { id: 11, name: "L-Shaped Sectional Couch", category: "sofa", company: "flix", price: 22999, free_shipping: true, photo: 7546217, description: "Spacious L-shaped couch that anchors any living room." },
  { id: 12, name: "Kids Bunk Bed", category: "kids", company: "comfoma", price: 11999, free_shipping: true, photo: 5008397, description: "Space-saving bunk bed with safety rails and a ladder." },
  { id: 13, name: "Modern Accent Chair", category: "chairs", company: "Homeland", price: 5999, free_shipping: true, photo: 7602899, description: "A bold accent chair for reading corners and bedrooms." },
  { id: 14, name: "Wingback Accent Chair", category: "chairs", company: "flix", price: 8999, free_shipping: false, photo: 2179214, description: "Classic wingback shape with a high, supportive back." },
  { id: 15, name: "Storage Platform Bed", category: "beds", company: "comfoma", price: 16999, free_shipping: true, photo: 7005269, description: "Platform bed with built-in drawers underneath." },
  { id: 16, name: "Bar Stool Set", category: "chairs", company: "Homeland", price: 3299, free_shipping: true, photo: 5490965, description: "Set of counter-height stools with a comfortable seat." },
  { id: 17, name: "Kids Toy Storage", category: "kids", company: "flix", price: 1899, free_shipping: false, photo: 3932930, description: "Open shelving that makes tidy-up time easy." },
];

async function main() {
  for (const { photo, ...p } of products) {
    const data = {
      ...p,
      image: img(photo),
      amount: 1,
      stock_quantity: 50,
    };

    await prisma.products.upsert({
      where: { id: p.id },
      create: data,
      update: data,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
