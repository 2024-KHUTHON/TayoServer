const router = require("express").Router();
const { encrypt, decrypt } = require("../service/aes");

router.post("/issue/:id", (req, res) => {
    try {
        const id = req.params.id;
        let userInfo = {
            user_id: id,
            publish_at: new Date().getTime(),
        };

        const serializedQRInfo = JSON.stringify(userInfo);
        const secureSerializedQRInfo = encrypt(serializedQRInfo);

        res.status(200).json({
            message: "성공적으로 해쉬를 반환하였습니다.",
            qr_hash: secureSerializedQRInfo,
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            message: "해쉬를 반환하는데 실패하였습니다.",
            error: exception,
        });
    }
});

router.get("/read", (req, res) => {
    const qrHash = req.body.qr_hash;
    try {
        const decryptData = JSON.parse(decrypt(qrHash));

        const currentTime = new Date().getTime();
        if (currentTime - decryptData.publish_at > 120000) {
            res.status(401).json({
                code: "QR코드가 만료되었습니다.",
            });
        }

        res.status(200).json({
            message: "QR코드가 성공적으로 복호화되었습니다.",
            user_id: decryptData.user_id,
        });
    } catch (exception) {
        res.status(500).json({
            message: "QR코드 복호화에 실패하였습니다.",
            code: exception,
        });
    }
});

module.exports = router;
