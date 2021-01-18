import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        });
        setChildCommentNumber(commentNumber);
        // [] 안에는 이게 바뀔 때마다 useEffect를 다시 실행하라
    }, [props.commentLists]);

    const renderReplyComment = (parentCommentId) =>
        props.commentLists.map((comment, index) => (
            <React.Fragment key={index}>
                {comment.responseTo === parentCommentId && (
                    <div style={{ width: "80%", marginLeft: "40px" }}>
                        <SingleComment
                            comment={comment}
                            postId={props.postId}
                            refreshFunction={props.refreshFunction}
                        />
                        <ReplyComment
                            refreshFunction={props.refreshFunction}
                            commentLists={props.commentLists}
                            parentCommentId={comment._id}
                            postId={props.postId}
                        />
                    </div>
                )}
            </React.Fragment>
        ));
    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments);
    };

    return (
        <div>
            {ChildCommentNumber > 0 && (
                <p style={{ fontSize: "14px", margin: 0, color: "gray" }} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            )}
            {OpenReplyComments && renderReplyComment(props.parentCommentId)}
        </div>
    );
}

export default ReplyComment;
