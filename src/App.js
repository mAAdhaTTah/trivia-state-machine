import styled from 'styled-components'
import { Trivia } from './components/Trivia'
import { CriteriaForm } from './components/Form'

function App() {
  return (
    <TriviaPage>
			<CriteriaForm />
			<Trivia />
    </TriviaPage>
  );
}

export default App;

const TriviaPage = styled.main `
	background-color: #282c34;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: calc(10px + 2vmin);
	color: white;
`
