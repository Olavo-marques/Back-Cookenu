import { Request, Response } from "express";
import { FollowData } from "../data/FollowData";
import { UserData } from "../data/UserData";
import { Authenticator } from "../services/Authenticator";
import { GenerateId } from "../services/GenerateId";

export class Follow {

  userFollow = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idUserFollow } = req.body
      const token = req.headers.authorization as string

      if (!token) {
        res.statusCode = 401
        throw new Error('Token deve ser passado nos headers.')
      }
      if (!idUserFollow) {
        res.statusCode = 401
        throw new Error('O id a ser buscado deve ser informado.')
      }

      const authorization = new Authenticator()
      const payload = authorization.verifyToken(token)
      const userId = payload.id

      const userData = new UserData()
      const userDataBase = await userData.selectUserById(userId)

      
      const idUserFollowing = userDataBase[0].id
      const nameUserFollowing = userDataBase[0].name
      
      const userDataBaseFollowed = await userData.selectUserById(idUserFollow)
      
      if (!userDataBaseFollowed.length) {
        res.statusCode = 409
        throw new Error(`O usuário que deseja seguir não foi encontrado.`)
      }
      
      let idUserFollowed = userDataBaseFollowed[0].id
      const nameUserFollowed = userDataBaseFollowed[0].name
      
      
      const generateId = new GenerateId()
      const id = generateId.generate()

      const followData = new FollowData()
      const followers = await followData.selectFollowers(idUserFollowing, idUserFollowed)
      
      if (followers.length) {
        res.statusCode = 409
        throw new Error(`Você já segue ${nameUserFollowed}.`)
      }
      if (idUserFollowed === idUserFollowing) {
        res.statusCode = 409
        throw new Error(`Você não poode seguir a si mesmo.`)
      }

      await followData.followedUser(id, idUserFollowing, idUserFollowed)

      res.status(201).send(`${nameUserFollowing} agora esta seguindo o ${nameUserFollowed}!`)

    } catch (error: any) {
      res.status(res.statusCode || 500).send({ error: error.message })
    }
  }

  userUnfollow = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idUserUnfollow } = req.body
      const token = req.headers.authorization as string

      if (!token) {
        res.statusCode = 401
        throw new Error('Token deve ser passado nos headers.')
      }
      if (!idUserUnfollow) {
        res.statusCode = 401
        throw new Error('O id a ser buscado deve ser informado.')
      }

      const authorization = new Authenticator()
      const normalPassword = authorization.verifyToken(token)
      const userId = normalPassword.id

      const userData = new UserData()
      const userUnfollowDb = await userData.selectUserById(idUserUnfollow)
      const nameUnfollowDb = userUnfollowDb[0].name

      const followData = new FollowData()

      await followData.unfollowedUser(idUserUnfollow, userId)

      res.status(201).send(`Você paraou de seguir ${nameUnfollowDb}!`)

    } catch (error: any) {
      res.status(res.statusCode || 500).send({ error: error.message })
    }
  }
}