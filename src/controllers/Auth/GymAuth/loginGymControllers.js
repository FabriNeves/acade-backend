// Importa Gym
import Gym from '../../../models/gymModels/gymModel.js';

// Importa Mongoose
import mongoose from "mongoose";

// Classe para encryptar senhas. 
import loginClass from '../../../services/bcryptFunc.js';

// JWT
import jwt from 'jsonwebtoken';

// Carrega variaveis de Ambiente
import dotenv from "dotenv";

dotenv.config();
const SECRETKEY = process.env.SECRETKEY;

class loginGymControllers {
    /**Login */
    static async login(req, res) {

        const { email, password } = req.body;

        console.log(email, password);
    
        try {
            // Verifica se o usuário existe
            const user = await Gym.findOne({ email });
            if (!user) {
                const response = {
                    message: 'Invalid user/email or password',
                    success: false,
                    statusCode: 404,
                };
                res.status(404).json(response);
                return;
            }

            // Verifica se a senha está correta            
            const match = await loginClass.verifyPassword(password, user.hash);
            if (!match) {
                const response = {
                    message: 'Invalid user/email or password',
                    success: false,
                    statusCode: 401,
                };
                res.status(401).json(response);
                return;
            }

            // Gera o token JWT
            const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role ,gym_id :user._id }, SECRETKEY, {
                expiresIn: '5h'
            });

            const response = {
                user: user._id,
                auth: true,
                token: token,
                expiresIn: "5h",
                message: "Login successful",
                success: true,
                statusCode: 200,
            };
            res.status(200).json(response);
        } catch (error) {
            const response = {
                message: error.message,
                success: false,
                statusCode: 500,
            };
            res.status(500).json(response);
        }
    }

    /**Registro */
    static async register(req, res) {
        const { name, email, password } = req.body;

        try {
            // Verificar se o Gym já existe com o email fornecido
            const existingGym = await Gym.findOne({ email });
            if (existingGym) {
                const response = {
                    message: 'Gym with this email already exists.',
                    success: false,
                    statusCode: 400,
                };
                return res.status(400).json(response);
            }

            // Hash da senha
            const hashedPassword = await loginClass.hashPassword(password);

            // Criar novo Gym
            const newGym = new Gym({
                name,
                email,
                hash: hashedPassword,
                role: "Admin",
                active: true
            });

            // Salvar no banco de dados
            const savedGym = await newGym.save();

            const response = {
                message: `Gym created: ${JSON.stringify(savedGym.name)}`,
                success: true,
                statusCode: 200,
            };
            res.status(200).json(response);
        } catch (error) {
            const response = {
                message: error.message,
                success: false,
                statusCode: 500,
            };
            res.status(500).json(response);
        }
    }

    static dev(req, res) {

        res.status(200).send(req.decoded);

    }
}


export default loginGymControllers;