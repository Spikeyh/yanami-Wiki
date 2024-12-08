import './AI.css'
import Header from './Header';
import React, { useState, useEffect } from 'react';

export default function AI() {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showElements, setShowElements] = useState(true);

    const submitQuery = () => {
        if (query) {
            const trimmedQuery = query.trim();
            setHistory((prevHistory) => [...prevHistory, { role: 'user', content: trimmedQuery }]);
            setQuery(''); // 清空输入框
            setLoading(true);

            // 修改为新的API路径
            fetch('http://127.0.0.1:5000/AIchat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'query=' + encodeURIComponent(trimmedQuery)
            })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                // 只添加AI的回复到历史记录
                setHistory((prevHistory) => [...prevHistory, { role: 'assistant', content: data.response }]);
                setShowElements(false); // 隐藏预设元素
            })
            .catch(error => {
                setLoading(false);
                console.error('Error:', error);
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // 阻止默认行为，如换行等
          submitQuery();
        }
    };
    
    return (
        <>
            <Header />
                <div className="AIBody">
                    <div className="AIBodyInner">
                    <div className="AIChatContainer">
                        {showElements ? (
                            <div className="preView">
                                <div className="articleYanami"><img className="articleYanamiImage" src="/chisaiyanami.png"/>
                                <p className="articleYanamiTitle">八奈见杏菜</p></div>
                                <div className="articleYanamiText">    石蕗高中一年生,和谁都可以变成好朋友的开朗女子。每天都会给你带来新资讯哦！</div>
                            </div>
                        ):(<>
                            {loading && (<div id="AILoading"><div className="AILoader">Loading...</div></div>)}
                    <div className="AIChatHistory" id="chatHistory">
                        {history.map((entry, index) => (
                            <div key={index}>
                                {`${entry.role === 'user' ? '用户: ' : 'AI: '}${entry.content}`}
                            </div>
                        ))}
                    </div>
                    </>
                    )}
                    </div>
                    <form id="chatForm" onSubmit={e => { e.preventDefault(); submitQuery(); }}>
                        <div className="AIInputContainer">
                        <textarea
                            className="AIInput"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="继续对话..."
                            id="userQuery"
                            rows="4" // 你可以根据需要设置行数
                        />
                        <button className="AIButton" type="submit">发送</button></div>
                    </form>
                    </div>
                </div>
        </>
    );
}
