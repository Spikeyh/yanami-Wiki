import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';

import Header from './Header'; // 确保路径正确
import HomePageBody from './HomePageBody'; 
import Item from './Item/Item';
import Article from './Article/Article';
import React from 'react';



export default function App(){
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePageBody />} />
        <Route path="/anime/:animeID" element={<Item/>}/>
        <Route path="/article/:articleId" element={<Article/>}/>
      </Routes>
    </Router>
  );
};