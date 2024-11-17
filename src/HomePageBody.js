import './HomePageBody.css';
import Header from './Header';
import React, { useState, useEffect, useRef,useCallback } from 'react';
import CircleCard from './Card/CircleCard';
import NewsCard from './Card/NewsCard';
import community from './image/community.svg';
import weeks from './image/weeks.svg';
import news from './image/news.svg';
import Carousel from './Carousel';


export default function HomePageBody() {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [scrollIndicatorStyle, setScrollIndicatorStyle] = useState({ marginLeft: '9px' });
    const scrollIndicatorRef = useRef(null); // 添加一个ref来引用weekNavItemScroll元素
    const [weekData, setWeekData] = useState([]);
    const [loading, setLoading] = useState(false);
    /*const [carouselData,setCarouselData]=useState([]);

    useEffect(()=>{
        fetch('')
        .then((response) => response.json())
        .then((data) => setCarouselData(data))
        .catch((error) => console.error('Error fetching carousel data:', error));
    },[]);*/

    useEffect(() => {
        updateScrollIndicator('Monday');
        fetchWeekData('Monday');
    },[]);

    useEffect(() => {
        setLoading(true);
        fetchWeekData(selectedDay).then(() => {
            setLoading(false);
        });
    }, [selectedDay]);

    const handleDayClick = (day) => {
        setSelectedDay(day);
        updateScrollIndicator(day);
    };

    const fetchWeekData = async(day) => {
        try {
            const response = await fetch(`http://wv9679as703.vicp.fun/animes`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const filteredData = data.filter(item => {
                const weekday = new Date(item.release_weekday).toLocaleDateString('en-US', { weekday: 'long' });
                return weekday === day;
            });
            
            setWeekData(filteredData);
            
        } catch (error) {
            console.error('Error fetching week data:', error);
        }
    };
    const updateScrollIndicator = (day) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const index = days.indexOf(day);
        const marginLeft = 10+index * 52; // 假设每个天的宽度是20px
        setScrollIndicatorStyle({ marginLeft: `${marginLeft}px` });
    };

    const getDayStyle = (day) => {
        return {
            cursor: 'pointer',
            color: selectedDay === day ? 'rgba(248,169,202,0.45)' : 'rgb(153, 153, 153)',
        };
    };



    const [articles, setArticles] = useState([]);

    const fetchArticles = useCallback( async () => {
        try {
            const response = await fetch('/api/articles'); // 假设这是获取文章的API
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const processedArticles = data.map(article => ({
                ...article,
                excerpt: getExcerpt(article.content)
            }));
            setArticles(processedArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    },[]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const getExcerpt = (content) => {
        const lines = content.split('\n');
        return lines.slice(0, 3).join('\n')+ '...'; // 取前三行
    };

    return(
        <>
    <Header />
    <div className="body"> 
        <div className="container">
            <div className="mainContent">
                <div className="carouselRec">
                    <div className="carouselImage">
                    {/*{carouselData.length > 0 ? (
                    <Carousel images={carouselData} />
                ) : (
                    <p>Loading...</p>
                )}*/}
                    <Carousel/>
                    </div>
                </div>
                <section className="weekNewsRec">
                    <div className="weekNewsInner">
                        <div className="weekNewsTitle">
                        <CircleCard src={weeks} alt={"weeks"}  href="https://www.baidu.com"fontFamily={"Gabriola"}>
                        每周新番
                        </CircleCard>
                        </div>
                        <div className="weekNewsContent">
                            <div className="weekNavTabs">
                                <div className="weekNav">
                                    <div className="weekNavItem">
                                        <div className="Monday"  style={getDayStyle('Monday')} onClick={() => handleDayClick('Monday')}>周一</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Tuesday"  style={getDayStyle('Tuesday')} onClick={() => handleDayClick('Tuesday')}>周二</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Wednesday"  style={getDayStyle('Wednesday')} onClick={() => handleDayClick('Wednesday')}>周三</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Thursday"  style={getDayStyle('Thursday')} onClick={() => handleDayClick('Thursday')}>周四</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Friday"  style={getDayStyle('Friday')} onClick={() => handleDayClick('Friday')}>周五</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Saturday"  style={getDayStyle('Saturday')} onClick={() => handleDayClick('Saturday')}>周六</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Sunday"  style={getDayStyle('Sunday')} onClick={() => handleDayClick('Sunday')}>周日</div>
                                    </div>
                                </div>
                                <div className="weekNavItemScroll" style={scrollIndicatorStyle} ref={scrollIndicatorRef}></div>
                            </div>
                            <div className="weekNewsListContainer">
                                <div className="weekeNewsListInner">
                                    <div className="preBtn"></div>
                                    <div className="weekNewsListBar">
                                    {loading ? (
                                                <p>Loading...</p>
                                            ) : weekData.length > 0 ? (
                                                weekData.map((item, index) => (
                                                    <div className="weekNewsListCard" key={index}>
                                                        <img className="weekNewsListImg" src={item.cover} alt={item.alt} />
                                                        <p>{item.title}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No data available</p>
                                            )}
                                    </div>
                                    <div className="nextBtn"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="newsRec">
                    <div className="newsInner">
                        <div className="newsTitle">
                        <CircleCard src={news} alt={"news"}  href="https://www.baidu.com" fontFamily={"Gabriola"}>
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
                                excerpt={article.excerpt}
                                publishDate={article.publishDate}
                                authorId={article.authorId}
                            />
                        ))}
                        <NewsCard></NewsCard>
                        </div>
                    </div>
                </section>
            </div>
            <div className="sideContent">
                    <section className="communityRec">
                        <div className="communityInner">
                            <CircleCard src={community} alt={"community"} href="https://www.baidu.com"fontFamily={"Gabriola"}>
                            社区讨论
                            </CircleCard>
                        </div>
                    </section>
            </div>
        </div>
    </div>
    <footer></footer>
    </>  
    );
}