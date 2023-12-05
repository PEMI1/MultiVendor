const express = require('express')
const ProductModel = require('../models/Product')
const LWPError = require('../utils/error')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const {isSeller} = require('../middleware/auth')
const Shop = require('../models/Shop')

//. 1 create-product POST
// 2. product-shop/:id GET Get all the products of the seller by seller ID
// 3. product-shop/:id DELETE. Delete product with product ID
// 4. product GET - Get all the products

const productRouter = express.Router()

//get all product
productRouter.get('/', catchAsyncErrors( async (req, res, next) => {
    try{
        const allProducts = await ProductModel.find().sort({createdAt: -1})

        res.status(200).json({allProducts: allProducts})
    } catch (error) {
        return next(new LWPError(error, 400))
    }
   
}) )

//create product
productRouter.post('/create-product', isSeller, catchAsyncErrors (async (req, res, next) =>{
    
    try{
        const shopId = req.body.shopId
        const shop = await Shop.findById(shopId)

        if (!shop) {
            return next(new LWPError('Shop id is invalid', 400))
        }

        const productData = req.body

        const productCreated = await ProductModel.create(productData)
        console.log('Product Created :: ', productCreated)
        
        res.status(201).json({
            success: 'True', 
            message:'product Created',
            product:productCreated}) 

    }catch (err){
        return next(new LWPError(err, 400))
    }

}))

//get product by seller's id
productRouter.get('/shop/:shopId', catchAsyncErrors(async(req, res, next) => {
    try{
        const {shopId} = req.params
        const products = await ProductModel.find({shopId: shopId})

        res.status(200).json({
            message: "success",
            sellersProducts: products
        })
    }catch(err){
        return next(new LWPError(err, 400))
    }  
}))

//delete product by product id
productRouter.delete('/shop/:id', isSeller, catchAsyncErrors(async(req,res, next) => {
    try{
        const {id} = req.params
        const product = await ProductModel.findByIdAndDelete(id)

        if(!product) {
            return next(new LWPError("Product not found", 404))
        }
        res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch(err){
        return next(new LWPError(err, 400))
    }
}))

module.exports = productRouter

