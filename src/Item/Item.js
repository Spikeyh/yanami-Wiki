import React from 'react';
import Header from'../Header';
import {useParams}from 'react-router-dom';
import {useEffect,useState} from 'react';
import axios from 'axios';
import './Item.css';
import CircleCard from '../Card/CircleCard';
import community from '../image/community.svg';
import StarRating from'./StarRating';

const mockAnimeData=[
    {
        "animeID":0,
        "title":'败犬女主太多了',
        "cover":'https://lain.bgm.tv/pic/cover/l/e4/dc/464376_NsZRw.jpg?_gl=1*1no9ony*_ga*MTM1MzU4MzM4LjE3MTYxMDM4NTI.*_ga_1109JLGMHN*MTcyNTE5MTQ0My4zNC4xLjE3MjUxOTE0NTEuMC4wLjA.',
        "introduction":"没能赢得心上人恋情的女孩——“败犬女主”。\n爱吃的青梅竹马系女主·八奈见杏菜。\n活力充沛的运动系女主·烧盐柠檬。\n怕生的小动物系女主·小鞠知花。\n被有点缺憾的败犬女主——败女们环绕，新感觉、乱糟糟的败走系青春故事就此揭幕。因失败而更加闪耀吧，败女们！",
        "staff":['原作：雨森たきび','监督：北村翔太郎'],
        "characters":['八奈见杏菜\ncv:远野光','烧盐柠檬','小鞠知花'],
        "sources":'https://www.bilibili.com/video/BV1LmYxekEMf?p=2&vd_source=a288e17fbeba900282e10cb7e813c60f',
        "pv":" //player.bilibili.com/player.html?isOutside=true&aid=1501968818&bvid=BV1MD42177Pu&cid=1472905046&p=1" ,
        "op":"//player.bilibili.com/player.html?isOutside=true&aid=112926216162646&bvid=BV1LmYxekEMf&cid=500001642552262&p=1",
        "ed":'',
        "ratings":9.2
    }
]


export default function Item(){
    const { animeID } = useParams();
    const animeIDInt=parseInt(animeID);//console.log(animeID);
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //const anime = mockAnimeData[animeIDInt];
    //const animeData=getAnimeData(animeId);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/resources`)
            .then((response) => {
                const selectedAnime = response.data.find(anime => anime.animeID === animeIDInt);
                setAnime(selectedAnime || mockAnimeData.find(anime => parseInt(anime.animeID, 10) === animeIDInt));
                setLoading(false);
            })
            .catch((error) => {
                setError('Failed to fetch data.');
                setLoading(false);
            });
    }, [animeIDInt]);

    if (loading) {
        return <div>Loading...</div>;
    }


  if (error) {
    return <div>{error}</div>;
}

if (!anime) {
    return <div>No data available for this anime.</div>;
}

    const backgroundStyle = {
        backgroundImage: `url(${anime.cover})`,
        backgroundSize: 'stretch',
        backgroundPosition: 'center',
        zIndex: -3,
        position:'fixed, left: 0px, top: 0px, right: 0px, bottom: 0px',
        width: '100%', // 添加模糊效果
    };
    
    //用于换行
    const renderIntroduction = (introduction) => {
        return introduction.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));
    };


    return (
        <div>
            <Header/>
                <div className="itemBody">
                    <div className="itemBodyInner">
                        <div className="itemTopRec"  style={backgroundStyle}>
                            <div className="itemTopRecInner">
                                <img className="itemImg" src={anime.cover} alt={`Cover for ${anime.title}`} style={{ width: 'auto', height: '350px' }} />
                                <div className="itemTopRightContent">
                                    <div className="itemTopMidContent">
                                        <div className="itemTitle">{anime.title}<p className="itemTitleRecBottom"></p></div>
                                        <div className="itemIntroduction"><CircleCard src="" fontFamily={"comic"}>Introduction</CircleCard>
                                        <div className="itemIntroductionContent">{renderIntroduction(anime.introduction)}</div>
                                        </div>
                                    </div>
                                    <div className="itemTopRightRightContent">
                                        <div className="bangumi">
                                            Bangumi评分：
                                        </div>
                                        <div className="itemRating">{anime.ratings}<StarRating score={anime.ratings} /></div>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <div className="itemContent">
                            <div className="itemLeftContent">
                            <div className="PVRec"><div className="PVTitle">PV</div>
                            <div className="PVTitleBottom"/>
                            <div className="PVContent">
                                <iframe className="PVFrame" src={anime.pv}></iframe>
                            </div>
                            </div>

                            <div className="OPRec"><div className="OPTitle">OP/ED</div>
                            <div className="OPTitleBottom"/>
                            <div className="OPContent">
                                <iframe className="OPFrame" src={anime.op}></iframe>
                            </div>
                            </div>

                            <div className="sourcesRec">
                            <div className="sourcesTitle">Sources</div>
                                <div className="sourcesTitleBottom"/>
                                <div className="sourcesContent" >{anime.sources}</div>
                            </div>
                            
                            </div>
                            <div className="itemRightContent">
                                <CircleCard src={community} fontFamily={"comic"}className="staff">Staff</CircleCard>
                                    <ul className="staffList">
                                        {anime.staff.map((name, index) => (
                                        <li key={index}>{name}</li>
                                        ))}
                                    </ul>
                                <CircleCard src={community} fontFamily={"comic"}className="characters">Characters</CircleCard >
                                    <ul className="characterList">
                                        {anime.characters.map((name, index) => (
                                        <li key={index}>{name}</li>
                                        ))}
                                    </ul>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}