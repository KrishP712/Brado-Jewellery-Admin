import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CommonLayout from '../../layout/CommonLayout/Wrapper'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import Dashboard from '../Dashboard'
import Products from '../Products'
import Order from '../Order'
import Customers from '../Customers'
import Inventory from '../Inventory'
import Reports from '../Reports'
import Settings from '../Settings'
import Media from '../Media'
import AuthLayout from '../../layout/AuthLayout/AuthLayout'
import Login from '../../pages/auth/singIn/Login'
import Category from '../Category'
import FilterFun from '../Filter'
import Coupon from '../Coupon'
import Testimonial from '../Testimonial'
import Carousel from '../Carousel'
import Offer from '../Offer'
function Routings() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<Login />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<CommonLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/media" element={<Media />} />
          <Route path='/category' element={<Category />} />
          <Route path="/filter" element={<FilterFun />} />
          <Route path="/coupon" element={<Coupon />} />
          <Route path='/testimonial' element={<Testimonial />} />
          <Route path='/carousel' element={<Carousel />} />
          <Route path='/offer' element={<Offer />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default Routings