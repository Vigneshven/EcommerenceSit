function Main() {
    return (
        <div className="flex items-center justify-between gap-6 p-4">

            <div className=" flex flex-col items-start gap-10">
                <p className="w-full font-extrabold text-cyan-900 text-5xl ml-75">
                    We are changing <br/>the way people <br/>shop
                </p>

                <p className="w-full font-extrabold text-cyan-950 ml-75">Lorem ipsum, dolor sit amet consectetur adipisicing elit.<br/>
                    Tempore repellat explicabo enim soluta temporibus asperiores <br/>aut obcaecati perferendis porro nobis.</p>

                <button className="bg-blue-400 rounded p-2 ml-75">OUR PRODUCTS</button>
            </div>
            <div className="w-1/3 mt-10 mr-67">
                <img className="w-80 h-90 rounded-2xl" src="https://react-vite-comfy-store-v2.netlify.app/assets/hero1-deae5a1f.webp" alt="sofa" />
            </div>
        </div>
    )
}

export default Main