import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import axios from 'axios';

function LikeDislikes(props) {

    let variable = {}

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null)
    
    if(props.video) {
        variable = {video: props.videoId, userId : props.userId}
    }else{
        variable = {commentId : props.commentId, userId: props.userId}
    }

    useEffect(() => {
        
        axios.post('/api/like/getLikes', variable)
            .then(response=> {
                if(response.data.success){
                    
                    // 얼마나 많은 좋아요를 받았는가?
                    setLikes(response.data.likes.length)

                    // 내가 이미 좋아요를 눌렀는가?
                    response.data.likes.map(like => {
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    })
                }else{
                    alert('Likes에 정보를 가져오지 못했습니다.')
                }
            })
                
            axios.post('/api/like/getDislikes', variable)
                .then(response=> {
                    if(response.data.success){
                        
                        // 얼마나 많은 싫어요를 받았는가?
                        setDislikes(response.data.dislikes.length)
                        
                        // 내가 이미 싫어요를 눌렀는가?
                        response.data.dislikes.map(dislike => {
                            if(dislike.userId === props.userId){
                                setDislikeAction('disliked')
                            }
                        })                    
                    }else{
                        alert('Dislikes에 정보를 가져오는데 실패하였습니다.')
                    }
                })

    }, [])

    const onLike = () => {
        if(LikeAction === null){
            axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success){
                        setLikes(Likes + 1)
                        setLikeAction('liked') // 아이콘 까맣게

                        if(DislikeAction !== null){
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }
                    }else{
                        alert('좋아요 실패')
                    }
                })
        }else{
            axios.post('/api/like/unLike', variable)
                .then(response => {
                    if(response.data.success){
                        setLikes(Likes - 1)
                        setLikeAction(null) // 아이콘 까맣게
                    }else{
                        alert('좋아요취소 실패')
                    }
                })
        }
    }

    const onDislike = () => {
        if(DislikeAction === null){
            axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if(response.data.success){
                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked') // 아이콘 까맣게

                        if(LikeAction !== null){
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }
                    }else{
                        alert('싫어요 실패')
                    }
                })
        }else{
            axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if(response.data.success){
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null) // 아이콘 까맣게
                    }else{
                        alert('좋아요취소 실패')
                    }
                })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip tilte="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ?  'filled' : 'outlined'}
                        onClick={onLike}
                        />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto'}}> {Likes} </span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-like">
                <Tooltip tilte="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ?  'filled' : 'outlined'}
                        onClick={onDislike}
                        />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto'}}> {Dislikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
