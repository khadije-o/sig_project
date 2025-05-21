import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import AdminLeftSidebar from "./left-sidebar/AdminLeftSidebar";
import UserLeftSidebar from "./left-sidebar/UserLeftSidebar";

const SideBarRouter = ({
    isLeftSidebarCollapsed,
    setIsLeftSidebarCollapsed,
  }: {
    isLeftSidebarCollapsed: boolean;
    setIsLeftSidebarCollapsed: (val: boolean) => void;
  }) => {
    const authContext = useContext(AuthContext);
  
    if (!authContext?.user) return null;
  
    return authContext.user.is_staff ? (
      <AdminLeftSidebar
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
        changeIsLeftSidebarCollapsed={setIsLeftSidebarCollapsed}
        logoutUser={authContext.logoutUser}
      />
    ) : (
      <UserLeftSidebar
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
        changeIsLeftSidebarCollapsed={setIsLeftSidebarCollapsed}
        logoutUser={authContext.logoutUser}
      />
    );
  };
  
  export default SideBarRouter;