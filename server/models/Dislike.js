const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dislikeSchema = mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref : 'User'
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref : 'Comment'
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref : 'Video'
    }
   
}, {timestamps: true}) // 만든date와 update date 표시


const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike }