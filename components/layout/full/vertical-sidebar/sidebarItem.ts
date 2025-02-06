import {
    CurrencyDollarIcon,
    LayoutDashboardIcon,
    UsersGroupIcon,
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
    { header: 'Financial' },
    {
        title: 'Finances',
        icon: CurrencyDollarIcon,
        to: '/finances/list',
        //children: [
        //    {
        //        title: 'List',
        //        to: '/finances/list',
        //    }
        //]
    },
    { header: 'Register' },
    {
        title: 'Groups',
        icon: UsersGroupIcon,
        to: '/groups/list',
        //children: [
        //    {
        //        title: 'List',
        //        to: '/finances/list',
        //    }
        //]
    },
];

export default sidebarItem;
