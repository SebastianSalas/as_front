import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoutes";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import AuthContext from "./context/AuthContext";
// import StaffMembersIndexPage from "./pages/StaffMembersIndexPage";
import { useContext } from "react";
import ShowCarsPage from "./pages/ShowCarsPage";
// import AddStaffMember from "./pages/AddStaffMember";
// import EditStaffMember from "./pages/EditStaffMember";
import AddCar from "./pages/AddCarPage";
import CarDetail from "./pages/CarDetail";
import ReportPage from "./pages/ReportPage";
import VehicleQuotationsIndexPage from "./pages/VehicleQuotationsIndexPage";
import InfoClientPage from "./pages/InfoClientePage";
import VehicleQuotation from "./pages/VehicleQuotationPage";

export default function App() {
  let { user } = useContext(AuthContext);
  return (
    <Routes>
      {/*<Route path="/" element={
        !user ? <Navigate to="/login" /> : <HomePage />
      } />*/}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/sign_up"
        element={!user ? <SignupPage /> : <Navigate to="/" />}
      />
      {/* <Route path="/staff_members" element={<StaffMembersIndexPage/>}/> */}
      <Route
        path="/vehicle_quotations"
        element={<VehicleQuotationsIndexPage />}
      />
      <Route path="/vehicle_quotation/:id" element={<VehicleQuotation />} />
      <Route path="/show_cars" element={<ShowCarsPage />} />
      {/* <Route path="/add_staff" element={<AddStaffMember/>}/> */}
      <Route path="/add_car" element={<AddCar />} />
      {/* <Route path="/staff_member/:id/edit" element={<EditStaffMember />} /> */}
      <Route path="/car/:id/show" element={<CarDetail />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/quotation/:id/show" element={<InfoClientPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
