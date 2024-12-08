import "./NewsCard.css";

export default function NewsCard({ articleId, cover, title, publishDate, authorId,excerpt }) {
    return (
        <a href={`/article/${articleId}`} className="newsCard">
            <img className="cover" src={cover} alt="cover" />
            <div className="content">
                <h3 className="title">{title}</h3>
                <p style={{
                    backgroundColor:"black",
                    width:"100%",
                    height:"2px",
                    borderRadius:"2px",
                }}/>
                <p className="excerpt">{excerpt}</p>
                <p className="author">By Author #{authorId}</p>
                <p className="publishDate">{new Date(publishDate).toLocaleDateString()}</p>
            </div>
        </a>
    );
}