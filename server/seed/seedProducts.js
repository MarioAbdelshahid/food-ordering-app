import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Restaurant.deleteMany();

    const burgerHouse = await Restaurant.create({
      nameEn: "Burger House",
      nameAr: "برجر هاوس",
      descriptionEn: "Fresh burgers, crispy sides, and cold drinks.",
      descriptionAr: "برجر طازج، مقبلات مقرمشة، ومشروبات باردة.",
      cuisine: "Burgers",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      isOpen: true,
    });

    const italianCorner = await Restaurant.create({
      nameEn: "Italian Corner",
      nameAr: "الركن الإيطالي",
      descriptionEn: "Pizza, pasta, salads, and Italian favorites.",
      descriptionAr: "بيتزا ومكرونة وسلطات وأكلات إيطالية مميزة.",
      cuisine: "Italian",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      isOpen: true,
    });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create([
      {
        username: "Burger Admin",
        email: "burger@foodly.com",
        password: hashedPassword,
        role: "admin",
        restaurant: burgerHouse._id,
      },
      {
        username: "Italian Admin",
        email: "italian@foodly.com",
        password: hashedPassword,
        role: "admin",
        restaurant: italianCorner._id,
      },
      {
        username: "Mario",
        email: "mario@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "user",
      },
    ]);

    await Product.insertMany([
      {
        restaurant: burgerHouse._id,
        nameEn: "Classic Beef Burger",
        nameAr: "برجر لحم كلاسيك",
        descriptionEn: "Juicy beef burger with lettuce, tomato, cheese, and special sauce.",
        descriptionAr: "برجر لحم شهي مع خس وطماطم وجبن وصوص خاص.",
        category: "Burgers",
        price: 145,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        available: true,
      },
      {
        restaurant: burgerHouse._id,
        nameEn: "Chicken Burger",
        nameAr: "برجر دجاج",
        descriptionEn: "Crispy chicken burger with mayo, lettuce, and pickles.",
        descriptionAr: "برجر دجاج كرسبي مع مايونيز وخس ومخلل.",
        category: "Burgers",
        price: 125,
        image: "https://www.joshuasburger.com/wp-content/uploads/2021/05/Classic-Chicken-burger-600x476.jpg",
        available: true,
      },
      {
        restaurant: burgerHouse._id,
        nameEn: "French Fries",
        nameAr: "بطاطس مقلية",
        descriptionEn: "Crispy golden fries served with ketchup.",
        descriptionAr: "بطاطس ذهبية مقرمشة تقدم مع كاتشب.",
        category: "Sides",
        price: 65,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
        available: true,
      },
      {
        restaurant: italianCorner._id,
        nameEn: "Margherita Pizza",
        nameAr: "بيتزا مارجريتا",
        descriptionEn: "Classic pizza with mozzarella cheese, tomato sauce, and basil.",
        descriptionAr: "بيتزا كلاسيكية بالجبن الموتزاريلا وصوص الطماطم والريحان.",
        category: "Pizza",
        price: 180,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
        available: true,
      },
      {
        restaurant: italianCorner._id,
        nameEn: "Chicken Alfredo Pasta",
        nameAr: "مكرونة ألفريدو بالدجاج",
        descriptionEn: "Creamy Alfredo pasta with grilled chicken.",
        descriptionAr: "مكرونة كريمية بصوص ألفريدو مع دجاج مشوي.",
        category: "Pasta",
        price: 190,
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a",
        available: true,
      },
      {
        restaurant: italianCorner._id,
        nameEn: "Caesar Salad",
        nameAr: "سلطة سيزر",
        descriptionEn: "Fresh lettuce with grilled chicken, croutons, and Caesar dressing.",
        descriptionAr: "خس طازج مع دجاج مشوي وقطع خبز محمص وصوص سيزر.",
        category: "Salads",
        price: 115,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
        available: true,
      },
    ]);

    console.log("Seed data inserted successfully");
    console.log("User: mario@test.com / 123456");
    console.log("Burger Admin: burger@foodly.com / admin123");
    console.log("Italian Admin: italian@foodly.com / admin123");

    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();