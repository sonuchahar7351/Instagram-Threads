import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

const UserPage = () => {
  return (
    <>
    <UserHeader/>
    <UserPost likes={1200} replies={421} postImg="/post1.png" postTitle="Let's talk about threads."/>
    <UserPost likes={120} replies={41} postImg="/post2.png" postTitle="Nice tutorial"/>
    <UserPost likes={180} replies={21} postImg="/post3.png" postTitle="I love this guy."/>
    <UserPost likes={1800} replies={210} postImg="/post4.png" postTitle="This is my first Threads."/>
    </>
  )
}

export default UserPage