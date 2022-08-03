import styled from "styled-components";
import { Trivia } from "./components/Trivia";

function App() {
  return (
    <TriviaPage>
      <Heading>
        <h1>Nerd Trivia</h1>
      </Heading>
      <Trivia />
    </TriviaPage>
  );
}

export default App;

const TriviaPage = styled.main`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  color: white;
`;
const Heading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
