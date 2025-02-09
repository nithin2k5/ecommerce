import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/layout/Header';
import SubNav from './components/layout/SubNav';
import Footer from './components/layout/Footer';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import CheckoutForm from './components/checkout/CheckoutForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './components/home/HomePage';
import MensFashion from './components/home/MensFashion';
import WomensFashion from './components/home/WomensFashion';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <SubNav />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/mens-fashion" element={<MensFashion />} />
              <Route path="/category/womens-fashion" element={<WomensFashion />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
