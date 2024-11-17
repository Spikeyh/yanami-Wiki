import Header from '../Header';
import {useEffect,useState} from 'react';
import {useParams}from 'react-router-dom';
import "./Article.css";
import weeks from '../image/weeks.svg';

const mockArticle = [
    {
        "articleId": 0,
        "title": "123",
        "authorId": "1",
        "cover": "123",
        "image": "http//examples.com",
        "likeCount": 0,
        "publishDate": "2024-09-01T00:00:00",
        "tags": "\"NONE\"",
        "url": "《新世纪福音战士 ANIMA》（日语：エヴァンゲリオン ANIMA）是日本电视动画《新世纪福音战士》的官方衍生小说作品，于杂志《电撃HOBBY》2008年1月号起开始连载，2013年4月号完结，先后由阴山琢磨与山下育人执笔。"
    },
    {
        "articleId": 0,
        "title": "123",
        "authorId": "1",
        "cover": "123",
        "image": "http//examples.com",
        "likeCount": 0,
        "publishDate": "2024-09-01T00:00:00",
        "tags": "\"NONE\"",
        "url": "《新世纪福音战士 ANIMA》（日语：エヴァンゲリオン ANIMA）是日本电视动画《新世纪福音战士》的官方衍生小说作品，于杂志《电撃HOBBY》2008年1月号起开始连载，2013年4月号完结，先后由阴山琢磨与山下育人执笔。"
    },
]

export default function Article() {
    const {articleId}=useParams();
    const articleIdInt=parseInt(articleId);
    //const[article,setArticle]=useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const article=mockArticle[articleIdInt];


    /*useEffect(() => {
        axios.get(`http://96eq798wx921.vicp.fun/api/resources`)
            .then((response) => {
                const selectedArticle = response.data.find(article => article.articleId === articleIdInt);
                setarticle(selectedarticle || mockarticleData.find(article => parseInt(article.articleId, 10) === articleIdInt));
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
}*/

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
                            
                        </div>
                    </div>
                    <div className="articleRightContent"></div>
                </div>
            </div>
        </>
    );
}