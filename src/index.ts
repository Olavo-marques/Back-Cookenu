import app from "./app";
import { UserData } from "./data/UserData";
import { Follow } from "./endpoints/Follow";
import { Recipe } from "./endpoints/Recipe";
import { User } from "./endpoints/User";

const user = new User()
const recipe = new Recipe()
const follow = new Follow()

app.get('/profile', user.getProfile)

app.get('/user/:id', user.getUserById)

app.get('/feed', recipe.geAlltRecipeByIdUser)

app.get('/recipe/:id', recipe.getRecipeByid)

app.post('/signup', user.signup)

app.post('/login', user.login)

app.post('/recipe', recipe.createRecipe)

app.post('/user/follow', follow.userFollow)

app.post('/user/unfollow', follow.userUnfollow)

app.put('/recipe/:id', recipe.editRecipeById)

app.delete('/recipe/:id/remove', recipe.deleteRecipeById)

app.delete('/user/remove', user.deleteUserById)
