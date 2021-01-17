import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId;
    const videoVariable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        axios.post("/api/video/getVideoDetail", videoVariable).then((response) => {
            if (response.data.success) {
                console.log(response.data);
                setVideoDetail(response.data.videoDetail);
            } else {
                alert("비디오 정보를 가져오는 것을 실패했습니다.");
            }
        });
    }, []);
    if (VideoDetail.writer) {
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div style={{ width: "100%", padding: "3rem 4rem" }}>
                        <video
                            style={{ width: "100%" }}
                            src={`http://localhost:5000/${VideoDetail.filePath}`}
                        />
                        <List.Item
                            actions={[
                                <Subscribe
                                    userTo={VideoDetail.writer._id}
                                    userFrom={localStorage.getItem("userId")}
                                />,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={VideoDetail.writer && VideoDetail.writer.image} />
                                }
                                title={VideoDetail.title}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        {/* Comment */}
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
