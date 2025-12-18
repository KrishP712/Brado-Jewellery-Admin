import { configureStore } from "@reduxjs/toolkit";
import mediaSlice from "./slice/media";
import cetagoryslice from "./slice/category";
import productSlice from "./slice/product";
import filterslice from "./slice/filter";
import filteroptionslice from "./slice/filteroption"
import adminslice from "./slice/adminauth"
import couponslice from "./slice/coupon"
import testimonialslice from "./slice/testimonial"
import userslice from "./slice/user"
import carouselslice from "./slice/carousel"
import orderslice from './slice/order'
import offerslice from './slice/offer'
export const store = configureStore({
    reducer: {
        media: mediaSlice,
        category: cetagoryslice,
        product: productSlice,
        filter: filterslice,
        filteroption: filteroptionslice,
        admin: adminslice,
        coupon: couponslice,
        testimonial: testimonialslice,
        user: userslice,
        carousel:carouselslice,
        order:orderslice,
        offer:offerslice
    },
});

