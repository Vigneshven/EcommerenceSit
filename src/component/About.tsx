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
                <p className="text-5xl text-text-light font-bold  text-shadow-black">We love 
                    <span className="bg-primary p-2 rounded-2xl text- text-text-light-bold">comfy</span></p>
                <p className=" text-text-light">
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