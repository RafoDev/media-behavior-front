import {
	collection,
	getDocs,
	limit,
	query,
} from 'firebase/firestore';
import { db } from './config';

const mediaResultsRef = collection(db, 'media_results');

export const getMediaResults = async () => {
	const q = query(mediaResultsRef, limit(3))
	const querySnapshot = await getDocs(q);
	const mediaResults = querySnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data(),
	}));
	console.log(mediaResults)
	return mediaResults;
};
