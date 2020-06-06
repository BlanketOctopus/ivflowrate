'use strict';

class IVForm extends React.Component{
  constructor(props){
    super(props);
    /* Set Default State */
    this.state = {
      flowRate: 0,
      volume: 0,
      time: 0,
      unit: "h",
      flow: {
        rate: 0,
        unit: ""
      },
      checked: false
    };
  }

  /**
   * Calculate IV Flow Rate using following formulas
   * 
   * Without Pump
   *      Volume (mL)
   *      ----------- x Drop Factor (gtts/mL) = Y (Flow Rate in gtts/min)
   *       Time (min)
   * 
   * With Pump
   *       Volume (mL)
   *      ----------- = Y (Flow Rate in ml/hr)
   *        Time (hr)
   */
  calcIVFlowRate = (pumpEnabled) => {
    let unit, rate;
    if(pumpEnabled){
      rate = (this.state.volume / (this.state.unit == "m" ? this.state.time / 60 : this.state.time));
      unit = "ml/hr"
    }else{
      rate = (this.state.volume / (this.state.unit == "h" ? this.state.time * 60 : this.state.time)) * this.state.flow
      unit = "gtts/min"
    }
    return {rate: parseFloat(rate.toFixed(2)), unit: unit};
  }

  /* Event for Pump Checkbox */
  handleChecked = (event) => {
    this.setState({checked: event.target.checked}, this.calculate);
  }

  /* Event for Number Input Change */
  handleChange = (event) => {
    this.setState({[event.target.id]: event.target.value}, this.calculate);
  }


  /**
   * Set Flow Rate State to Calculated Flow Rate
   */
  calculate(){
    console.log('calc');
    const flowRate = this.calcIVFlowRate(this.state.checked);
    this.setState({
         flowRate: isNaN(flowRate.rate) ? {rate: 0, unit:""} : flowRate
    });
  }

  render(){
    return (
      <div id="container">
        <div>
          <label for="volume">Total Volume:</label>
          <input type="number" onChange={this.handleChange} min="1" max="1000" pattern="[0-9]" name="volume" id="volume" placeholder="ml"/>
        </div>
        <div>
          <label for="time">Infusion Time:</label>
          <div id="time-element">
            <input type="number" onChange={this.handleChange} min="1" max="999" pattern="[0-9]" name="time" id="time" placeholder="0"/>
            <select name="timetype" name="unit" id="unit" onChange={this.handleChange} value={this.state.unit}>
              <option value="m">Minutes</option>
              <option value="h">Hours</option>
            </select>
          </div>
        </div>
        <div>
          <input type="checkbox" name="pump" id="pump" onChange={this.handleChecked}/>
          <label for="pump">Using Pump/Rate Controlled Tubing</label>
        </div>
        <div>
          <label for="flow">Drop Factor:</label>
          <input type="number" onChange={this.handleChange} min="1" max="999" pattern="[0-9]" name="flow" id="flow" placeholder="gtts/ml" disabled={this.state.checked}/>
        </div>
        <div id="output" class="update">IV Flow Rate: {this.state.flowRate.rate} {this.state.flowRate.unit}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <IVForm />,
  document.querySelector('#IVForm')
);