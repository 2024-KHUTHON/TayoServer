const Router = require("express");
const pool = require("../database/postgresql.js");
const lc = require("../controller/LoginController.js");

const router = Router();

'use strict'
const profile = async (req, res) => {
    console.log("this is profile/");
    const user_id = req.user_id;

    const query = `select rank, nickname, exp from public.user where id = $1`;
    const rows = await pool.query(query, [user_id]);
    const query_result = rows.rows[0];

    return res.status(200).json({
        rank: query_result.rank,
        nickname: query_result.nickname,
        exp: query_result.exp,
    });
}

router.get('/', lc.verifyToken, profile);

module.exports = router;