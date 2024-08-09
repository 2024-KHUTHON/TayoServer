const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "hex"
); // 32바이트 키
const iv = Buffer.from("abcdef9876543210abcdef9876543210", "hex");

const encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

const decrypt = (text) => {
    let encryptedText = Buffer.from(text, "hex");
    console.log(encryptedText);
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

module.exports = { encrypt, decrypt };
