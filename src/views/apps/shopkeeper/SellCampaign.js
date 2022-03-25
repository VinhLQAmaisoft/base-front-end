import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, Label, Input, CardBody, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, FormGroup, Badge } from 'reactstrap';
import classnames from 'classnames';
import CreatePostTab from '../../components/Tabs/CreatePostTab'
import PostDetailTab from '../../components/Tabs/PostDetailTab'
import { PostData, CommentData, OrderData, ProductData } from '@src/dummyData'
export default ({ props }) => {
    const [activeTab, setActiveTab] = useState("1")
    const [postList, setPostList] = useState([])
    useEffect(() => {
        let activePost = PostData.filter(post => post.status === 1)
        console.log("Tìm thấy số bài viết = " + activePost.length)
        setPostList(activePost)
    }, [])

    function toggle(tab) {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    function renderNavItem() {
        return postList.map(post =>
        (<NavItem key={post.fb_id}>
            <NavLink
                className={classnames({ active: activeTab === post.fb_id })}
                onClick={() => { toggle(post.fb_id); }}
            >
                Chiến dịch {post.createAt.$date.split(".")[0].replace("T", "__")}
            </NavLink>
        </NavItem>)
        )
    }

    function renderTabItem() {
        return postList.map(post =>
            (<PostDetailTab post={post} />)
        )
    }

    return (
        <Card className="p-1">
            <Nav tabs>
                {renderNavItem()}
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        Chiến Dịch Mới
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                {renderTabItem()}
                <CreatePostTab tabId="1" />
            </TabContent>
        </Card>
    );
}