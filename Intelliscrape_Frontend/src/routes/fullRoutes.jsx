import React from 'react'
import Home from '../components/Home'
import UserSignUp from '../components/userSignUp'
import UserLogin from '../components/userLogin'
import TermsnConditions from '../components/TermsnConditions'
import PrivacyPolicy from '../components/PrivacyPolicy'

const fullRoutes = [
    {path: '/', element: <Home />},
    {path: '/signup', element: <UserSignUp />},
    {path: '/login', element: <UserLogin />},
    {path: '/terms-and-conditions', element: <TermsnConditions />},
    {path: '/privacy-policy', element: <PrivacyPolicy />},
]

export default fullRoutes