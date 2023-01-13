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
const { Filter } = require("./model/filterModels");

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

// PRODUCTS
app
  .route("/api/v1/products")
  .get(async (req, res) => {
    try {
      const productQuery = new ApiFeatures(Product.find(), req.query)
        .sort()
        .filter()
        .paginate()
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
      const product = await Product.create({
        ...req.body,
        ...(req.file
          ? {
              image: process.env.URL + req.file.filename,
              imageName: req.file.filename,
            }
          : {}),
      });
      res.status(201).json({
        status: "succes",
        data: { product },
      });
      // res.status(200).send("post");
    } catch (error) {
      console.log(1, error, req.file);
      req.file && fs.unlink(`./images/${req.file.filename}`);
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      fsExtra.emptyDir("./images");
      const products = await Product.remove();
      // const filters = await Filter.remove();

      res.status(200).json({
        status: "succes",
        products,
        // filters,
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

      res.status(201).json({
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

//FILTERS
app
  .route("/api/v1/filters")
  .post(async (req, res) => {
    console.log(req.body);
    try {
      const newFilter = await Filter.create(req.body);
      res.status(201).json({ status: "succes", data: { newFilter } });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const filterQuery = new ApiFeatures(Filter.find(), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields();
      const filters = await filterQuery.query;
      res
        .status(200)
        .json({ status: "succes", result: filters.length, data: { filters } });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const filters = await Filter.remove();

      res.status(200).json({
        status: "succes",
        filters,
      });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  });

app
  .route("/api/v1/filter/:id")
  .patch(async (req, res) => {
    try {
      const { id } = req.params;
      const oldFilter = await Filter.findByIdAndUpdate(id, req.body);
      res.status(200).json({ status: "succes", data: { oldFilter } });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const filter = await Filter.findById(id);
      res.status(200).json({ status: "succes", data: { filter } });
    } catch (error) {
      res.status(404).json({ status: "fail", message: error.message });
    }
  });

module.exports = app;
