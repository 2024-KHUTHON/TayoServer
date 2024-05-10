const express = require("express");
const app = express();

const HOST = "0.0.0.0";
const PORT = 8855;

app.listen(PORT, HOST, () => {
    console.log(`[LOG] Server is running on ${PORT}`);
});
