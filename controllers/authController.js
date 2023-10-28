import userModels from "../models/userModels.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from 'jsonwebtoken';
export const registerController = async(req, res) =>{
    try{
        const {name, email, password, phone, address, answer} = req.body;
        //validation
        if(!name){
            return res.send({message:"Name is Required"})
        }
        if(!email){
            return res.send({message:"Email is Required"})
        }
        if(!password){
            return res.send({message:"password is Required"})
        }
        if(!phone){
            return res.send({message:"Phone Number is Required"})
        }
        if(!address){
            return res.send({message:"Address is Required"})
        }
        if(!answer){
            return res.send({message:"Answer is Required"})
        }

        //check user
        const existingUser = await userModels.findOne({email});

        // check existing user
        if (existingUser){
            return res.status(200).send({
                success:false,
                message:'Already Registered please login'
            })
        }
        // register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModels({name, email, phone, address, answer, password:hashedPassword}).save()

        res.status(201).send({
            success:true,
            message:"user register successfully",
            user,
        })

        } catch (error) {
            
            res.status(500).send({
            success:false,
            message:'Error in Registration',
            error,
        })
    }
}; 

// POST || LOGIN

export const loginController = async(req, res)=>{
    try{
        const {email, password} = req.body;
        //Validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message: "Invalid Email or Password",

            })
        }
        //check user
        const user = await userModels.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email not registered'
                
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }
        //Token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'});
        res.status(200).send({
            success:true,
            message:'Login Sucessfully',
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                answer:user.answer,
                role:user.role
            },
            token,
        });
    }catch(error){
        res.status(500).send({
            success:false,
            message:"error in login",
            error
        })
    }
};


// Forgot Password Controller
export  const forgotPasswordController = async(req, res)=>{
    try {
        
        const {email, answer, newPassword} = req.body;
        if(!email){
            res.status(400).send({message:'Email is required!'});
        }
        if(!answer){
            res.status(400).send({message:'Answer is required!'});
        }
        if(!newPassword){
            res.status(400).send({message:'New Password is required!'});
        }
        // check Email and Answer..
        const user = await userModels.findOne({email,answer})
        if(!user){
            return  res.status(404).send({
                success:false,
                message:'Wrong Email or Answer',
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModels.findByIdAndUpdate(user._id, {password:hashed});
        res.status(200).send({
            success:true,
            message:'Password Reset Sucessfully..',
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Somthing went wrong.',
            error
        })
    }
}

//Update Profile controller
export const updateProfileController = async( req, res)=>{
    try {
    const {name, email,password, phone, address} = req.body;
    const user = await userModels.findById(req.user._id);
    //password
    if(password && password.length< 6){
        return res.json({error:'password is required and should be more than 6 charcter'})}
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModels.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        },{new:true})
        res.status(200).send({
            success:true,
            message: 'Profile Updated',
            updatedUser
        })
           
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error while updateing  profile",
            error
        })
    }
}

//test controller

export const testController = (req, res)=>{
    res.send("Protected Route");
}