import logoImage from '../assets/logo.png';

const Logo = ({ className = "w-32 h-32" }) => {
  return (
    <div className={className}>
      <img 
        src={logoImage} 
        alt="Craly Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;

