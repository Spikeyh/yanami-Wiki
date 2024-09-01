import './CircleCard.css';
export default function CircleCard({children,src,alt,href}) {
    return(
        <div className="circleCard">
            <img width="25px" src={src} className="soloIcon" alt={alt} /><a className="iconText"  href={href}>{children}</a>
        </div>
    );
}