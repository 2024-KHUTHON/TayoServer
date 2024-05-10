const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
//const { multerErrorHandler } = require("./config/errorHandlers.js");
//# 폴더 파일 import

//@ app 설정 공간

// 루트에서 config.env 환경변수 불러옴
//dotenv.config({ path: "./config.env" });

// 다른 도메인에서 오는 요청을 허용
app.use(cors());
// JSON 형식의 요청 데이터 파싱, URL 인코딩된 데이터를 파싱, 요청에 포함된 쿠키를 파싱
app.use(express.json());
app.use(cookieParser("secret_password"));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.json());
//# app 설정 공간

const qrRouter = require("./controller/qr");

const HOST = "0.0.0.0";
const PORT = 8855;

app.use("/qr", qrRouter);

app.listen(PORT, HOST, () => {
    console.log(`[LOG] Server is running on ${PORT}`);
});

const loginRouter = require("./controller/LoginController");
app.use("/users", loginRouter.loginRouter);
