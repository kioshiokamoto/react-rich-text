import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const App = () => {
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	const onChange = (e) => setEditorState( e );
	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			onChange(newState);
			return 'handled';
		}

		return 'not-handled';
	};
    const onBoldClick = () =>{
        onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }

	return (
		<div>
            <button onClick={onBoldClick}>Bold</button>
			<Editor 
                editorState={editorState} 
                handleKeyCommand={handleKeyCommand}
                onChange={onChange}
            />
		</div>
	);
};

export default App;
