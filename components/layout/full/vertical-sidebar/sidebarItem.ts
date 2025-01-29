import {
    CurrencyDollarIcon,
    LayoutDashboardIcon, LogoutIcon,
    ZoomMoneyIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'Home' },
    {
        title: 'Dashboard',
        icon: LayoutDashboardIcon,
        to: '/dashboard'
    },
    { header: 'Functions' },
    {
        title: 'Finances',
        icon: CurrencyDollarIcon,
        to: '/finances/list'
    },
    { header: 'More' },
    {
        title: 'Logout',
        icon: LogoutIcon,
        to: '/auth/login'
    },
];

export default sidebarItem;
