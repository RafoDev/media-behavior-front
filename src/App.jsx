import React, { useState } from 'react';
import './App.css';
import { getWordByDate } from './firebase';
import { useForm } from './hooks/useForm';

function App() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const pageSize = 5;
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

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newResults = await getWordByDate(
                queryWord,
                queryDateRangeBegin,
                queryDateRangeEnd,
                pageSize
            );

            setResults(newResults);
            if (newResults.length > 0) {
                setLastDoc(newResults[newResults.length - 1].creationTime);
            }

        } catch (error) {
            console.error('Error al buscar:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        setLoading(true);

        try {
            const newResults = await getWordByDate(
                queryWord,
                queryDateRangeBegin,
                queryDateRangeEnd,
                pageSize,
                lastDoc
            );

            setResults([...results, ...newResults]);
            if (newResults.length > 0) {
                setLastDoc(newResults[newResults.length - 1].creationTime);
            }

        } catch (error) {
            console.error('Error al cargar más resultados:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="header">
                <nav className="nav">
                    <div className="nav__container">
                        <h1 className="nav__app-name">🎯 TubeTrends</h1>
                    </div>
                </nav>
            </header>
            <main className="main">
                <div className="main__container">
                    <form className="form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="form__input"
                            placeholder="s0m3th1ng"
                            name="queryWord"
                            value={queryWord}
                            onChange={onInputChange}
                        />
                        <button className="form__button" type="submit">
                            🔎
                        </button>
                    </form>
                </div>
                <section className="results">
                    <p className="results__title">
                        Resultados <span className="results__num">{results.length}</span>
                    </p>
                    <ul className="results__list">
                        {results.map((result, index) => (
                            <li className="result" key={index}>
                                <p className="result__date">📅 {result.creationTime}</p>
                                <div className="result__words">
                                    {result.topicWords.map((word, idx) => (
                                        <p className="result__word" key={idx}>{word}</p>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {loading && <p>Cargando...</p>}
                    {results.length > 0 && !loading && (
                        <button className="form__button" onClick={loadMore}>
                            Cargar más
                        </button>
                    )}
                </section>
            </main>
        </>
    );
}

export default App;