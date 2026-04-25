// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, increment, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let db = null;

try {
  // Only initialize if we have a real config
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'REPLACE_WITH_YOUR_KEY') {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.warn('Firebase config missing or invalid. Firestore features will be disabled.');
  }
} catch (error) {
  console.error('Firebase initialization error', error);
}

const DEFAULT_QUESTIONS = [
  'How do I check my voter registration?',
  'Where is my polling booth?',
  'Can I vote with Aadhaar only?',
];

const CATEGORY_TO_QUESTION_MAP = {
  registration: 'How to register to vote?',
  booth: 'Where is my polling booth?',
  voter_id: 'What ID is needed to vote?',
  evm: 'How to use an EVM?',
  nota: 'What is NOTA?',
  complaints: 'How to report violations?',
};

/**
 * Logs a question category to Firestore to aggregate "Most Asked" data.
 * @param {string} category 
 */
export async function logQuestionCategory(category) {
  if (!db || !category || category === 'guardrail') return;

  try {
    const docRef = doc(db, 'question_categories', category);
    await setDoc(docRef, { count: increment(1) }, { merge: true });
  } catch (error) {
    console.error('Failed to log question category', error);
  }
}

/**
 * Retrieves the top 3 categories from Firestore to populate "Most Asked Today"
 * @returns {Promise<string[]>} Array of questions
 */
export async function getTopCategories() {
  if (!db) return DEFAULT_QUESTIONS;

  try {
    const q = query(
      collection(db, 'question_categories'),
      orderBy('count', 'desc'),
      limit(3)
    );
    
    const querySnapshot = await getDocs(q);
    const topQuestions = [];
    
    querySnapshot.forEach((doc) => {
      const cat = doc.id;
      if (CATEGORY_TO_QUESTION_MAP[cat]) {
        topQuestions.push(CATEGORY_TO_QUESTION_MAP[cat]);
      }
    });

    if (topQuestions.length > 0) {
      return topQuestions;
    }
    return DEFAULT_QUESTIONS;
  } catch (error) {
    console.error('Failed to fetch top categories', error);
    return DEFAULT_QUESTIONS;
  }
}
