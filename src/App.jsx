import "./App.scss";
import Experience from "./Experience/Experience";
import Modal from "./components/Modal/Modal";
import AudioToggleButton from "./components/AudioToggleButton/AudioToggleButton";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import InfoButton from "./components/InfoButton/InfoButton";
import ExploreButton from "./components/ExploreButton/ExploreButton";

function App() {
  return (
    <>
      <LoadingScreen />
      <AudioToggleButton />
      <InfoButton />
      <ExploreButton />
      <Modal />
      <Experience />
    </>
  );
}

export default App;
