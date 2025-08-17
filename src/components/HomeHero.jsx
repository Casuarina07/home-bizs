import { useNavigate } from "react-router-dom";
import "../styles/HomeHero.css";

export default function HomeHero() {
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate("/menu"); // redirect to Menu page
  };

  return (
    <section className="hero">
      <div className="hero__inner">
        {/* Left text */}
        <div className="hero__copy">
          <h1 className="hero__title">
            Bringing Home <br />
            Businesses Closer to You. <br />
          </h1>

          <p className="hero__subtitle">
            Empowering home entrepreneurs while bringing unique products to your
            doorstep.
          </p>

          <div className="hero__actions">
            <button className="hero__cta" onClick={handleOrder}>
              ORDER NOW
            </button>
          </div>
        </div>

        {/* Right image */}
        <div className="hero__visual">
          <img
            className="hero__img"
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1600&auto=format&fit=crop"
            alt="Delivery person"
          />

          {/* Restaurant of the Month Highlight */}
          <div className="hero__highlight">
            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=400&auto=format&fit=crop"
              alt="Restaurant of the Month"
            />
            <div>
              <div className="hero__highlight-sub">Restaurant of the Month</div>
              <div className="hero__highlight-title">ABC Singapore TEST</div>
            </div>
          </div>

          <div className="hero__frame" />
        </div>
      </div>
    </section>
  );
}
