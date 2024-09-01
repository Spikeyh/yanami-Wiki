import './Header.css';
import { useState } from 'react';

function Avatar({defaultSrc}) {

  const [src,setSrc] = useState(defaultSrc);

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
  <img className="logo" src=
  "yanami.png" alt='Yanami logo'/>
  <a className="title">Yanami</a>
    <ul className="navLinks">
      <li><a href="https://www.baidu.com">主页</a></li>
      <li><a href="https://www.baidu.com">社区</a></li>
      <li><a href="https://www.baidu.com">资源分享</a></li>
      <li><a href="https://www.baidu.com">AI</a></li>
    </ul>
    <div className="searchBox">
    <form>
      <input 
        type='text' 
        placeholder='想找什么？'
        aria-label="Search"/>
      <button type='submit'>
        搜索
      </button>
    </form>
    </div>
    <div className="avatar">
    <Avatar defaultSrc="https://img.moegirl.org.cn/moehime.jpg" />
    </div>
</nav>
  );
}