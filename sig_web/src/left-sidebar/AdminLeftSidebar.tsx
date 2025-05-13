
import { Link, NavLink } from "react-router-dom";
import "./left-sidebar.css";
import classNames from "classnames";
import { Fragment } from "react/jsx-runtime";

type LeftSidebarProps = {
  isLeftSidebarCollapsed: boolean;
  changeIsLeftSidebarCollapsed: (isLeftSidebarCollapsed: boolean) => void;
  logoutUser: () => void;
};

const LeftSidebar = ({
  isLeftSidebarCollapsed,
  changeIsLeftSidebarCollapsed,
  logoutUser,
}: LeftSidebarProps) => {
  const items = [
    {
      routerLink: "/fishebesoinsAdmin",
      icon: "fal fa-folder-open",
      label: "Fishe Besoins",
    },
    {
      routerLink: "/groupfichebesoins",
      icon: "fal fa-folder-tree",
      label: "GroupFicheBesoins",
    },
    {
      routerLink: "/designation",
      icon: "fal fa-tag",
      label: "Designation",
    },
    {
      routerLink: "/consolidation",
      icon: "fal fa-layer-group",
      label: "Consolidation",
    },
    {
      routerLink: "/devis",
      icon: "fal fa-file-invoice-dollar",
      label: "Devis",
    },
    {
      routerLink: "/bondecomnd",
      icon: "fal fa-receipt",
      label: "Bon des commandes",
    },
    {
      routerLink: "/virement",
      icon: "fal fa-exchange-alt",
      label: "Virement",
    },
    {
      routerLink: "/gestionusers",
      icon: "fal fa-users",
      label: "GestionUsers",
    },
  
  ];

  const sidebarClasses = classNames({
    sidenav: true,
    "sidenav-collapsed": isLeftSidebarCollapsed,
  });

  const closeSidenav = () => {
    changeIsLeftSidebarCollapsed(true);
  };

  const toggleCollapse = (): void => {
    changeIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  };

  return (
    <div className={sidebarClasses}>
      <div className="logo-container">
        <button className="logo" onClick={toggleCollapse}>
          <i className="fal fa-bars"></i>
        </button>
        {!isLeftSidebarCollapsed && (
          <Fragment>
            <div className="logo-text">MPN</div>
            <button className="btn-close" onClick={closeSidenav}>
              <i className="fal fa-times close-icon"></i>
            </button>
          </Fragment>
        )}
      </div>

      <ul className="sidenav-nav">
        {items.map((item) => (
          <li key={item.label} className="sidenav-nav-item">
            <NavLink
              to={item.routerLink}
              className={({ isActive }) =>
                classNames("sidenav-nav-link", { active: isActive })
              }
            >
              <i className={classNames("sidenav-link-icon", item.icon)}></i>
              {!isLeftSidebarCollapsed && (
                <span className="sidenav-link-text">{item.label}</span>
              )}
            </NavLink>
          </li>
        ))}
        {/* Logout item */}
        <li className="sidenav-nav-item" onClick={logoutUser}>
          <div className="sidenav-nav-link" style={{ cursor: "pointer" }}>
            <i className="fal fa-sign-out sidenav-link-icon"></i>
            {!isLeftSidebarCollapsed && (
              <span className="sidenav-link-text">Logout</span>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;