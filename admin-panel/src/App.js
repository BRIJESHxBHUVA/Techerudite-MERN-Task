import logo from './logo.svg';
import './App.css';
import { addProduct } from './redux/slice/productSlice';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const handleAddProduct = async () => {
    const productData = {
      name: "Product 1",
      description: "This is product 1",
      quantity: 10,
      categories: ["6a47443dfa2a0ae4d86ab729"]
    }
    const res = await dispatch(addProduct(productData));
  }
  return (
    <div className="App">
      <button onClick={handleAddProduct}>click</button>
    </div>
  );
}

export default App;
