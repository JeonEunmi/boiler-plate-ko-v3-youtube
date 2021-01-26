const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like"); // MongoDB에 저장하기위해 모델 import
const { Dislike } = require("../models/Dislike"); // MongoDB에 저장하기위해 모델 import

//=================================
//             Like
//=================================

router.post('/getLikes', (req, res) => {
    
    let variable = {}

    if(req.body.videoId){
        variable = {videoId : req.body.videoId}
    }else{
        variable = { commentId : req.body.commentId}
    }

    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success: true, likes})
        })

})

//=================================
//             Dislike
//=================================

router.post('/getDislikes', (req, res) => {
    
    let variable = {}

    if(req.body.videoId){
        variable = {videoId : req.body.videoId}
    }else{
        variable = { commentId : req.body.commentId}
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success: true, dislikes})
        })

})

router.post('/upLike', (req, res) => {
    
    let variable = {}

    if(req.body.videoId){
        variable = {videoId : req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId : req.body.commentId, userId : req.body.userId}
    }

    // like collection에 클릭정보삽입
    const like = new Like(variable)

    like.save((err, likeResult) => {
        if(err) return res.json({success: false, err})

        // 만약 dislike에 클릭이 되어있다면 dislike 1 줄이기
        Dislike.findOneAndDelete(variable)
            .exec((err, dislikeResult) => {
                if(err) return res.status(400).json({success: false, err})
                res.status(200).json({success: true})
            })
        })

    })
    
router.post('/unLike', (req, res) => {
    
    let variable = {}
    
    if(req.body.videoId){
        variable = {videoId : req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId : req.body.commentId, userId : req.body.userId}
    }
    
    Like.findOneAndDelete(variable)
    .exec((err, result) => {
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
        })
        
    })
    

router.post('/upDislike', (req, res) => {
    
    let variable = {}

    if(req.body.videoId){
        variable = {videoId : req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId : req.body.commentId, userId : req.body.userId}
    }

    // Dislike collection에 클릭정보삽입
    const dislike = new Dislike(variable)

    dislike.save((err, dislikeResult) => {
        if(err) return res.json({success: false, err})

        // 만약 like에 클릭이 되어있다면 like 1 줄이기
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if(err) return res.status(400).json({success: false, err})
                res.status(200).json({success: true})
            })
        })

    })
    
router.post('/unDislike', (req, res) => {
    
    let variable = {}
    
    if(req.body.videoId){
        variable = {videoId : req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId : req.body.commentId, userId : req.body.userId}
    }
    
    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
        })
        
    })
    
    module.exports = router;
    