const jwt = require("jsonwebtoken");
const express = require("express");
require("dotenv").config();
const pool = require("../database/postgresql");
const bcrypt = require("bcrypt");
const loginRouter = express.Router();

const YOUR_SECRET_KEY = "znxhsdntmd";

//controller
const verifyToken = async (req, res, next) => {
    try {
        const clientToken = req.cookies.user;
        const decoded = jwt.verify(clientToken, YOUR_SECRET_KEY);

        if (decoded) {
            req.user_id = decoded.user_id;
            next();
        } else {
            res.status(400).json({});
        }
    } catch (err) {
        next(err);
    }
};

//verifyToken으로 req.user_id잘받아와지는지
// loginRouter.get('/user/board', verifyToken, (req, res) => {
//     // verifyToken 미들웨어를 통해 유효성 검사를 완료한 후,
//     // 사용자 ID가 req.user_id에 저장되어 있음

//     // 사용자 ID를 기반으로 게시글을 조회하고 응답 반환
//     const user_id = req.user_id;
//     res.status(200).json({ user_id, message: '게시글을 반환합니다.' });
// });

//토큰을 생성하는 메소드 (req.body로 전달되는 id와 pw정보를 이용해서 userdb를 검색하고 해당 user가 있으면 jwt 생성해서 쿠키에 저장하고 200응답 반환)
const createToken = async (req, res, next) => {
    try {
        //id와 pw가 db에 존재하는지 확인하는 코드
        const exist = await pool.query(
            "SELECT id FROM public.user WHERE user_id = $1",
            [req.body.user_id]
        );
        const password = await pool.query(
            "SELECT password FROM public.user WHERE user_id = $1",
            [req.body.user_id]
        );
        const ex = exist.rows[0].id;
        const ps = password.rows[0].password;
        const validPassword = await bcrypt.compare(req.body.password, ps);

        //일치하는게 있으면 jwt토큰 생성
        try {
            if (ex && validPassword) {
                const token = jwt.sign({ user_id: ex }, YOUR_SECRET_KEY, {
                    expiresIn: "1h",
                });
                res.cookie("user", token);
                console.log(res.cookie);
                // const decodedToken = jwt.decode(token);
                // console.log(decodedToken)
                //const user = decodedToken.user_id;
                res.status(200).json(token);
            } else {
                res.status(400).json({});
            }
        } catch (error) {
            console.log(error);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

const signUp = async (req, res) => {
    try {
        const result = await createUser(req.body);
        res.status(200).json(result);
    } catch {
        res.status(400).json({});
    }
};

//model
const createUser = async (body) => {
    try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const signUpSuccess = await pool.query(
            'INSERT INTO "public"."user" ("user_id", "password", "nickname", "point", "exp", "rank", "last_get") VALUES ($1, $2, $3, 0, 0, \'환경 거지\', NOW());',
            [body.user_id, hashedPassword, body.nickname]
        );
    } catch (error) {
        console.log(error);
    }
    conn.release();
    //return signUpSuccess
};

//route
loginRouter.post("/signUp", signUp);
loginRouter.post("/login", createToken);

module.exports = { loginRouter, verifyToken };
