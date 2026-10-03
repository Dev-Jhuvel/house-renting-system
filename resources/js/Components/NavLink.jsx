import { Link } from '@inertiajs/react';
import { forwardRef } from 'react';

const NavLink = forwardRef(function NavLink(
    {
        active = false,
        className = '',
        children,
        ...props
    },
    ref
) {
    return (
        <Link
            ref={ref}
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-primary text-primary focus:border-primary/90'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-white-700') +
                className
            }
        >
            {children}
        </Link>
    );
});

export default NavLink;