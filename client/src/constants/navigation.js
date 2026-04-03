import { 
  LayoutDashboard, BedDouble, Users, BarChart3, 
  CalendarDays, CreditCard, ClipboardList, BellRing, 
  Coffee, Receipt
} from 'lucide-react';
import { ROLES } from './roles';

export const SIDEBAR_LINKS = {
  [ROLES.ADMIN]: [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Rooms', path: '/admin/rooms', icon: BedDouble },
    { name: 'Staff Directory', path: '/admin/staff', icon: Users },
    { name: 'Financial Reports', path: '/admin/reports', icon: BarChart3 },
  ],
  [ROLES.RECEPTIONIST]: [
    { name: 'Front Desk', path: '/receptionist', icon: LayoutDashboard },
    { name: 'Bookings', path: '/receptionist/bookings', icon: CalendarDays },
    { name: 'Guest Directory', path: '/receptionist/guests', icon: Users },
    { name: 'Billing', path: '/receptionist/billing', icon: CreditCard },
  ],
  [ROLES.STAFF]: [
    { name: 'Task Board', path: '/staff', icon: ClipboardList },
    { name: 'Room Status', path: '/staff/rooms', icon: BedDouble },
    { name: 'Service Requests', path: '/staff/requests', icon: BellRing },
    { name: 'My Schedule', path: '/staff/schedule', icon: CalendarDays },
  ],
  [ROLES.GUEST]: [
    { name: 'My Stay', path: '/guest', icon: BedDouble },
    { name: 'Order Service', path: '/guest/services', icon: Coffee },
    { name: 'My Bill', path: '/guest/bill', icon: Receipt },
    { name: 'Profile', path: '/guest/profile', icon: Users },
  ]
};