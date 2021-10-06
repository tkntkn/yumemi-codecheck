import { useState } from 'react';
import ReactDOM from 'react-dom';
import "./main.scss";

function App() {
	const [count, setCount] = useState(0);
	return (
		<div className="app">
			<div className="app__count">{count}</div>
			<button className="app__countButton" onClick={() => setCount(count => ++count)}>Count Up</button>
		</div>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
