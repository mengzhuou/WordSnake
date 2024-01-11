import { useNavigate, useLocation } from "react-router-dom";

const FooterNav = () => {
  const navigate = useNavigate();

  return (
    <footer>
        <div className="footer-text">
            Designed with &#10084; by 
        </div>
        <div className="footer-find-me">
            <a href="https://mengzhuou.github.io/">Mengzhu Ou</a>
        </div>
    </footer>
  );
};

export default FooterNav;