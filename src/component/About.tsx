import Account from "./Account"
import Header from "./Header"

function About() {
    return (
        <div>
            <div>
                <Account />
                <Header />
            </div>
            <div className="flex flex-1 flex-col gap-15 mt-14 items-center">
                <p className="text-5xl font-extrabold text-shadow-black">We love 
                    <span className="bg-blue-400 p-3 rounded-2xl text-white">comfy</span></p>
                <p className="text-1 font-bold">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br />
                    Tempore quae quam blanditiis vitae, dolor non eveniet ipsum voluptatibus,<br />
                    quia optio aut! Perferendis ipsa cumque ipsam nostrum <br />
                    reprehenderit ad illo sed officiis ea tempore! Similique eos minima sit porro, ratione aspernatur!
                </p>
            </div>
        </div>
    )
}

export default About