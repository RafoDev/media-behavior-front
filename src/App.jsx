import { useEffect, useState } from 'react';
import './App.css';
import {
	getWordByDate,
} from './firebase';
import { useForm } from './hooks/useForm';

function App() {
	const [topicWordsData, setTopicWordsData] = useState([]);
	const [datesForWord, setDatesForWord] = useState([]);

	const [results, setResults] = useState([]);
	const {
		queryWord,
		queryDateRangeBegin,
		queryDateRangeEnd,
		onInputChange,
		onResetForm,
	} = useForm({
		queryWord: '',
		queryDateRangeBegin: '',
		queryDateRangeEnd: '',
	});

	const onSearch = (e) => {
		e.preventDefault();
		console.log({ queryWord, queryDateRangeBegin, queryDateRangeEnd });
		getWordByDate(queryWord, queryDateRangeBegin, queryDateRangeEnd).then(
			setResults
		);
		// console.log(results)
		// onResetForm();
	};

	// useEffect(() => {
	//     const startDate = new Date('2023-01-01T00:00:00Z');
	//     const endDate = new Date('2024-06-30T23:59:59Z');

	//     const fetchTopicWords = async () => {
	//         try {
	//             const data = await getTopicWordsBetweenDates(startDate, endDate);
	//             setTopicWordsData(data);
	//         } catch (error) {
	//             console.error('Error fetching documents: ', error);
	//         }
	//     };

	//     fetchTopicWords();
	// }, []);

	// useEffect(() => {
	// 	const word = 'castillo';
	// 	const fetchDates = async () => {
	// 		try {
	// 			const data = await getDatesForWord(word);
	// 			setDatesForWord(data);
	// 		}
	// 		catch (error) {
	// 			console.error('Error fetching documents: ', error);
	// 		}
	// 	}
	// 	fetchDates();
	// }
	// , []);
	return (
		<>
			<header className="header">
				<nav className="nav">
					<div className="nav__container">
						<h1 className="nav__app-name"> 🎯 TubeTrends</h1>
					</div>
				</nav>
			</header>
			<main className="main">
				<div className="main__container">
					<form className="form">
						<input
							type="text"
							className="form__input"
							placeholder="s0m3th1ng"
							name="queryWord"
							value={queryWord}
							onChange={onInputChange}
						/>
						{/* <input
							type="date"
							className="form__date-beg"
							name="queryDateRangeBegin"
							id="dateBegin"
							value={queryDateRangeBegin}
							onChange={onInputChange}
						/>
						<input
							type="date"
							className="form__date-end"
							name="queryDateRangeEnd"
							id="dateEnd"
							value={queryDateRangeEnd}
							onChange={onInputChange}
						/> */}
						<button className="form__button" onClick={onSearch}>
							🔎
						</button>
					</form>
				</div>
				<section className="results">
					<p className="results__title">
						Resultados <span className="results__num">{results.length}</span>{' '}
					</p>
					<ul className="results__list">

						{
							results.map(result => (
							<li className="result" key={result.id}>
								<p className="result__date"> 📅 {result.creationTime}</p>
								<div className="result__words">
									{result.topicWords?.map(word => 
											<p className="result__word">{word}</p>
									)}
								</div>
							</li>
							))
						}
					</ul>
				</section>
			</main>
		</>
	);
}
export default App;
