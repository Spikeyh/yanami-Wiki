import './StarRating.css'; // 

const StarRating = ({ score }) => {
    const fullStars = Math.floor(score / 2); // 计算完全填充的星形数量
    const halfStar = score % 2 > 0; // 检查是否有半颗星
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // 计算空星形数量
  
    return (
      <div className="star-rating">
        {Array(fullStars).fill().map((_, index) => (
          <i className="fas fa-star text-warning" key={index}></i>
        ))}
        {halfStar && <i className="fas fa-star-half-alt text-warning"></i>}
        {Array(emptyStars).fill().map((_, index) => (
          <i className="fas fa-star text-light" key={fullStars + halfStar + index}></i>
        ))}
      </div>
    );
  };
  
  export default StarRating;