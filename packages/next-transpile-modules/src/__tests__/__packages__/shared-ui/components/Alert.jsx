import './Alert.scss';

function Alert(props) {
  return <textarea className='alert' defaultValue={props.children} />;
}

export default Alert;
