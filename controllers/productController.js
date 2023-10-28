import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'
export const createProductController =  async (req, res)=>{
    try {
        const {name, description, price, category, quantity, shipping}= req.fields;
        const {photo}= req.files
        //Validation..

        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required.'})
            case !description:
                return res.status(500).send({error:'description is required.'})
            case !price:
                return res.status(500).send({error:'Price is required.'})
            case !category:
                return res.status(500).send({error:'Category is required.'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required.'})
            case photo && photo.size > 1000000: 
                return res.status(500).send({error:'Photo is required and should be less than 1MB.'})
            
        }

        const products = new productModel({...req.fields, slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:'Product Created Successfully.',
            products
        })      
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'Error while creating Product',
            error
        })
    }
};
//Get All Product
export const getproductcontroller = async(req, res)=>{
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            Total : products.length,
            message:'All Products',
            products,
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'Error while getting all product',
            error
        })
    }
}

// Single Product 
export const singleProductController = async(req, res)=>{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category')
        res.status(200).send({
            success:true,
            message:'product getting successfully.',
            product
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'Error while getting single product',
            error
        })
    }
}

// Get Product Photo

export const  productPhotoController = async(req, res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select('photo');
        if(product.photo.data){
            res.set("content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        
        res.status(500).send({
            success:false,
            error,
            message:'Error while  getting  product photo'
        })
    }
}

// Delete Product
export const deleteProductController = async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success:true,
            message:'Product deleted sucessfully.',
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'Error while deleting  Product',
            error
        })
    }
}

// Update Product

export const updateProductController = async (req, res)=>{
    try {
        const {name, description, price, category, quantity, shipping}= req.fields;
        const {photo}= req.files;
        //Validation..
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required.'})
            case !description:
                return res.status(500).send({error:'description is required.'})
            case !price:
                return res.status(500).send({error:'Price is required.'})
            case !category:
                return res.status(500).send({error:'Category is required.'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required.'})
            case photo && photo.size > 1000000: 
                return res.status(500).send({error:'Photo is required and should be less than 1MB.'})
            
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug:slugify(name)},{new:true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:'Product updated Successfully.',
            products
        })      
    } catch (error) {
        
        res.status(500).send({
            success:false,
            message:'Error while updating Product',
            error
        })
    }
    
}
// filter Controller
export const  productFilterController = async(req, res)=>{
    try {
        const {checked, radio} = req.body;
        let args ={};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success:true,
            message:'Product Filtered.',
            products
        })       
    } catch (error) {
                res.status(400).send({
            success:false,
            message:'Error while filtering',
            error
        })
    }
}

// Product Count Controller

export const productCountController= async(req, res)=>{
    try {
        const total = await productModel.find({}).select('-photo').estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })
    } catch (error) {
        
        res.status(400).send({
            success:false,
            message:'Error in  Product  Count',
            error
        })
    }
}

// Product list based on page  controller

export const productListController = async(req, res)=>{
    try {
        const perPage = 3;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select('-photo').skip((page-1) * perPage).limit(perPage).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            products
        });
    } catch (error) {
                res.status(400).send({
            success:false,
            message:'Error in per page ctrl',
            error
        })
    }
}