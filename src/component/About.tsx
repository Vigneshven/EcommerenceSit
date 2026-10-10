import Account from "./Account"
import Header from "./Header"

function About() {
    return (
        <div>
            <div>
                <Account />
                <Header />
            </div>
            <div className="flex flex-1 flex-col gap-15 mt-20 items-center">
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