import Parallax from "../utilities/Parallax.jsx"

const Home = () => {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <Parallax />
            <div className="flex flex-col justify-center items-center absolute">
                <h1>hello</h1>
                <p>was ne sau</p>
            </div>
        </div>
    )
}

export default Home;