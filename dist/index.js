"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware = express_1.default.json();
const app = (0, express_1.default)();
const port = 3000;
app.use(middleware);
const db = {
    users: [{ id: 1, name: 'duxxxx', password: '123456', admin: true },
        { id: 2, name: 'terfF', password: '4648963', admin: false },
        { id: 3, name: 'AmIGO', password: 'zaLUPA', admin: false },
        { id: 4, name: 'DJVLAD', password: 'HELLOGUYS', admin: false },
        { id: 5, name: 'kakzheslozhno', password: 'rotebalJS', admin: true }
    ]
};
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/users/', (req, res) => {
    const foundCourse = db.users.filter((el) => { return el.name.indexOf(req.query.name) > -1; });
    if (req.query.name) {
        res.send(foundCourse);
        return;
    }
    else {
        res.send(db.users);
    }
});
app.get('/users/:id', (req, res) => {
    let foundCourse = db.users.find((el) => { return el.id === +req.params.id; });
    if (!foundCourse) {
        res.send('Нет тактого пользователя');
        return;
    }
    res.send(foundCourse);
});
app.get('/users/', (req, res) => {
    res.send(db.users);
});
app.post('/users', (req, res) => {
    if (req.body.name && req.body.password) {
        const newUser = {
            id: +(new Date()),
            name: req.body.name,
            password: req.body.password,
            admin: false
        };
        db.users.push(newUser);
        res.send(newUser);
    }
    else {
        res.send('Вы что то не так ввели');
    }
});
app.delete('/users/:id', (req, res) => {
    db.users = db.users.filter((user) => user.id !== +req.params.id);
    res.send(db.users);
});
app.put('/users/:id', (req, res) => {
    const updatedUser = db.users.find((el) => { return el.id === +req.params.id; });
    if (updatedUser) {
        updatedUser.name = req.body.name;
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map