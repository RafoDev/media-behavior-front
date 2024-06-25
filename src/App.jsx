import { useEffect, useState } from 'react';
import './App.css';
import { getMediaResults } from './firebase';

function App() {
	const [results, setResults] = useState([]);

	useEffect(() => {
		getMediaResults().then(setResults);
	}, []);

	return (
		<>
			<input type="text" />
			<input type="date" name="" id="" />
			<button>Buscar</button>
			<ul>
				{results ? (
					results.map((result) => <li key={result.id}>{result.id}</li>)
				) : (
					<p>No results</p>
				)}
			</ul>
		</>
	);
}

export default App;
