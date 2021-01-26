const express = require('express');
const router = express.Router();
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require("../models/Subscriber"); // MongoDB에 저장하기위해 모델 import

//=================================
//             Subscribe
//=================================

//구독 정보 가져오기 _ 구독자수
router.post('/subscribeNumber', (req, res) => {
    
    Subscriber.find({ 'userTo': req.body.userTo })
        .exec((err, subscribe) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({success: true, subscribeNumber: subscribe.length})
        })

})

//구독 정보 가져오기 _구독여부
router.post('/subscribed', (req, res) => {
    
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
        .exec((err, subscribe) => {
            if(err) return res.status(400).send(err);
            let result = false
            if(subscribe.length !== 0){
                result = true
            }
            res.status(200).json({success: true, subscribed: result})
        })

})

// 구독 취소
router.post('/unSubscribe', (req, res) => {
    
    Subscriber.findOneAndDelete({userTo: req.body.userTo, userFrom: req.body.userFrom})
        .exec((err, doc) => {
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true, doc})
        })

});

// 구독
router.post('/subscribe', (req, res) => {
    
    const subscribe = new Subscriber(req.body);
    subscribe.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })

})

module.exports = router;
