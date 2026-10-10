import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"


type Inputs = {
    search: string,
    category: "all" | "beds" | "sofa" | "chairs"
    company: "all" | "Homeland" | "flix" | "comfoma"
    sortBy: "a-z" | "z-a" | "low-high" | "high-low"
    free_shipping: boolean
    selling_price: number
}

const schema = z.object({
    search: z.string().min(2, "Enter atleast 2 character"),
    category: z.enum(["all", "beds", "sofa", "chairs"]),
    company: z.enum(["all", "Homeland", "flix", "comfoma"]),
    sortBy: z.enum(["a-z", "z-a", "low-high", "high-low"]),
    free_shipping: z.string(),
    selling_price: z.number(),

})

function ProductFilterForm() {



    const { register, handleSubmit, formState : { errors }, } = useForm<Inputs>({ resolver: zodResolver(schema) })

    const onSubmit = (data: Inputs) => {
        console.log(data)

    }

    return (
        <div className="h-60 mt-10 flex justify-center items-center p-4">

            <form className=" p-10 bg-blue-100 rounded-2xl" onSubmit={handleSubmit(onSubmit)}>

                <div className="flex flex-row flex-wrap gap-x-4 gap-y-6">


                    <div className="basis-[calc(25%-12px)] flex flex-col">
                        <label>Search Product</label>
                        <input className="bg-amber-50 rounded-2xl p-1"{...register("search")} placeholder="search product" />
                        
                        {
                            errors.search && (
                                <span className="text-red-500">
                                    {errors.search.message}
                                </span>
                            )
                        }
                        
                        </div>

                        

                    <div className="basis-[calc(25%-12px)] flex flex-col"><label>Select Category</label>

                        <select className="bg-amber-50 rounded-2xl p-1"{...register("category")}>
                            <option value="all">all</option>
                            <option value="beds">beds</option>
                            <option value="sofa">sofa</option>
                            <option value="chairs">chairs</option>
                        </select></div>

                    <div className="basis-[calc(25%-12px)] flex flex-col"><label>Select Company</label>

                        <select className="bg-amber-50 rounded-2xl p-1"{...register("company")}>
                            <option value="all">all</option>
                            <option value="Homeland">Homeland</option>
                            <option value="flix">flix</option>
                            <option value="comfoma">comfoma</option>
                        </select></div>

                    <div className="basis-[calc(25%-12px)] flex flex-col">
                        <label>SortBy</label>

                        <select className="bg-amber-50 rounded-2xl p-1"{...register("sortBy")}>
                            <option value="a-z">a-z</option>
                            <option value="z-a">z-a</option>
                            <option value="low-high">low-high</option>
                            <option value="high-low">high-low</option>
                        </select></div>

                    <div className="basis-[calc(25%-12px)] flex flex-col"><label>Select Price </label>
                        <input type="range" {...register("selling_price")} /></div>

                    <div className="basis-[calc(25%-12px)] flex flex-col justify-center items-center"><label>Free Shipping</label>
                        <input type="checkbox" {...register("free_shipping")} /></div>


                    <div className="basis-[calc(25%-12px)] flex flex-col justify-center items-center
                 bg-blue-800 text-white rounded-2xl"><button>Search</button></div>

                    <div className="basis-[calc(25%-12px)] flex flex-col justify-center items-center
                 bg-pink-500 text-white rounded-2xl"><button>Reset</button></div>

                </div>

            </form>




        </div>
    )
}

export default ProductFilterForm
