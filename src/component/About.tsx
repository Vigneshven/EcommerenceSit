import Account from "./Account"
import Header from "./Header"

function About() {
    return (
        <div>
            <div>
                <Account />
                <Header />
            </div>
            <div className="w-full max-w-7xl px-6 mx-auto mt-20 flex flex-col items-center gap-15">
                <p className="text-6xl text-text-light font-bold">We love 
                    <span className="bg-primary ml-3 p-3 rounded-2xl text-4xl w-5.5xl text-text-light-bold">comfy</span></p>
                <p className=" text-lg text-text-light">
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