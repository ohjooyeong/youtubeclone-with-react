import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
    const videoId = props.postId;
    const user = useSelector((state) => state.user);
    const [commentValue, setcommentValue] = useState("");

    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId,
        };
        axios.post("/api/comment/saveComment", variables).then((response) => {
            if (response.data.success) {
                props.refreshFunction(response.data.result);
                setcommentValue("");
            } else {
                alert("댓글을 저장하지 못했습니다.");
            }
        });
    };

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />
            {/* Comment Lists */}
            {props.commentLists &&
                props.commentLists.map(
                    (comment, index) =>
                        !comment.responseTo && (
                            <React.Fragment key={index}>
                                <SingleComment
                                    refreshFunction={props.refreshFunction}
                                    comment={comment}
                                    postId={videoId}
                                />
                                <ReplyComment
                                    refreshFunction={props.refreshFunction}
                                    commentLists={props.commentLists}
                                    parentCommentId={comment._id}
                                    postId={videoId}
                                />
                            </React.Fragment>
                        )
                )}

            {/* Root Comment Form */}
            <form style={{ display: "flex", marginTop: "18px" }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: "100%", borderRadius: "5px" }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="댓글을 작성해주세요"
                />
                <br />
                <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Comment;
