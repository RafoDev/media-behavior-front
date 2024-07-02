import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore';
import { db } from './config';
const mediaResultsRef = collection(db, 'media_results');

const getMediaResults = async () => {
	const q = query(mediaResultsRef, limit(3));
	const querySnapshot = await getDocs(q);
	const mediaResults = querySnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
	return mediaResults;
};

const getTopicWordsBetweenDates = async (startDate, endDate) => {
	const q = query(
		mediaResultsRef,
		where('creationTime', '>=', '2023-01-01T00:00:00Z'),
		where('creationTime', '<=', '2024-06-30T23:59:59Z')
	);
	try {
		const querySnapshot = await getDocs(q);
		const camposSeleccionados = [
			'creationTime',
			'topicWords',
			'topicViews',
			'topicNums',
		];
		const documents = [];

		querySnapshot.forEach((doc) => {
			const document = {};
			camposSeleccionados.forEach((campo) => {
				document[campo] = doc.data()[campo];
			});
			documents.push({
				id: doc.id,
				...document,
			});
		});
		return documents;
	} catch (error) {
		console.error('Error al obtener documentos:', error);
		return [];
	}
};

const getDatesForWord = async (word) => {
	const q = query(
		mediaResultsRef,
		where('topicWords.0', 'array-contains', word)
	);

	try {
		const querySnapshot = await getDocs(q);
		const camposSeleccionados = ['creationTime'];

		const documents = [];
		console.log(querySnapshot);
		querySnapshot.forEach((doc) => {
			const document = {};
			camposSeleccionados.forEach((campo) => {
				document[campo] = doc.data()[campo];
			});
			documents.push({
				id: doc.id,
				...document,
			});
		});
		return documents;
	} catch (error) {
		console.error('Error al obtener documentos:', error);
		return [];
	}
};

const getMostCommonWords = async () => {
	const q = query(mediaResultsRef);

	try {
		const querySnapshot = await getDocs(q);
		const camposSeleccionados = ['topicWords.0'];

		const documents = [];

		querySnapshot.forEach((doc) => {
			const document = {};
			camposSeleccionados.forEach((campo) => {
				document[campo] = doc.data()[campo];
			});
			documents.push({
				id: doc.id,
				...document,
			});
		});

		const words = documents.map((doc) => doc.topicWords).flat();
		const wordCounts = words.reduce((acc, word) => {
			acc[word] = (acc[word] || 0) + 1;
			return acc;
		}, {});

		const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
		return sortedWords;
	} catch (error) {
		console.error('Error al obtener documentos:', error);
		return [];
	}
};

const getWordByDate = async (
	word,
	startDate,
	endDate,
	pageSize = 10,
	_startAfter = null
) => {
	let q = query(
		mediaResultsRef,
		where('topicWords.0', 'array-contains', word),
		// where('creationTime', '>=', startDate),
		// where('creationTime', '<=', endDate),
		orderBy('creationTime', 'desc'),
		limit(pageSize)
	);

	if (_startAfter) {
		q = query(q, startAfter(_startAfter));
	}

	try {
		const querySnapshot = await getDocs(q);
		const documents = [];

		querySnapshot.forEach((doc) => {
			const document = {
				id: doc.id,
				creationTime: doc.data().creationTime,
				topicWords: [],
			};

			if (
				typeof doc.data().topicWords === 'object' &&
				doc.data().topicWords !== null
			) {
				const values = Object.values(doc.data().topicWords);
				const flattenedWords = values.reduce((acc, val) => acc.concat(val), []);
				document.topicWords = flattenedWords;
			}

			documents.push(document);
		});

		return documents;
	} catch (error) {
		console.error('Error al obtener documentos:', error);
		return [];
	}
};

export {
	getMediaResults,
	getTopicWordsBetweenDates,
	getDatesForWord,
	getMostCommonWords,
	getWordByDate,
};
