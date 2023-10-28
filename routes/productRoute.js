import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { createProductController, deleteProductController, getproductcontroller, productCountController, productFilterController, productListController, productPhotoController, singleProductController, updateProductController } from '../controllers/productController.js'
import formidable from  'express-formidable';

const router = express.Router()
//Routing

//Create Product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController )

// Get All Product
router.get('/all-product', getproductcontroller)

// Get Single Product
router.get('/single-product/:slug', singleProductController)

// Get Photo
router.get('/product-photo/:pid', productPhotoController)

//  Delete Product
router.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController)

// Update Product
router.put('/update-product/:pid',requireSignIn, isAdmin, formidable(), updateProductController)

//filter Product
router.post('/product-filters', productFilterController)

//Product Count Router
router.get('/product-count', productCountController)

//Product per pege Router
router.get('/product-list/:page', productListController)
export default router;