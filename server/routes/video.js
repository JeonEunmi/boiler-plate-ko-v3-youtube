const express = require('express');
const router = express.Router();
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const { Video } = require("../models/Video"); // MongoDB에 저장하기위해 모델 import
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); //동영상 저장경로
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); //파일명
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, ture);
    }
});

const upload = multer({ storage: storage }).single("file");

router.post('/uploadfiles', (req, res) => {
    
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({success: false, err})
        }else{
            return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
        }
    })

})

router.post('/thumbnail', (req, res) => {

    //썸네일 생성 후 비디오 러닝타임 정보 가져오기
    let filePath ="";
    let fileDuration ="";

    // 러닝타임 정보 생성
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) { // 썸네일 파일명 생성
            console.log('Will generate ' + filenames.join(', '))
            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () { // 썸네일 생성 후 처리
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration}) //fileDuration -> 러닝타임 정보
        })
        .on('error', function (err){ // 썸네일 에러 시 행동
            console.error(err);
            return res.json({success: false, err});
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3, // 썸네일 3개찍기
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });


})

router.post('/uploadVideo', (req, res) => {

    //비디오 정보들을 저장한다.
    const video = new Video(req.body) 

    video.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })
})

router.get('/getVideos', (req, res) => {
    
    //비디오를 DB에서 가져와서 클라이언트에 보내주기
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err)
                res.status(200).json({success: true, videos})
            })

})

router.post('/getVideoDetail', (req, res) => {
    
    Video.findOne({"_id" : req.body.videoId })
    .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success: true, videoDetail})
        })

})


router.post('/getSubscriptionVideos', (req, res) => {
    
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({userFrom: req.body.userFrom})
            .exec((err, subscriberInfo) => {
                if(err) return res.status(400).send(err)

                let subscribedUser = [];

                subscriberInfo.map((subscriber, i) => {
                    subscribedUser.push(subscriber.userTo);
                })

                // 찾은 사람들의 비디오를 가지고 온다.
                Video.find({ writer : { $in : subscribedUser }}) // 여러명을 넘겨줄때 사용
                    .populate('writer')
                    .exec((err, videos) => {
                        if(err) return res.status(400).send(err);
                        res.status(200).json({success: true, videos})
                    })

            })


})
    
module.exports = router;
