import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
import SubNav from './components/layout/SubNav';
import Footer from './components/layout/Footer';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import CheckoutForm from './components/checkout/CheckoutForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import HomePage from './components/home/HomePage';
import MensFashion from './components/home/MensFashion';
import WomensFashion from './components/home/WomensFashion';
import MobileProducts from './components/pages/MobileProducts';
import ElectronicsProducts from './components/pages/ElectronicsProducts';
import AppliancesProducts from './components/pages/AppliancesProducts';
import FashionProducts from './components/pages/FashionProducts';
import ProvisionsProducts from './components/pages/ProvisionsProducts';
import LoginForm from './components/auth/LoginForm';
import BusinessDashboard from './components/dashboard/BusinessDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BusinessRegister from './components/auth/BusinessRegister';
import BusinessRegisterForm from './components/auth/BusinessRegisterForm';
import ApiTester from './components/utils/ApiTester';
import TestConnection from './components/auth/TestConnection';

import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
    
          <Header />
          <SubNav />
          <main className="neon-box">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/mens-fashion" element={<MensFashion />} />
              <Route path="/category/womens-fashion" element={<WomensFashion />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={
                <ProtectedRoute roles={['ROLE_USER', 'USER']}>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute roles={['ROLE_USER', 'USER']}>
                  <CheckoutForm />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute roles={['ROLE_USER', 'USER']}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/business-login" element={<LoginForm isBusinessLogin={true} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/category/mobiles" element={<MobileProducts />} />
              <Route path="/category/electronics" element={<ElectronicsProducts />} />
              <Route path="/category/appliances" element={<AppliancesProducts />} />
              <Route path="/category/fashion" element={<FashionProducts />} />
              <Route path="/category/provisions" element={<ProvisionsProducts />} />
              <Route path="/business/dashboard" element={
                <ProtectedRoute roles={['BUSINESS_ADMIN', 'ROLE_BUSINESS']}>
                  <BusinessDashboard />
                </ProtectedRoute>
              } />
              <Route path="/business-register" element={<BusinessRegisterForm />} />
              <Route path="/business-register-form" element={<BusinessRegisterForm />} />
              <Route path="/api-test" element={<ApiTester />} />
              <Route path="/test-connection" element={<TestConnection />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
