import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const scoreCollection = collection(db, 'scores');

export const saveScore = async (score) => {
  await addDoc(scoreCollection, score);
};

export const getTopScores = async () => {
  const q = query(scoreCollection, orderBy('attempts'), orderBy('time'), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};