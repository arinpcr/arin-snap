import Card from "./Card";
import Button from "./Button";

export default function ProductCard({ image, title, price }) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <img src={image} className="w-full h-40 object-cover rounded-2xl mb-4" />
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-orange-500 font-black mb-4">${price}</p>
      <Button type="primary" className="w-full">View Details</Button>
    </Card>
  );
}