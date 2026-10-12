import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setSelectedColor } from "../redux/shopSlice";

function ColorSelector() {

    const dispatch = useDispatch()

    const selectedColor = useSelector((state:RootState)=>state.shop.selectedColor)

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
            onClick={()=>dispatch(setSelectedColor(color.name))}
            className={`h-8 w-8 rounded-full ${color.circleColor} ${
                selectedColor === color.name?"ring-2 ring-black":""}`}
            />)
        })}


    </div>
  )
}

export default ColorSelector