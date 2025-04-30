// src/layout/Layout.tsx

import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import LeftSidebar from "../left-sidebar/UserLeftSidebar";

const Layout = () => {
  const { logoutUser } = useContext(AuthContext)!;
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  return (
    <LeftSidebar
      isLeftSidebarCollapsed={isLeftSidebarCollapsed}
      changeIsLeftSidebarCollapsed={() => setIsLeftSidebarCollapsed(prev => !prev)}
      logoutUser={logoutUser}
    />
  );
};

export default Layout;
