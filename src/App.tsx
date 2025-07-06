import PhotoCard from './components/PhotoCard';
import './App.css';

function App() {
  return (
    <div className="App">
      React Card CSS Example
      <br />
      <PhotoCard
        frontImage="https://images.pokemontcg.io/swsh12pt5/160_hires.png"
        backImage="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
      />
    </div>
  );
}

export default App;
