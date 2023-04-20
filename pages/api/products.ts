// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();

  switch (req.method) {
    case "GET":
      if (req.query.id) {
        await getProduct(req, res, db);
      } else {
        await getProducts(req, res, db);
      }
      break;
    case "POST":
      await addProduct(req, res, db);
      break;
    case "PUT":
      await updateProduct(req, res, db);
      break;
    case "DELETE":
      await deleteProduct(req, res, db);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse, db) {
  const { id } = req.query;
  const ObjectId = require("mongodb").ObjectId;

  try {
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(400).json({ message: "Error getting product", error });
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse, db) {
  const search = req.query.search as string;

  if (search) {
    // Implement search logic here

    console.log("SEARCH STRING ", search);

    if (search.split("=").length > 1) {
      let key = search.split("=")[0];
      let value = search.split("=")[1];

      console.log("KEY: ",key);
      console.log("VALUE: ",value);

      if (key.toLowerCase() === "categoryname") {
        console.log("SEARCHING IN CategoryName");
        try {
          const { db } = await connectToDatabase();
          const products = await db
          .collection("products")
          .find({
              $or: [
                  { category: { $regex: new RegExp(value, "i") } }
              ]
          })
          .toArray();

          res.status(200).json(JSON.parse(JSON.stringify(products)));
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      } else if (key.toLowerCase() === "productname") {
        console.log("SEARCHING IN ProductName");

        try {
          const { db } = await connectToDatabase();
          const products = await db
          .collection("products")
          .find({
              $or: [
                  { name: { $regex: new RegExp(value, "i") } },
              ]
          })
          .toArray();

          res.status(200).json(JSON.parse(JSON.stringify(products)));
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    } else {
      console.log("SEARCHING IN both");

      try {
        const { db } = await connectToDatabase();
        const products = await db
        .collection("products")
        .find({
            $or: [
                { name: { $regex: new RegExp(search, "i") } },
                { category: { $regex: new RegExp(search, "i") } }
            ]
        })
        .toArray();

        res.status(200).json(JSON.parse(JSON.stringify(products)));
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } else {
    const products = await db.collection("products").find({}).toArray();
    res.status(200).json(products);
  }
}

async function addProduct(req: NextApiRequest, res: NextApiResponse, db) {
  const { name, category, description, price, imageUrl } = req.body;

  try {
    const newProduct = {
      name,
      category,
      description,
      price: parseFloat(price),
      imageUrl,
    };
    await db.collection("products").insertOne(newProduct);
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error adding product", error });
  }
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse, db) {
  console.log("---=-=-=-=-= updateProduct CALLED", req.body);
  const { _id, name, category, description, price, imageUrl } = req.body;
  const ObjectId = require("mongodb").ObjectId;

  try {
    const updatedProduct = await db
      .collection("products")
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            name,
            category,
            description,
            price: parseFloat(price),
            imageUrl,
          },
        },
        { returnOriginal: false }
      );

    if (!updatedProduct.value) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(updatedProduct.value);
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error });
  }
}

async function deleteProduct(req: NextApiRequest, res: NextApiResponse, db) {
  const { id } = req.query;
  const ObjectId = require("mongodb").ObjectId;

  try {
    const deletedProduct = await db
      .collection("products")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedProduct.value) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error deleting product", error });
  }
}
