import useShopStore from "@/zustandStore/ShopStore";

function ColorSelector() {
  const selectedColor = useShopStore((state) => state.selectedColor);

  const setSelectedColor = useShopStore((state) => state.setSelectedColor);

  const colors = [
    { name: "pink", circleColor: "bg-pink" },
    { name: "green", circleColor: "bg-green" },
    { name: "yellow", circleColor: "bg-yellow" },
    { name: "red", circleColor: "bg-red" },
    { name: "blue", circleColor: "bg-blue" },
  ];
  return (
    <div className="flex gap-3">
      {colors.map((color) => {
        return (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.name)}
            className={`h-8 w-8 rounded-full ${color.circleColor} ${
              selectedColor === color.name ? "ring-2 ring-heading" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

export default ColorSelector;
