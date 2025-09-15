import React from 'react';
import {
    Wallet, PiggyBank, Landmark, CreditCard, Gem, Target, TrendingUp, Briefcase,
    Home, Car, Plane, Pizza, ShoppingCart, Gamepad2, Book, Music, Pill,
    Users, Gift, Wrench, Smartphone, Laptop, AlertCircle
} from 'lucide-react';

export const availableIcons = {
    'wallet': Wallet,
    'piggy-bank': PiggyBank,
    'landmark': Landmark,
    'credit-card': CreditCard,
    'gem': Gem,
    'target': Target,
    'trending-up': TrendingUp,
    'briefcase': Briefcase,
    'home': Home,
    'car': Car,
    'plane': Plane,
    'pizza': Pizza,
    'shopping-cart': ShoppingCart,
    'gamepad-2': Gamepad2,
    'book': Book,
    'music': Music,
    'pill': Pill,
    'users': Users,
    'gift': Gift,
    'wrench': Wrench,
    'smartphone': Smartphone,
    'laptop': Laptop,
};

export const defaultIcon = 'wallet';

export const IconComponent = ({ name, ...props }) => {
    const Icon = availableIcons[name] || AlertCircle;
    return React.createElement(Icon, props);
};