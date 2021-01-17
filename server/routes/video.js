const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(
//     "C:Users\brb11\ffmpeg-4.3.1-2021-01-01-full_build\ffmpeg-4.3.1-2021-01-01-full_build\bin\\ffmpeg.exe"
// );
// ffmpeg.setFfprobePath(
//     "C:Users\brb11\ffmpeg-4.3.1-2021-01-01-full_build\ffmpeg-4.3.1-2021-01-01-full_build\bin\\ffprobe.exe"
// );

//=================================
//             Video
//=================================

var storage = multer.diskStorage({
    // 업로드폴더 지정
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    // 파일네임 정하기
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    // 파일필터 정하기
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".mp4") {
            return cb(res.status(400).end("only mp4 is allowed"), false);
        }
        cb(null, true);
    },
});

var upload = multer({ storage: storage }).single("file");

router.post("/uploadfiles", (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
});

router.post("/getVideoDetail", (req, res) => {
    Video.findOne({ _id: req.body.videoId })
        .populate("writer")
        .exec((err, videoDetail) => {
            // console.log(videoDetail);
            if (err) return res.status(400).send(err);
            return res.status(200).json({
                success: true,
                videoDetail,
            });
        });
});

router.get("/getVideos", (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.
    // populate를 해줘야 writer의 모든 정보를 가져올 수 있다.
    Video.find()
        .populate("writer")
        .exec((err, videos) => {
            console.log(videos);
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos });
        });
});

router.post("/thumbnail", (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임도 가져오기

    let filePath = "";
    let fileDuration = "";

    console.log(req.body);

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    });

    // 썸네일 생성
    ffmpeg(req.body.url)
        .on("filenames", function (filenames) {
            console.log("Will generate" + filenames.join(", "));
            console.log(filenames);

            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on("end", function () {
            console.log("Screenshots taken");
            return res.json({
                success: true,
                url: filePath,
                fileDuration: fileDuration,
            });
        })
        .on("error", function (err) {
            console.log(err);
            return res.json({ success: false, err });
        })
        .screenshots({
            count: 3,
            folder: "uploads/thumbnails",
            size: "320x240",
            //'%b': input basename (filename w/o extension)
            filename: "thumbnail-%b.png",
        });
});

router.post("/uploadVideo", (req, res) => {
    // 비디오 정보들을 저장한다.
    const video = new Video(req.body);
    video.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});

module.exports = router;
