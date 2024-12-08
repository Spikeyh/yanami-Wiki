import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Profile from './pages/Profile'; 
import Mention from './pages/Mention';
import Header from './Header'; // 确保路径正确
import HomePageBody from './HomePageBody'; 
import Item from './Item/Item';
import Article from './Article/Article';
import News from './Article/News';
import AI from './AI';
import React from 'react';



export default function App(){
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePageBody />} />
        <Route path="/anime/:animeID" element={<Item/>}/>
        <Route path="/article" element={<News/>}/>
        <Route path="/article/:articleId" element={<Article/>}/>
        <Route path="/AI" element={<AI/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mention" element={<Mention/>} />
        
      </Routes>
    </Router>
  );
};