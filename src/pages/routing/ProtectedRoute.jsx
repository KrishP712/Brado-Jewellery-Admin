import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../../Redux/slice/adminauth';

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    const token = localStorage.getItem("token");
    
    if (!token || !isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;