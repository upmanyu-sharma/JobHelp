import links from "../utils/links";
import { NavLink } from "react-router-dom";

const NavLinks = ({ toggleSidebar }) => {
  return (
    <div className="nav-links">
      {links.map((item) => {
        const { text, id, icon, path } = item;
        return (
          <NavLink
            to={path}
            key={id}
            onClick={toggleSidebar}
            className={({ isActive }) => {
              return isActive ? "nav-link active" : "nav-link";
            }}
            end
          >
            <span className="icons" style={{ marginRight: "10px" }}>
              {" "}
              {icon}{" "}
            </span>{" "}
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
