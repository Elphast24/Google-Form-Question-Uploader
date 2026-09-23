import '../styles/global.css';

interface LoaderProps {
  text?: string;
}

const Loader = ({ text = 'Loading...' }: LoaderProps) => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
