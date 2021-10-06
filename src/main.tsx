import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
	const [count, setCount] = useState(0);
	return (
		<div>
			{count}
			<button onClick={() => setCount(count => ++count)}>Count Up</button>
		</div>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
