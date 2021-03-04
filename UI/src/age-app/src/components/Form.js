import React from 'react';
import './Form.css'
import { judgeAge } from "../helpers.js"



const inputParsers = {
  number(input) {
    return parseFloat(input);
  },
  text(input) {
    return input.charAt(0).toUpperCase() + input.slice(1)
  }
};

class ShakingError extends React.Component {
	constructor() { super(); this.state = { key: 0 }; }

	componentWillReceiveProps() {
    // update key to remount the component to rerun the animation
  	this.setState({ key: ++this.state.key });
  }
  
  render() {
  	return <div key={this.state.key}>{this.props.text}</div>;
  }
}

class MyForm extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.target.checkValidity()) {
    	this.setState({
        invalid: true,
        displayErrors: true,
      });
      return;
    }
    const form = event.target;
    const data = new FormData(form);


    for (let name of data.keys()) {
      const input = form.elements[name];
      const parserName = input.dataset.parse;
      if (parserName) {
        const parsedValue = inputParsers[parserName](data.get(name))
        data.set(name, parsedValue);
      }
    }

    const dataToSend = stringifyFormData(data)
    const res = await judgeAge(dataToSend)
    const dataToDisplay = await res.json()
    this.setState({
      res: dataToDisplay,
      invalid: false,
      displayErrors: false,
    })

  }

  render() {
  	const { res, invalid, displayErrors } = this.state;
    return (
    	<div className="login-box">
        <form
          onSubmit={this.handleSubmit}
          noValidate
          className={displayErrors ? 'displayErrors' : ''}
         >
        <div className="user-box">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Peter"/>
          <label htmlFor="name">Name</label>

        </div>
        <div className="user-box">
          <input id="age" name="age" type="text" placeholder="95"/>
          <label htmlFor="age">Age</label>
        </div>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <button className="tn-anim4">Submit</button>
          </a>
        </form>
        
        <div className="res-block">
          {invalid && (
            <ShakingError text="Form is not valid" />
          )}
          {!invalid && res && res.age == 'old' && (
          	<div className="response-block">
              <h3>Oh no, it's {res.name} again</h3>
              <pre>Go away you <strong>{res.age}</strong> fart</pre>
          	</div>
          )}
          {!invalid && res && res.age == 'young' && (
          	<div className="response-block">
              <h3>Suuup, {res.name} ?</h3>
              <pre>How is it going, <strong>{res.age}</strong> blood </pre>
          	</div>
          )}
          {!invalid && res && res.description && (
          	<div className="response-block">
              <h3 style={{ color: 'red' }} >{res.description}</h3>
          	</div>
          )}
        </div>
    	</div>
    );
  }
}

function stringifyFormData(fd) {
  const data = {};
    for (let key of fd.keys()) {
      data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}

export default MyForm;
