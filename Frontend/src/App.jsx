import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen }         from './Home/HomeScreen';
import { ServicesScreen }     from './Services/ServicesScreen';
import { PortfolioScreen }    from './Portfolio/PortfolioScreen';
import { ProductsScreen }     from './Products/ProductsScreen';
import { BookingScreen }      from './Booking/BookingScreen';
import { ConfirmationScreen } from './Confirmation/ConfirmationScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<HomeScreen />} />
        <Route path="/services"     element={<ServicesScreen />} />
        <Route path="/portfolio"    element={<PortfolioScreen />} />
        <Route path="/products"     element={<ProductsScreen />} />
        <Route path="/booking"      element={<BookingScreen />} />
        <Route path="/confirmation" element={<ConfirmationScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
