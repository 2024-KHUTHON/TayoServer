const express = require("express");
const app = express();

const qrRouter = require("./controller/qr");

const HOST = "0.0.0.0";
const PORT = 8855;

app.use("/qr", qrRouter);

app.listen(PORT, HOST, () => {
    console.log(`[LOG] Server is running on ${PORT}`);
});
