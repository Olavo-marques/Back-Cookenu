import { Request, Response } from "express";
import { RecipeData } from "../data/RecipeData";
import { UserData } from "../data/UserData"
import { RecipesBase } from "../model/RecipesBase"
import { Role } from "../model/UserBase";
import { Authenticator } from "../services/Authenticator"
import { GenerateId } from "../services/GenerateId"

export class Recipe {
    createRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string
            const { title, description } = req.body

            if (!title || !description) {
                res.statusCode = 401
                throw new Error('Verifique todoso os campos antes do envio.')
            }

            const authorization = new Authenticator()
            const normalPassword = authorization.verifyToken(token)
            const userId = normalPassword.id

            const userData = new UserData()
            const userSearched = await userData.selectUserById(userId)

            if (!userSearched) {
                res.statusCode = 500
                throw new Error('Erro no servidor.')
            }

            const Iduser = userSearched[0].id

            const generateId = new GenerateId()
            const IdRecipe = generateId.generate()

            const date = new Date()
            const dateNow = date.toLocaleDateString()

            const timeNow = new Date().toLocaleTimeString()

            const new_date = dateNow.split("/")
            const deadlineInReverse = new_date.reverse()
            const deadlineForAmerican = deadlineInReverse.join("-")

            const newRecipe = new RecipesBase(
                IdRecipe,
                title,
                description,
                deadlineForAmerican,
                timeNow,
                Iduser
            )

            const recipeData = new RecipeData()
            await recipeData.insertRecipe(newRecipe)

            res.status(201).send("Receita criada com sucesso!")

        } catch (error: any) {
            res.status(res.statusCode || 500).send({ error: error.message })
        }
    }

    getRecipeByid = async (req: Request, res: Response): Promise<void> => {
        try {
            const idRecipe = req.params.id
            const token = req.headers.authorization as string

            if (!token) {
                res.statusCode = 401
                throw new Error('Token deve ser passado nos headers.')
            }
            if (!idRecipe) {
                res.statusCode = 401
                throw new Error('O id a ser buscado deve ser informado por params.')
            }

            const recipeData = new RecipeData()
            const recipeDataBase = await recipeData.selectRecipeById(idRecipe)

            res.status(200).send(recipeDataBase)

        } catch (error: any) {
            res.status(res.statusCode || 500).send({ error: error.message })
        }
    }

    geAlltRecipeByIdUser = async (req: Request, res: Response): Promise<void> => {

        try {
            const token = req.headers.authorization as string

            if (!token) {
                res.statusCode = 401
                throw new Error('Token deve ser passado nos headers.')
            }

            const authorization = new Authenticator()
            const tokenId = authorization.verifyToken(token)

            const recipeData = new RecipeData()
            const recipeDataBase = await recipeData.selectAllRecipeByIdUser(tokenId.id)

            if (!recipeDataBase.length) {
                res.statusCode = 404
                throw new Error('Você ainda não criou nenhuma receita.')
            }

            res.status(200).send(recipeDataBase)

        } catch (error: any) {
            res.status(res.statusCode || 500).send({ error: error.message })
        }
    }

    editRecipeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string
            const idRecipeParams = req.params.id
            let title = req.body.title
            let description = req.body.description

            if (!token) {
                res.statusCode = 401
                throw new Error('Token deve ser passado nos headers.')
            }

            const authorization = new Authenticator()
            const userIdToken = authorization.verifyToken(token)

            const recipeData = new RecipeData()
            const recipeDataBase = await recipeData.selectRecipeById(idRecipeParams)

            if (recipeDataBase.idUser !== userIdToken.id) {
                res.statusCode = 401
                throw new Error('Você pode editar apenas suas receitas.')
            }

            const titleDataBase = recipeDataBase.title
            const descriptionDataBase = recipeDataBase.description

            if (!title) {
                title = titleDataBase
            }
            if (!description) {
                description = descriptionDataBase
            }

            const dateNow = new Date().toLocaleDateString()

            await recipeData.updateRecipeByIdUser(idRecipeParams, title, description, dateNow)

            res.status(200).send("Receita atualizada com sucesso!")

        } catch (error: any) {
            res.status(res.statusCode || 500).send({ error: error.message })
        }
    }

    deleteRecipeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string
            const idRecipeParams = req.params.id


            if (!idRecipeParams) {
                res.statusCode = 401
                throw new Error('Necessário informar o id da receita.')
            }
            if (!token) {
                res.statusCode = 401
                throw new Error('Token deve ser passado nos headers.')
            }

            const authorization = new Authenticator()
            const userIdToken = authorization.verifyToken(token)

            const recipeData = new RecipeData()
            const recipeDataBase = await recipeData.selectRecipeById(idRecipeParams)

            if (recipeDataBase === undefined) {
                res.statusCode = 401
                throw new Error('Esse id não existe.')
            }
            if (userIdToken.role !== Role.ADMIN && recipeDataBase.idUser !== userIdToken.id) {
                res.statusCode = 401
                throw new Error('Autorização insulficiente.')
            }

            await recipeData.deleteRecipeByIdUser(idRecipeParams)

            res.status(200).send("Receita revemovida com sucesso!")

        } catch (error: any) {
            res.status(res.statusCode || 500).send({ error: error.message })
        }
    }
}