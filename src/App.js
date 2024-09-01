import Header from './Header'; // 确保路径正确
import HomePageBody from './HomePageBody'; 


export default function App(){
  return (
    <div>
      <Header /> {/* 使用Header组件 */}
      <HomePageBody /> 
    </div>
  );
};