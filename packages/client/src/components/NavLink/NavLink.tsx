import {
  NavLink as ReactRouterNavLink,
  NavLinkProps as ReactRouterNavLinkProps,
} from 'react-router';

import styles from './NavLink.module.css';

export interface NavLinkProps extends ReactRouterNavLinkProps {}

export const NavLink = (props: NavLinkProps) => {
  return (
    <ReactRouterNavLink
      {...props}
      className={({ isActive }) => {
        return [styles.NavLink, isActive ? styles['NavLink-active'] : ''].join(
          ' '
        );
      }}
    />
  );
};
