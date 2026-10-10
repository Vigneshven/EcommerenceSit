import FeaturedProduct from "./FeaturedProduct"

function Main() {
    return (
        <>
            <div className="flex flex-1 justify-center items-center p-4">

                <div className=" flex flex-col items-start gap-10">
                    <p className="w-full font-extrabold text-text-light text-5xl ml-75">
                        We are changing <br />the way people <br />shop
                    </p>

                    <p className="w-full  text-text-light ml-75">Lorem ipsum, dolor sit amet consectetur adipisicing elit.<br />
                        Tempore repellat explicabo enim soluta temporibus asperiores <br />aut obcaecati perferendis porro nobis.</p>

                    <button className="bg-primary text-text-light font-bold rounded-2xl p-4 ml-75">OUR PRODUCTS</button>
                </div>
                <div className="mt-10 ml-auto mr-85 flex w-1/3 gap-3 bg-primary-dark rounded-3xl">

                    <img
                        className=" border-8  rounded-3xl h-110 min-w-0 flex-7 object-cover"
                        src="https://react-vite-comfy-store-v2.netlify.app/assets/hero1-deae5a1f.webp"
                        alt="sofa"
                    />

                    <img
                        className="border-b-8 border-l-8 border-t-8 rounded-3xl h-110 min-w-0 flex-3 object-cover"
                        src="https://react-vite-comfy-store-v2.netlify.app/assets/hero2-2271e3ad.webp"
                        alt="sofa"
                    />
                </div>
            </div>

            <div className="mt-8">

                <FeaturedProduct />


            </div>


        </>
    )
}

export default Main