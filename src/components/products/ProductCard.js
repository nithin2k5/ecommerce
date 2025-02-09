import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../features/cartSlice';
import '../../styles/ProductCard.css';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { id, name, price, image, description } = product;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card">
      <Link to={`/product/${id}`}>
        <img className="product-image" src={image} alt={name} />
      </Link>
      <h3>{name}</h3>
      <p>{description}</p>
      <p className="price">${price}</p>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard; 