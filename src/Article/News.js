import "./News.css"
import Header from "../Header";
import CircleCard from "../Card/CircleCard";
import NewsCard from '../Card/NewsCard';
import axios from 'axios';
import React, { useState, useEffect} from 'react';
import {useParams}from 'react-router-dom';
import news from '../image/news.svg';



export default function News() {
    const {articleId} = useParams();
    const articleIdInt=parseInt(articleId);
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/articles`)
        .then((response)=>{
            setArticles(response.data); // 设置整个数组
            setLoading(false);
        })
        .catch((error) => {
            setError('Failed to fetch data.');
            setLoading(false);
        });
    }, [articleIdInt]);

    const getExcerpt = (url) => {
        const lines = url.split('\n');
        return lines.slice(0, 2).join('\n')+ '...'; 
    };


    return(
        <>
            <Header/>
            <div className="body">
                <div className="articleContent">
            <div className="articleLeftContent">
            
                    
                        <div className="newsTitle">
                        <CircleCard src={news} alt={"news"} fontFamily={"Gabriola"}>
                        新番资讯
                        </CircleCard>
                        </div>
                        <div className="newsContent">
                        {articles.map((article) => (
                            <NewsCard
                                key={article.articleId}
                                articleId={article.articleId}
                                cover={article.cover}
                                title={article.title}
                                excerpt={getExcerpt(article.url)}
                                publishDate={article.publishDate}
                                authorId={article.authorId}
                            />
                        ))}
                        </div>
            </div>
            <div className="articleRightContent">
                    <div className="articleStickyContent">
                            <div >
                                <img className="articleYanamiImage" src="/chisaiyanami.png"/>
                                <p className="articleYanamiTitle">八奈见杏菜</p>
                                
                            </div>
                            <p className="articleYanamiText">    石蕗高中一年生,和谁都可以变成好朋友的开朗女子。每天都会给你带来新资讯哦！</p>
                        </div>
                    </div>
            </div>
            </div>
        </>
    );
}