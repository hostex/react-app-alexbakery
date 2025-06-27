import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CarouselBox from './components/CarouselBox';
import ProductsPage from './pages/ProductsPage';
import ContactsPage from './pages/ContactsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarouselBox />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </Router>
  );
}

export default App;