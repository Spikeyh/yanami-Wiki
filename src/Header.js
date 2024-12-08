import './Header.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function Avatar({defaultSrc}) {

  const [src,setSrc] = useState(defaultSrc);

  const { animeID } = useParams();
  const animeIDInt=parseInt(animeID);//console.log(animeID);
  //const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);





/*useEffect(() => {
        axios.get(`http://up96905vw026.vicp.fun:10840/resources`)
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
}*/
  
  const handleImageUpload = (newSrc) => {
    setSrc(newSrc);
};



  const style={
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '1px solid #BEBEBE ',
    backgroundImage: `url(${src})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    marginRight: '10px',
    marginTop: '5px'
  }
  return(
    <div className="avatar" style={style}></div>
  );
}

export default function Header() {
  return(
<nav className="navBar">
  <img className="yanamiLogo" src=
  "/yanami.png" alt='Yanami logo'/>
  <a className="yanamiTitle">Yanami</a>
    <ul className="navLinks">
      <li><a href="/">主页</a></li>
      <li><a href="/mention">社区</a></li>
      <li><a href="/anime/0">资源分享</a></li>
      <li><a href="/AI">AI</a></li>
    </ul>
    <div className="searchBox">
    <form>
      <input 
        type='text' 
        
        placeholder="Enter anime ID..."/>
      <button type='submit'>
        搜索
      </button>
    </form>
    </div>
    <div  className="avatar">
    <a href="/profile"><Avatar  defaultSrc="https://img.moegirl.org.cn/moehime.jpg" /></a>
    </div>
</nav>
  );
}