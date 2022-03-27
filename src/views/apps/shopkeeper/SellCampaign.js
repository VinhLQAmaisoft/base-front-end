import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, Label, Input, CardBody, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, FormGroup, Badge } from 'reactstrap';
import { PostServices } from '@services'
import { formatTimeStamp } from '@utils'
import classnames from 'classnames';
import CreatePostTab from '../../components/Tabs/CreatePostTab'
import PostDetailTab from '../../components/Tabs/PostDetailTab'
export default ({ props }) => {
    const [activeTab, setActiveTab] = useState("1")
    const [postList, setPostList] = useState([])
    useEffect(() => {
        PostServices.getPost('?status=1').then(data => { if (data.data?.data) setPostList([...data.data.data]) })
        // let activePost = PostData.filter(post => post.status === 1)
        // setPostList(activePost)
        console.log("Tìm thấy số bài viết = " + postList.length)
    }, [])

    function toggle(tab) {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    function renderNavItem() {
        if (postList.length == 0) return;
        return postList.map(post => {
            console.log("Check Post:", post)
            try {
                return (<NavItem key={post.fb_id}>
                    <NavLink
                        className={classnames({ active: activeTab == post?.fb_id })}
                        onClick={() => { toggle(post?.fb_id); }}
                    >
                        Chiến dịch {formatTimeStamp(post.createAt)}
                    </NavLink>
                </NavItem>)
            } catch (error) {
                console.log("Render Nav Item Failed: ", error)
                console.log("Không thể render: ", post)

            }
        }
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