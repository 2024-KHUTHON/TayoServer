const express = require("express");
const pool = require("../database/postgresql.js");
const lc = require("../controller/LoginController.js");

const router = express.Router();

'use strict'
const pointRemain = async (req, res) => {
    console.log("this is point/remain");
    const user_id = req.user_id;

    const query = `select point from public.user where id = $1`;
    const rows = await pool.query(query, [user_id]);
    const query_result = rows.rows[0];

    return res.status(200).json({
        point: query_result.point,
    });
}

const pointGetHistory = async (req, res) => {
    console.log("this is point/history/get");
    const user_id = req.user_id;

    const query = `select point, content, created_at from public.history where user_id = $1 and type = $2`;
    const rows = await pool.query(query, [user_id, "적립"]);
    const query_result = rows.rows;

    return res.status(200).json({
        get_history: query_result
    });
}

const pointUseHistory = async (req, res) => {
    console.log("this is point/history/consume");
    const user_id = req.user_id;

    const query = `select point, content, created_at from public.history where user_id = $1 and type = $2`;
    const rows = await pool.query(query, [user_id, "사용"]);
    const query_result = rows.rows;
    
    return res.status(200).json({
        consume_history: query_result,
    });
}

const getPoint = async (req, res) => {
    console.log("this is point/get");
    const user_id = req.params.user_id;
    const content = req.body.content;
    const point = req.body.point;
    
    try {
        // 포인트 적립
        const getPointQuery = `select point from public.user where id = $1`
        const getPointRows = await pool.query(getPointQuery, [user_id]);
        const query_result1 = getPointRows.rows[0];

        const original_point = query_result1.point;
        const updatedPoint = original_point + point;

        const updatePointQuery = `update public.user set point = $1 where id = $2`;
        await pool.query(updatePointQuery, [updatedPoint, user_id]);

        // exp 업데이트
        const getExpQuery = `select exp from public.user where id = $1`
        const getExpRows = await pool.query(getExpQuery, [user_id]);
        const query_result2 = getExpRows.rows[0];

        const original_exp = query_result2.exp;
        const updatedExp = original_exp + point;

        const updateExpQuery = `update public.user set exp = $1 where id = $2`;
        await pool.query(updateExpQuery, [updatedExp, user_id]);

        // 포인트 적립 내역 추가
        const getPointHistoryQuery = `insert into public.history (user_id, point, type, created_at, content) values ($1, $2, $3, $4, $5)`;
        await pool.query(getPointHistoryQuery, [user_id, point, "적립", new Date(), content]);

    } catch (except) {
        return res.status(400).json({});
    };

    return res.status(200).json({
        message: "정상적으로 적립되었습니다.",
    });
}

const usePoint = async (req, res) => {
    console.log("this is point/consume");
    const user_id = req.user_id;
    const content = req.body.content;
    const point = req.body.point;

    try {
        // 포인트 차감
        const getPointQuery = `select point from public.user where id = $1`
        const getPointRows = await pool.query(getPointQuery, [user_id]);
        const query_result1 = getPointRows.rows[0];

        const original_point = query_result1.point;
        const updatedPoint = original_point - point;

        const updatePointQuery = `update public.user set point = $1 where id = $2`;
        await pool.query(updatePointQuery, [updatedPoint, user_id]);

        // 포인트 사용 내역 추가
        const getPointHistoryQuery = `insert into public.history (user_id, point, type, created_at, content) values ($1, $2, $3, $4, $5)`;
        await pool.query(getPointHistoryQuery, [user_id, point, "사용", new Date(), content]);

    } catch (except) {
        return res.status(400).json({});
    };

    return res.status(200).json({
        message: "정상적으로 포인트를 사용하였습니다.",
    });
}

router.get('/remain', lc.verifyToken, pointRemain);
router.get('/history/get', lc.verifyToken, pointGetHistory);
router.get('/history/consume', lc.verifyToken, pointUseHistory);
router.post('/get/:user_id', getPoint);
router.post('/consume', lc.verifyToken, usePoint);

module.exports = router;