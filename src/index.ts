import express from "express";
import type { Request, Response } from "express";
import type {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "./types.js";
import type {RequestWithQuery} from "./types.js";
import type {CreateUserModel} from "./models/CreateUserModel.js";
import type {CreateVideoModel} from "./models/CreateVideoModel.js";
import type {GetUserQueryModel} from "./models/GetUserQueryModel.js";
import type {GetVideoQueryModel} from "./models/GetVideoQueryModel.js";
import type {UserViewModel} from "./models/UserViewModel.js";
import type {VideoViewModel} from "./models/VideoViewModel.js";
import type {GetUriParamsIdModel} from "./models/GetUriParamsIdModel.js";
import type {UpdateVideoModel} from "./models/UpdateVideoModel.js";


const middleware = express.json();
const app = express();
const port = process.env.PORT || 3000;
const UsersToViewModel = (user: usersType): UserViewModel => {
    return {
        id: user.id,
        name: user.name
    }
}
const VideosToViewModel = (video: videosType): VideoViewModel => {
    return {
        id: video.id,
        title: video.title
    }
}
app.use(middleware)
type usersType = {id: number, name:string, password: string, admin: boolean};
type videosType = {id: number, title:string, resolution: number};
const db:{users:usersType[], videos:videosType[]} = {
    users: [ {id:1, name:'duxxxx', password:'123456', admin: true},
    {id:2, name:'terfF', password:'4648963', admin: false},
    {id:3, name:'AmIGO', password:'zaLUPA', admin: false},
    {id:4, name:'DJVLAD', password:'HELLOGUYS', admin: false},
    {id:5, name:'kakzheslozhno', password:'rotebalJS', admin: true}],

    videos: [ {id: 1, title:'VIDEO S GOROHOM', resolution: 144},
        {id: 2, title:'VIDEO S MOPSOM', resolution: 240},
        {id: 3, title:'VIDEO S KOTOM', resolution: 360},
        {id: 4, title:'VIDEO S BOMHZOM', resolution: 480},
        {id: 5, title:'VIDEO S USHASTIM', resolution: 720},
        {id: 6, title:'VIDEO S PINGVINOM', resolution: 1080}]};
app.get('/', (req, res) => {
    res.send('ТЕСТИРУЕМ ХОСТИНГ RAILWAY ЕЩЕ РАЗ!!!');
});

app.get('/users/', (req: RequestWithQuery<GetUserQueryModel>, res: Response<UserViewModel[]>) => {
    if(req.query.name) {
        const foundUser = db.users.filter((user) => {
            return user.name.indexOf(req.query.name) > -1
        })
        res.send(foundUser.map(UsersToViewModel))
    }
    res.send(db.users)
});
app.get('/users/:id', (req:Request<GetUriParamsIdModel>, res: Response<UserViewModel | string>) => {
    let foundUser = db.users.find((el)=> { return el.id === +req.params.id});
    if(!foundUser) {
        res.send('Нет такого пользователя!')
        return;
    }
    res.send(UsersToViewModel(foundUser))
});
app.get('/users/', (req, res: Response<UserViewModel[]>) => {
    res.send(db.users);
});
app.post('/users', (req: RequestWithBody<CreateUserModel>, res) => {
    if (req.body.name && req.body.password) {
    const newUser = {
        id: +(new Date()),
        name: req.body.name,
        password: req.body.password,
        admin: false
    }
    db.users.push(newUser)
    res.send(200)
} else {
        res.send('Вы что то не так ввели').status(200)
    }
});
app.delete('/users/:id', (req:RequestWithParams<{id: string}>,res) => {
    db.users = db.users.filter((user) => user.id !== +req.params.id)
    res.sendStatus(200)
});
app.put('/users/:id', (req:RequestWithParamsAndBody<{id: string},{name:string}>, res) => {
    const updatedUser = db.users.find((el) => { return el.id === +req.params.id})
    if(updatedUser) {
    updatedUser.name = req.body.name
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
});
app.get('/videos/', (req: RequestWithQuery<GetVideoQueryModel>, res: Response<VideoViewModel[]>) => {
    if(req.query.title) {
        const foundVideo = db.videos.filter((video) => {
            return video.title.indexOf(req.query.title) > -1
        })
        res.send(foundVideo.map(VideosToViewModel))
    }
    res.send(db.videos)
});
app.get('/videos/:id', (req: RequestWithParams<GetUriParamsIdModel>, res: Response<VideoViewModel>) => {
    const foundVideo = db.videos.find((video)=> { return video.id === +req.params.id})
    if(foundVideo) {
        res.send(VideosToViewModel(foundVideo))
    } else {
        res.send({id: 1337, title:"нет такого видео"})
    }
});
app.post('/videos/', (req:RequestWithBody<CreateVideoModel>, res) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        resolution: 1080
    }
    db.videos.push(newVideo)
    res.send(200);
});
app.put('/videos/:id', (req: RequestWithParamsAndBody<UpdateVideoModel,UpdateVideoModel>, res:Response<VideoViewModel | string>) => {
const updatedVideo = db.videos.find((video) => { return video.id === +req.params.id})
    if(updatedVideo && req.body.title) {
        updatedVideo.title = req.body.title
        res.send(VideosToViewModel(updatedVideo))
    } else {
        res.send('IDI NAHUY')
    }
});
app.delete('/videos/:id', (req: RequestWithParams<{id: string}>, res) => {

  for(let i = 0; i < db.videos.length; i++) {
      if(db.videos[i].id === +req.params.id) {
          db.videos.splice(i, 1)
          res.send(200)
          return;
      }
  }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});