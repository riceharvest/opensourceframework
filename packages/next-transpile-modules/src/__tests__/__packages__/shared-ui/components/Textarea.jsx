import './Textarea.css';

function Textarea(props) {
  return <textarea type='text' className='textarea' defaultValue={props.children} />;
}

export default Textarea;
