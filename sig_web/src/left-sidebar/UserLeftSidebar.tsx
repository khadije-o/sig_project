import { Link } from "react-router-dom";
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
      routerLink: "/fishebesoinsUser",
      icon: "fal fa-home",
      label: "Fishe Besoins",
    },
    {
      routerLink: "/products",
      icon: "fal fa-box-open",
      label: "Products",
    },
    {
      routerLink: "/pages",
      icon: "fal fa-file",
      label: "Pages",
    },
    {
      routerLink: "/settings",
      icon: "fal fa-cog",
      label: "Settings",
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

      <div className="sidenav-nav">
        {items.map((item) => (
          <li key={item.label} className="sidenav-nav-item">
            <Link className="sidenav-nav-link" to={item.routerLink}>
              <i
                className={classNames("sidenav-link-icon", item.icon)}
              ></i>
              {!isLeftSidebarCollapsed && (
                <span className="sidenav-link-text">{item.label}</span>
              )}
            </Link>
          </li>
        ))}

        {/* Logout item */}
        <li className="sidenav-nav-item" onClick={() => logoutUser()}> {/* Appel explicite de la fonction */}
        <div className="sidenav-nav-link" style={{ cursor: "pointer" }}>
          <i className="fal fa-sign-out sidenav-link-icon"></i>
          {!isLeftSidebarCollapsed && (
            <span className="sidenav-link-text">Logout</span>
          )}
        </div>
      </li>
      </div>
    </div>
  );
};

export default LeftSidebar;
