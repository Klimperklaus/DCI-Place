import Parallax from "../utilities/Parallax.jsx";
import "../styles/Home.scss";

const Home = () => {
  return (
    <div className="wrapper flex justify-center items-center w-full h-full">
      <Parallax />
      {/* <div className="flex flex-col justify-center items-center w-3/4 h-3/4 border border-black absolute">
        <h1>hello</h1>
        <p>was ne sau</p>
      </div> */}
    </div>
  );
};

export default Home;
