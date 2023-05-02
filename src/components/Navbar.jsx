import logo from "../images/logo.png";

function Navbar() {
  return (
    <div className="navbar bg-base-100" style={{ background: "#0B0819" }}>
      <div className="navbar-start">
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke=" #627eea"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content  shadow bg-base-100 rounded-box w-52 "
            style={{ background: "#0B0819" }}
          >
            <li>
              <a className="navbar-dropdown-btn-active ">Trade</a>
            </li>
            <li>
              <a className="navbar-dropdown-btn-deactivated btn-disabled">
                Earn
              </a>
            </li>
            <li>
              <a className="navbar-dropdown-btn-deactivated btn-disabled">
                Support
              </a>
            </li>
            <li>
              <a className="navbar-dropdown-btn-deactivated btn-disabled">
                About
              </a>
            </li>
          </ul>
        </div>
        <div style={{ display: "inline-flex" }} className="px-4">
          <img src={logo} alt="logo" className="m-2" />
          <a className="logo-text  normal-case text-xl">NeoFi</a>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex pr-16">
        <ul className="menu menu-horizontal px-1 ">
          <li className="navbar-underline"></li>
          <li>
            <a className="btn btn-disabled btn-ghost navbar-btn-active ">
              Trade
            </a>
          </li>
          <li>
            <a className="btn btn-ghost navbar-btn-deactivated btn-disabled">
              Earn
            </a>
          </li>
          <li>
            <a className="btn btn-ghost navbar-btn-deactivated btn-disabled">
              Support
            </a>
          </li>
          <li>
            <a className="btn btn-ghost navbar-btn-deactivated btn-disabled">
              About
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end pr-6">
        <a className="btn navbar-btn-end">Connect Wallet</a>
      </div>
    </div>
  );
}
export default Navbar;
