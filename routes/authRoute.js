import express from "express"; 
import {registerController, loginController, testController, forgotPasswordController, updateProfileController} from '../controllers/authController.js'
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js';
// route Object

const router = express.Router();

//routing

//Register || METHOD POST
router.post('/register', registerController)

// LOGING || METHOD POST
router.post('/login', loginController)

// Forgot Password || method Post
router.post('/forgot-password', forgotPasswordController)


//Test Router
router.get('/test', requireSignIn, testController);

// Pretected user Route auth

router.get('/user-auth', requireSignIn, (req, res)=>{
    res.status(200).send({ok:true})
});

// Pretected admin Route auth

router.get('/admin-auth', requireSignIn, isAdmin, (req, res)=>{
    res.status(200).send({ok:true})
});

// Update Profile
router.put('/profile', requireSignIn, updateProfileController)
export default router;