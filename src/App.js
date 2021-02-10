import React, { useState } from 'react';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.css';

const App = () => {
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	const [convertedContent, setConvertedContent] = useState(null);

	const handleEditorChange = (state) => {
		setEditorState(state);
		convertContentToHTML();
	};
	const convertContentToHTML = () => {
		let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
		setConvertedContent(currentContentAsHTML);
	};

	const createMarkup = (html) => {
		return {
			__html: DOMPurify.sanitize(html),
		};
	};

	//Para subir imagen!
	function uploadImageCallBack(file) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('POST', 'https://api.imgur.com/3/image');
			xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
			const data = new FormData();
			data.append('image', file);
			xhr.send(data);
			xhr.addEventListener('load', () => {
				const response = JSON.parse(xhr.responseText);
				resolve(response);
			});
			xhr.addEventListener('error', () => {
				const error = JSON.parse(xhr.responseText);
				reject(error);
			});
		});
	}

	return (
		<div>
			<header className="App-header">Ejemplo de texto enriquecido</header>
			<Editor
				editorState={editorState}
				onEditorStateChange={handleEditorChange}
				wrapperClassName="wrapper-class"
				editorClassName="editor-class"
				toolbarClassName="toolbar-class"
				toolbar={{
					inline: { inDropdown: true },
					list: { inDropdown: true },
					textAlign: { inDropdown: true },
					link: { inDropdown: true },
					history: { inDropdown: true },
					image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
				}}
			/>

			<div className="preview" dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
		</div>
	);
};

export default App;
