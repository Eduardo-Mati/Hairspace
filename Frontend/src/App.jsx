import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen }         from './Home/HomeScreen';
import { BarbershopScreen }   from './Barbershops/BarbershopScreen';
import { PortfolioScreen }    from './Portfolio/PortfolioScreen';
import { ProductsScreen }     from './Products/ProductsScreen';
import { BookingScreen }      from './Booking/BookingScreen';
import { ConfirmationScreen } from './Confirmation/ConfirmationScreen';
import { LoginScreen }        from './Authentication/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<HomeScreen />} />
        <Route path="/login"        element={<LoginScreen />} />
        <Route path="/barbershops/:barbershopId" element={<BarbershopScreen />} />
        <Route
          path="/barbershops/:barbershopId/services/:serviceId/booking"
          element={<BookingScreen />}
        />
        <Route path="/services"     element={<Navigate to="/" replace />} />
        <Route path="/booking"      element={<Navigate to="/" replace />} />
        <Route path="/portfolio"    element={<PortfolioScreen />} />
        <Route path="/products"     element={<ProductsScreen />} />
        <Route path="/confirmation" element={<ConfirmationScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
