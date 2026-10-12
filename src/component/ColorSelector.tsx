import { useState } from "react"

function ColorSelector() {
    const [selectedColor,setSelectorColor] = useState("pink");

    const colors = [
        {name:"pink",circleColor:"bg-pink"},
        {name:"green",circleColor:"bg-green"},
        {name:"yellow",circleColor:"bg-yellow"},
        {name:"red",circleColor:"bg-red"},
        {name:"blue",circleColor:"bg-blue"},
    ]
  return (
    <div className="flex gap-3">
        {colors.map((color)=>{
            return(
            <button
            key={color.name}
            onClick={()=>setSelectorColor(color.name)}
            className={`h-8 w-8 rounded-full ${color.circleColor} ${
                selectedColor === color.name?"ring-2 ring-black":""}`}
            />)
        })}


    </div>
  )
}

export default ColorSelector