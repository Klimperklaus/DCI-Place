import Parallax from "../utilities/Parallax.jsx";
import "../styles/Home.scss";

const Home = () => {
  return (
    <div className="wrapper flex justify-center items-center w-full h-full">
      <Parallax />
      <div className="flex flex-col justify-center items-center w-3/4 h-3/4 border border-black absolute pointer-events-none">
        <h1>hello</h1>
        <p>was ne sau</p>
        <button className="bg-red-600 p-3 hover:bg-blue-500 pointer-events-auto">
          Hallo
        </button>
      </div>
    </div>
  );
};

export default Home;
