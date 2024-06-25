import { useEffect, useState } from 'react';
import './App.css';
import { 
	getMediaResults,
	getTopicWordsBetweenDates,
	getDatesForWord
} from './firebase';
import { set } from 'firebase/database';

function App() {
	const [topicWordsData, setTopicWordsData] = useState([]);
	const [datesForWord, setDatesForWord] = useState([]);

    useEffect(() => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const endDate = new Date('2024-06-30T23:59:59Z');

        const fetchTopicWords = async () => {
            try {
                const data = await getTopicWordsBetweenDates(startDate, endDate);
                setTopicWordsData(data);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };

        fetchTopicWords();
    }, []);
	useEffect(() => {
		const word = 'castillo';
		const fetchDates = async () => {
			try {
				const data = await getDatesForWord(word);
				setDatesForWord(data);
			}
			catch (error) {
				console.error('Error fetching documents: ', error);
			}
		}
		fetchDates();
	}
	, []);
    return (
        <div>
            <h2>Topic Words Between Dates</h2>
           
        </div>
    );
}
export default App;
