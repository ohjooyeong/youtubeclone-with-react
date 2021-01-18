import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId;
    const videoVariable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([]);
    const [Comments, setComments] = useState([]);

    useEffect(() => {
        axios.post("/api/video/getVideoDetail", videoVariable).then((response) => {
            if (response.data.success) {
                setVideoDetail(response.data.videoDetail);
            } else {
                alert("비디오 정보를 가져오는 것을 실패했습니다.");
            }
        });
        axios.post("/api/comment/getComments", videoVariable).then((response) => {
            if (response.data.success) {
                setComments(response.data.comments);
            } else {
                alert("댓글 정보를 가져오는 것을 실패했습니다.");
            }
        });
    }, []);

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment));
    };

    if (VideoDetail.writer) {
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem("userId") && (
            <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem("userId")} />
        );
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div style={{ width: "100%", padding: "3rem 4rem" }}>
                        <video
                            style={{ width: "100%" }}
                            src={`http://localhost:5000/${VideoDetail.filePath}`}
                        />
                        <List.Item actions={[subscribeButton]}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={VideoDetail.writer && VideoDetail.writer.image} />
                                }
                                title={VideoDetail.title}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        {/* Comment */}
                        <Comment
                            refreshFunction={refreshFunction}
                            commentLists={Comments}
                            postId={videoId}
                        />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        );
    } else {
        return <div>Loading</div>;
    }
}

export default VideoDetailPage;
