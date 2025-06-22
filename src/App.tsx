import './App.css';
import Card from './components/Card.tsx';
import { ActiveCardProvider } from './stores/activeCard/ActiveCardProvider.tsx';
import { OrientationProvider } from './stores/Orientation.tsx';

function App() {
  return (
    <>
      React Card CSS Example
      <div>
        <OrientationProvider>
          <ActiveCardProvider>
            <Card
              id={'swsh12pt5-160'}
              name={'Pikachu'}
              number={'160'}
              set={'swsh12pt5'}
              types={'Lightning'}
              img={'https://images.pokemontcg.io/swsh12pt5/160_hires.png'}
            />
          </ActiveCardProvider>
        </OrientationProvider>
      </div>
    </>
  );
}

export default App;
