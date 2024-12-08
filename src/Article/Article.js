import Header from '../Header';
import {useEffect,useState} from 'react';
import {useParams}from 'react-router-dom';
import "./Article.css";
import axios from 'axios';
import weeks from '../image/weeks.svg';
import like from "../image/like.svg";

const mockArticle = [
    {
        "articleId": 0,
        "title": "123",
        "authorId": "1",
        "cover": "123",
        "image": "http//examples.com",
        "likeCount": 5,
        "publishDate": "2024-09-01T00:00:00",
        "tags": "\"NONE\"",
        "url": "《新世纪福音战士 ANIMA》（日语：エヴァンゲリオン ANIMA）是日本电视动画《新世纪福音战士》的官方衍生小说作品，于杂志《电撃HOBBY》2008年1月号起开始连载，2013年4月号完结，先后由阴山琢磨与山下育人执笔。"
    },
    {
        "articleId": 1,
        "title": "123",
        "authorId": "1",
        "cover": "123",
        "image": "http//examples.com",
        "likeCount": 1,
        "publishDate": "2024-09-01T00:00:00",
        "tags": "\"NONE\"",
        "url": "《新世纪福音战士 ANIMA》（日语：エヴァンゲリオン ANIMA）是日本电视动画《新世纪福音战士》的官方衍生小说作品，于杂志《电撃HOBBY》2008年1月号起开始连载，2013年4月号完结，先后由阴山琢磨与山下育人执笔。"
    },
]

export default function Article() {
    const {articleId}=useParams();
    const articleIdInt=parseInt(articleId);
    const[article,setArticle]=useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeCount, setLikeCount] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    //const article=mockArticle[articleIdInt];

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/articles`)
            .then((response) => {
                const selectedArticle = response.data.find(article => article.articleId === articleIdInt);
                setArticle(selectedArticle);
                setLoading(false);
            })
            .catch((error) => {
                setError('Failed to fetch data.');
                setLoading(false);
            });
    }, [articleIdInt]);

    if (loading) {
        return <div>Loading...</div>;
    }


  if (error) {
    return <div>{error}</div>;
}

if (!article) {
    return <div>No data available for this article.</div>;
}
    const toggleLike = () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount((prevCount) => newIsLiked ? prevCount + 1 : prevCount - 1);

        // 更新点赞数
        axios.post(`/articles/like/${article.articleId}`).then((response) => {
            console.log('Like updated on server');
        }).catch((error) => {
            console.error('Error updating like count:', error);
            setIsLiked(!newIsLiked);
            setLikeCount((prevCount) => newIsLiked ? prevCount - 1 : prevCount + 1);
        });
    };


    return(
        <>
            <Header/>
            <div className="body">
                <div className='articleContent'>
                    <div className="articleLeftContent">
                        <div className="articleTitleTagRec">
                            <div className="articleTitleTag">老八快讯</div>
                        </div>
                        <p className="articleTitle">{article.title}</p>
                        <div className="articleTimeStamp">
                            <p className="articlePublishDate"><img className="articlePublishDateImg" src={weeks} />{new Date(article.publishDate).toLocaleDateString()}</p>
                        </div>
                        <div className="articleInnerContent">
                            {article.image}{article.url}
                        </div>
                        <div className="articleFooter">
                        <div className="articleLike" onClick={toggleLike}>
                        <img src={like} alt="like" style={{ transform: isLiked ? 'scale(1.2)' : 'scale(1)' }} />
                        <span className="articleLikeCount">{likeCount}</span>

                        </div>
                        </div>
                    </div>
                    <div className="articleRightContent">
                        <div className="articleStickyContent">
                            <div className="articleYanami">
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