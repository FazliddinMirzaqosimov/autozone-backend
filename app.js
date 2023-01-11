const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiFeatures = require("./utils/apiFeatures");
const Product = require("./model/productModel");
const app = express();
const fsExtra = require("fs-extra");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("./images"));
app.use(morgan("dev"));

//Static

const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//Controllers

app
  .route("/api/v1/products")
  .get(async (req, res) => {
    try {
      const productQuery = new ApiFeatures(Product.find(), req.query)
        .filter()
        .paginate()
        .sort()
        .limitFields();

      const products = await productQuery.query;

      res.status(200).json({
        status: "succes",
        result: products.length,
        data: { products },
      });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .post(upload.single("image"), async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.file);
      const product = await Product.create({
        ...req.body,
        ...(req.file
          ? {
              image: process.env.URL + req.file.filename,
              imageName: req.file.filename,
            }
          : {}),
      });
      res.status(200).json({
        status: "succes",
        data: { product },
      });
      // res.status(200).send("post");
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      fsExtra.emptyDir("./images");
      const products = await Product.remove();

      res.status(200).json({
        status: "succes",
        ...products,
      });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  });

app
  .route("/api/v1/products/:id")
  .delete(async (req, res) => {
    try {
      const id = req.params.id;

      const product = await Product.findByIdAndDelete(id);
      console.log(product);
      product?.imageName &&
        fs.unlink(`./images/${product.imageName}`, (err) => {});

      res.status(200).json({
        status: "succes",
        data: { product },
      });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .patch(upload.single("image"), async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findByIdAndUpdate(id, {
        ...req.body,
        ...(req.file
          ? {
              image: process.env.URL + req.file.filename,
              imageName: req.file.filename,
            }
          : {}),
      });
      req.file &&
        product.image &&
        fs.unlink(`./images/${product.imageName}`, (err) => {});

      res.status(200).json({
        status: "succes",
        data: { product },
      });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      res.status(200).json({
        status: "succes",
        data: { product },
      });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  });

module.exports = app;
